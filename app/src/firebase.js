import {getAuth,signInWithPopup, signInWithRedirect,getRedirectResult,GoogleAuthProvider} from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCCv5PUbHX-1hOEy9k9VkzXojUwwcUrZHY",
    authDomain: "voting-lo1.firebaseapp.com",
    projectId: "voting-lo1",
    storageBucket: "voting-lo1.appspot.com",
    messagingSenderId: "714845131798",
    appId: "1:714845131798:web:cb5ab97c025d58bc14d137",
    measurementId: "G-ZYPXMPLL90"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = (callback) => {
    signInWithRedirect(auth, provider)
    
};
export const getResults = (callback)=>{
    getRedirectResult(auth)
  .then((result) => {
      console.log("hi");
    const credential = GoogleAuthProvider.credentialFromResult(result);
    callback(credential, result.user);
    // ...
    }).catch((error) => {
        callback(undefined,undefined);
        console.log(error);
    // Handle Errors here.
    
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    
  });     
};