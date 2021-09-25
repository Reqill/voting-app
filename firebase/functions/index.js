const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:   "localhost:8080" 
});

const express = require("express");

const authMiddleware = require('./authMiddleware.js');

const app = express();

const db = admin.firestore();
function sendListResponse(query,res,specialCase = ""){
    let response = [];
    if(specialCase!==""){
        Promise.all([query.get(),db.collection("vote").get(),db.collection("settings").doc("1").get()]).then(([candidatesSnapshot,votesSnapshot,settingsSnapshot])=>{
            let candidates = [[],[]];
            let settings = settingsSnapshot.data();
            if(settings.showResoults === true || specialCase === "specialShowing")
            {
                candidatesSnapshot.forEach((doc)=>{
                    candidates[0].push({...doc.data(),id:doc.id});
                    candidates[1].push(0);
                })
                votesSnapshot.forEach((doc)=>{
                    let vote = doc.data();
                    for(i = 0;i<candidates[0].length;i++){
                        if(candidates[0][i].id === vote.submitVote){
                            if(settings.startTime._seconds < vote.submitDate._seconds && vote.submitDate._seconds < settings.endTime._seconds){
                                candidates[1][i]++;
                            }
                            
                        }
                    }
                })
                if(specialCase === "specialShowing"){
                    for(i = 0;i<candidates[1].length;i++){
                        if(candidates[1][i]  >= settings.showNumber){
                            response.push(candidates[0][i]);
                        }
                    }
                }
                else if(specialCase === "countVotes" && settings.showResoults === true){
                    for(i = 0;i<candidates[1].length;i++){
                       response.push({...candidates[0][i], votes: candidates[1][i]})
                    }
                }
                return res.status(200).send(response);   
            }
            else{
                if(specialCase === "countVotes"){
                    return res.status(403).send({errorMessage:"Nie możesz jeszcze odczytać głosów"});   
                }
                else{
                    return res.status(403).send({errorMessage:"Nieoczekiwany błąd"});   
                }
            }
            
           
           
        })
    }
    else{
        console.log("I am not here");
        query.get()
        .then((querySnapshot) => {                   
            querySnapshot.forEach((doc) => { 
                if(typeof doc.data() != "undefined"){
                    temp = doc.data();
                    temp.id = doc.id;       
                    response.push(temp);
                }
                else{
                    return res.status(500).send({errorDescription: "Dokumend nie znaleziony"});
                }
               
        });
        return res.status(200).send(response);   
        })
    }
   
};
function sendSingleResponse(query,res,specialCase=""){
    query.get()
    .then((doc) => {    
        if(typeof doc.data() != "undefined"){
            temp = doc.data();
            temp.id = doc.id; 
            return res.status(200).send(temp);
        }  
        else{
            return res.status(500).send({errorDescription: "Document nie znaleziony"});
        }
})};
function AddToDb(type,req,res){
    var isValid = true;
    var verifiedData;
    var data = req.body;
    switch(type){
        // case "candidate":
        //     if( typeof data.fullName != "string"|| data.fullName == ""||
        //     typeof data.className != "string"|| data.shortName == "")
        //     {
        //         isValid = false;
        //     }
        //     else{
        //         verifiedData = {
        //             fullName:data.fullName,
        //             className:data.className
        //         };
        //     }
        //     break;
        case "vote":
            if(
            typeof data.submitVote != "string"|| data.submitVote == ""||
            typeof data.className != "string"|| data.className == ""||
            typeof data.sex != "string"|| data.sex == "")
            {
                isValid = false;
            }
            else{
                verifiedData = {
                    submitDate: new Date(),
                    submitVote:data.submitVote,
                    className:data.className,
                    sex:data.sex
                };
            }
            break;
        case "addCandidate":
            if(
            typeof data.classNameVoter != "string"|| data.classNameVoter == ""||
            typeof data.sex != "string"|| data.sex == ""||
            typeof data.fullName != "string"|| data.fullName == ""||
            typeof data.classNameCandidate != "string"|| data.classNameCandidate == "")
            {
                isValid = false;
            }
            else{
               db.collection("candidate").add(
                   {fullName:data.fullName, className:data.classNameCandidate}
               ).then((docRef)=>{
                   db.collection("vote").add(
                       {
                        submitDate:new Date(),
                        submitVote:docRef.id,
                        cassName:data.classNameVoter,
                        sex:data.sex
                       }
                   ).then(() =>{
                        return res.status(201).send({message:"dodano z powodzeniem"});
                   })
               })
            }
            break;
    }
    if(isValid){
        if(type!=="addCandidate"){
            db.collection(type).add(
                verifiedData             
            ).then((docRef) =>{
                return res.status(201).send({message:"dodano z powodzeniem"});
            })  
        }
              
    }else{
        return res.status(500).send({errorDescription: "Przesłane dane są w nieodpoweidnim formacie"});
    }
   

}
app.post('/api/vote', /*authMiddleware("vote"),*/(req,res) => {      
    try{
        AddToDb("vote",req,res)      
    }
    catch(error){
        return res.status(500).send({errorDescription: error});
    }   
});
app.post('/api/addCandidate', /*authMiddleware("vote"),*/(req,res) => {      
    try{
        AddToDb("addCandidate",req,res)      
    }
    catch(error){
        return res.status(500).send({errorDescription: error});
    }   
});
app.get('/api/candidates', /*authMiddleware("getCandidates"),*/(req,res) => {      
    try{
        if(req.query.specialShowing=="true"){
            sendListResponse(db.collection("candidate"),res,"specialShowing");  
        }
        else{
            sendListResponse(db.collection("candidate"),res);  
        }
    }
    catch(error){
        return res.status(500).send({errorDescription: error});
    }   
});
app.get('/api/votes', /*authMiddleware("getCandidates"),*/(req,res) => {      
    try{
        sendListResponse(db.collection("candidate"),res,"countVotes");
    }
    catch(error){
        return res.status(500).send({errorDescription: error});
    }   
});
//Export the api to Firebase 
exports.app = functions.region('europe-west1').https.onRequest(app);