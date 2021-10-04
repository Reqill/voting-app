const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./permissions.json");
var hash = require('object-hash');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const express = require("express");

const authMiddleware = require('./authMiddleware.js');
const app = express();
const db = admin.firestore();
const cors = require("cors");
app.use( cors());
function sendListResponse(query,res,specialCase = ""){
    let response = [];
    if(specialCase!==""){
        if(specialCase === "stats"){
            Promise.all([db.collection("candidate").get(),query.get(),db.collection("settings").doc("1").get()]).then(([candidatesSnapshot,votesSnapshot,settingsSnapshot])=>{
                settings = settingsSnapshot.data()
                if(settings.showResoults && settings.endTime._seconds < new Date().getTime()/1000){
                    
                  
                    let candidates = [[],[]];
                    let genderVotes = {};
                    let classVotes = {};
                    let classSexInfo = [[],[]];
                    let total = 0;
                    let hoursOfVoting = Math.ceil((settings.endTime._seconds-settings.startTime._seconds)/3600)
                    let totalByHour = [];
                    for(h=0;h<hoursOfVoting;h++){
                        totalByHour.push(0);
                    }
                    candidatesSnapshot.forEach(doc=>{
                        candidates[0].push({...doc.data(), id:doc.id});
                        candidates[1].push({total:0,sex:{},classes:{}});
                    })
                    votesSnapshot.forEach(doc=>{
                        let vote = doc.data();       
                        if(settings.startTime._seconds < vote.submitDate._seconds && vote.submitDate._seconds < settings.endTime._seconds){
                            for(h=0;h<hoursOfVoting;h++){
                                if(settings.startTime._seconds + 3600*h < vote.submitDate._seconds && vote.submitDate._seconds < settings.startTime._seconds + 3600*(h+1)){
                                    totalByHour[h] +=1;
                                }
                            }
                            total ++;
                            if(classSexInfo[0].includes(vote.className)){
                                if(classSexInfo[1][classSexInfo[0].indexOf(vote.className)][vote.sex] === undefined){
                                    classSexInfo[1][classSexInfo[0].indexOf(vote.className)][vote.sex] = 1;
                                }
                                else{
                                    classSexInfo[1][classSexInfo[0].indexOf(vote.className)][vote.sex] +=1;
                                }
                            }else{
                                classSexInfo[0].push(vote.className);
                                classSexInfo[1].push({[vote.sex]:1});
                            }
                            for(i = 0;i<candidates[0].length;i++){
                                if(candidates[0][i].id === vote.submitVote){
                                    candidates[1][i].total +=1;
                                    if(genderVotes[vote.sex] === undefined){
                                        genderVotes[vote.sex] = 1;
                                    }
                                    else{
                                        genderVotes[vote.sex] +=1;
                                    }
                                    if(classVotes[vote.className] === undefined){
                                        classVotes[vote.className] = 1;
                                    }
                                    else{
                                        classVotes[vote.className] +=1;
                                    }
                                    if(candidates[1][i].sex[vote.sex] === undefined){
                                        candidates[1][i].sex[vote.sex] = 1;
                                    }
                                    else{
                                        candidates[1][i].sex[vote.sex] += 1;
                                    }
                                    if(candidates[1][i].classes[vote.className] === undefined){
                                        candidates[1][i].classes[vote.className] = 1;
                                    }
                                    else{
                                        candidates[1][i].classes[vote.className] += 1;
                                    }
                                }
                            }
                        }
                    })
                    let byCandidates = [];
                    for(i = 0;i<candidates[0].length;i++){
                        byCandidates.push({fullName:candidates[0][i].fullName,
                            className:candidates[0][i].className,
                            total:candidates[1][i].total,
                            sexVotesInfo:candidates[1][i].sex,
                            classVotesInfo:candidates[1][i].classes});
                    }
                    let classSexJson = [];
                    for(i = 0;i<classSexInfo[0].length;i++){
                       classSexJson.push({className:classSexInfo[0][i],sexInfo:classSexInfo[1][i]});
                    }
                    let totalByHourJson = []
                    for(i = 0;i<totalByHour.length;i++){
                       totalByHourJson.push({hour: i.toString(),VotesWithinThatHour: totalByHour[i].toString() })
                    }
                    response = {total:total,byCandidates:byCandidates,genderVotes:genderVotes,classVotes:classVotes,classSexInfo:classSexJson,totalByHour:totalByHourJson};
                    return  res.status(200).send(response); 




                }else{
                    return  res.status(500).send({errorMessage:"Nie możesz jeszcze odczytać statystyk"});  
                }
            });
        }
        else if(specialCase === "totalVotes"){
            let classes = [[],[]];
            let total = 0;
            Promise.all([query.get(),db.collection("settings").doc("1").get()]).then(([snapshot,settingsSnap])=>{
                settings = settingsSnap.data()
               snapshot.forEach(doc=>{
                   
                if(settings.startTime._seconds < doc.data().submitDate._seconds && doc.data().submitDate._seconds < settings.endTime._seconds){
                    total++;
                   if(classes[0].includes(doc.data().className)){
                       classes[1][classes[0].indexOf(doc.data().className)]++;
                   }else{
                       classes[0].push(doc.data().className);
                       classes[1].push(1);
                   }
                }
                   
               })
               for(i=0;i<classes[0].length;i++){
                    response.push({class:classes[0][i], numberOfVotes: classes[1][i]});
               }
               return res.status(200).send({total: total,classes:response});   
            })
        }else{
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
                       
                        if(settings.startTime._seconds < vote.submitDate._seconds && vote.submitDate._seconds < settings.endTime._seconds){
                            for(i = 0;i<candidates[0].length;i++){
                               
                                if(candidates[0][i].id === vote.submitVote){
                                    candidates[1][i]++; 
                                }
                            }
                        }
                      
                    })
                    if(specialCase === "specialShowing"){
                        for(i = 0;i<candidates[1].length;i++){
                            if(candidates[1][i]  >= settings.showNumber||candidates[0][i].allwaysOn  === true){
                                response.push({...candidates[0][i],reachedTreshold:true});
                            }
                            else{
                                response.push({...candidates[0][i],reachedTreshold:false});
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
       
    }
    else{
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
function sendSingleResponse(query,res){
    query.get()
    .then((doc) => {    
        if(typeof doc.data() != "undefined"){
            temp = doc.data();
            temp.id = doc.id; 
            return res.status(200).send(temp);
        }  
        else{
            return res.status(500).send({errorDescription: "Dokumend nie znaleziony"});
        }
       
})
}
function AddToDb(type,req,res){
    var isValid = true;
    var verifiedData;
    var data = req.body;
    switch(type){
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
                   db.collection("vote").doc(hash(req.email)).set(
                       {
                        submitDate:new Date(),
                        submitVote:docRef.id,
                        className:data.classNameVoter,
                        sex:data.sex
                       }
                   ).then(() =>{
                        return res.status(201).send({message:"Twój głos został oddany z powodzeniem!"});
                   })
               })
            }
            break;
    }
    if(isValid){
        if(type!=="addCandidate"){
            db.collection(type).doc(hash(req.email)).set(
                verifiedData             
            ).then((docRef) =>{
                return res.status(201).send({message:"Twój głos został oddany z powodzeniem!"});
            })  
        }
              
    }else{
        return res.status(500).send({errorDescription: "Przesłane dane są w nieodpoweidnim formacie"});
    }
   

}
app.post('/api/vote', authMiddleware("vote"),(req,res) => {      
    try{
        AddToDb("vote",req,res)      
    }
    catch(error){
        return res.status(500).send({errorDescription: error});
    }   
});
app.post('/api/addCandidate', authMiddleware("vote"),(req,res) => {      
    try{
        AddToDb("addCandidate",req,res)      
    }
    catch(error){
        return res.status(500).send({errorDescription: error});
    }   
});
app.get('/api/candidates', (req,res) => {      
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
app.get('/api/votes',(req,res) => {      
    try{
        sendListResponse(db.collection("candidate"),res,"countVotes");
    }
    catch(error){
        return res.status(500).send({errorDescription: error});
    }   
});
app.get('/api/votes/count',(req,res) => {      
    try{
        sendListResponse(db.collection("vote"),res,"totalVotes");
    }
    catch(error){
        return res.status(500).send({errorDescription: error});
    }   
});
app.get('/api/settings',(req,res) => {      
    try{
        sendSingleResponse(db.collection("settings").doc("1"),res);
    }
    catch(error){
        return res.status(500).send({errorDescription: error});
    }   
});
app.get('/api/ableToVote',authMiddleware("ableToVote"),(req,res) => {      
    return res.status(500).send({errorDescription: "you should have seen this ups"});
});
app.get('/api/votes/stats',(req,res) => {      
    try{
        sendListResponse(db.collection("vote"),res,"stats");
    }
    catch(error){
        return res.status(500).send({errorDescription: error});
    }   
});

//Export the api to Firebase 
exports.app = functions.region('europe-west1').https.onRequest(app);