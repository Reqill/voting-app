import { getAuth, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { firebaseConfig } from "./firebaseConfig";

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = (callback) => {
  signInWithRedirect(auth, provider)

};
export const getResults = (callback) => {
  getRedirectResult(auth)
    .then((result) => {
      console.log("hi");
      const credential = GoogleAuthProvider.credentialFromResult(result);
      callback(credential, result.user);
      // ...
    }).catch((error) => {
      callback(undefined, undefined);
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