import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	TwitterAuthProvider
} from "firebase/auth";
import { useEffect, useState } from "react";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_ADMIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
	measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);

export default getFirestore();

const google_provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
	signInWithPopup(auth, google_provider)
		.then(result => {
			let photo = result.user.photoURL;
			let name = result.user.displayName;

			localStorage.setItem("photo", photo);
			localStorage.setItem("name", name.replace(/\s/g, ""));
		})
		.catch(error => {
			console.error(error.message);
		});
};

const twitter_provider = new TwitterAuthProvider();

export const signInWithTwitter = () => {
	signInWithPopup(auth, twitter_provider)
		.then(result => {
			let photo = result.user.photoURL;

			localStorage.setItem("photo", photo);
		})
		.catch(error => {
			console.error(error.message);
		});
};

export async function logout() {
	try {
		await signOut(auth);
		localStorage.clear();
	} catch {
		console.log("error");
	}
}

export const isLoggedIn = () => {
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				setLoggedIn(true);
			} else {
				setLoggedIn(false);
			}
		});
	}, []);

	return loggedIn;
};