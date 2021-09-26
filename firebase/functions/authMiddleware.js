const admin = require("firebase-admin");
const db = admin.firestore();
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();

module.exports = validateFirebaseIdToken = function(authType){
   return (async (req, res, next) => {
   
  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session)) {
    res.status(403).send('Unauthorized1');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if(req.cookies) {
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized2');
    return;
  }

  try {
    const ticket = await client.verifyIdToken({
        idToken: idToken,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    if(authType === "vote"){
        if(payload.hd === "lo1.gliwice.pl"){
            db.collection("usedAccounts").doc(userid).get().then(doc=>{
                if(doc.data() === undefined){
                    db.collection("usedAccounts").doc(userid).set({
                        used: true
                    }).then(()=>{
                        req.email = payload.email;
                        next();
                        return;
                    })
                }else{
                    res.status(403).send({errorMessage:"z tego konta oddano już głos"});
                }
            })
           
        }else{
            res.status(403).send('Unauthorized3');
            return;
        }
    }
    else{
        res.status(403).send('Unauthorized4');
        return;
    }
    
  } catch (error) {
    res.status(403).send('Unauthorized5');
    return;
  }
})
};

