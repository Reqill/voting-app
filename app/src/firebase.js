import {getAuth,signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVOze7qWrw7GKfsxYf1R95Iw8g5SL6CHU",
};
const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });


export default signInWithGoogle = () => signInWithPopup(auth, provider)
.then((result) => {
  // This gives you a Google Access Token. You can use it to access the Google API.
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  // The signed-in user info.
  const user = result.user;
  return credential;
  // ...
}).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.email;
  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  // ...
});