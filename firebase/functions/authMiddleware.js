const admin = require("firebase-admin");
const db = admin.firestore();
module.exports = validateFirebaseIdToken = function(authType){
    return async (req, res, next) => {
  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session)) {
    res.status(403).send('Unauthorized');
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
    res.status(403).send('Unauthorized');
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    if(type === "vote"){
        if(decodedIdToken.email.endsWith("@lo1.gliwice.pl")){
            db.collection("usedAccounts").doc(decodedIdToken.user_id).get().then(doc=>{
                if(doc === undefined){
                    db.collection("usedAccounts").doc(decodedIdToken.user_id).set({
                        used: true
                    }).then(()=>{
                        next();
                        return;
                    })
                }
            })
           
        }else{
            res.status(403).send('Unauthorized');
            return;
        }
    }
    else{
        res.status(403).send('Unauthorized');
        return;
    }
    
  } catch (error) {
    res.status(403).send('Unauthorized');
    return;
  }
}};

