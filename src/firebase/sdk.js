import {getAnalytics} from "firebase/analytics";
import {initializeApp} from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  TwitterAuthProvider
} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {useEffect, useState} from "react";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey : process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain : process.env.REACT_APP_AUTH_ADMIN,
  databaseURL : process.env.REACT_APP_DATABASE_URL,
  projectId : process.env.REACT_APP_PROJECT_ID,
  storageBucket : process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId : process.env.MESSAGING_SENDER_ID,
  appId : process.env.REACT_APP_APP_ID,
  measurementId : process.env.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage();

export default getFirestore();

const google_provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, google_provider)
      .then(result => {
        let photo = result.user.photoURL;
        let name = result.user.displayName;
        let email = result.user.email;

        localStorage.setItem("photo", photo);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
      })
      .catch(error => { console.error(error.message); });
};

const twitter_provider = new TwitterAuthProvider();

export const signInWithTwitter = () => {
  signInWithPopup(auth, twitter_provider)
      .then(result => {
        let photo = result.user.photoURL;
        let name = result.user.displayName;
        let email = result.user.email;

        localStorage.setItem("email", email);
        localStorage.setItem("photo", photo);
        localStorage.setItem("name", name);
      })
      .catch(error => { console.error(error.message); });
};

/* This is now a prototype rather than a working version
 * This is to reduce latency when signing in
 *
 */

export const isLoggedIn = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setLoggedIn(true);
        console.log("User is logged in (authStateChanged)");
      } else {
        setLoggedIn(false);
        console.log("User is not logged in (authStateChanged)");
      }
    });
  }, []);

  return loggedIn;
};

export async function getImageUrl(location) {
  const ImageURL = await getDownloadURL(ref(storage, location));
  return ImageURL;
}
