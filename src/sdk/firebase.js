import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	TwitterAuthProvider,
	GithubAuthProvider
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
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
const storage = getStorage();
export { analytics };

export default getFirestore();

/**
 * The following data are stored in the local storage:
 * 		- User Photo
 * 		- User Email
 * 		- User Display Name
 *
 * This information are not "too" sensitive, other
 * 	sensitive information is not kept in the browser
 *
 * If you have any issues and or suggestions about the matter
 * 	you can open a new issue here:
 * 		https://github.com/gekkowrld/capstone/issues/new
 */

const google_provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
	signInWithPopup(auth, google_provider)
		.then(result => {
			let photo = result.user.photoURL;
			let name = result.user.displayName;
			let email = result.user.email;
			let uid = result.user.uid;

			const db = getFirestore();
			const userRef = doc(db, "users", uid);

			const userData = { photo: photo, name: name, userId: uid };

			setDoc(userRef, userData, { merge: true })
				.then(() => {
					console.log("User data saved successfully!");
				})
				.catch(error => {
					console.error(error.message);
				});
		})
		.catch(error => {
			console.error(error.message);
		});
};

const github_provider = new GithubAuthProvider();

export const signInWithGithub = () => {
	signInWithPopup(auth, github_provider)
		.then(result => {
			let photo = result.user.photoURL;
			let name = result.user.displayName;
			let email = result.user.email;
			let uid = result.user.uid;

			const db = getFirestore();
			const userRef = doc(db, "users", uid);

			const userData = { photo: photo, name: name, userId: uid };

			setDoc(userRef, userData, { merge: true })
				.then(() => {
					console.log("User data saved successfully!");
				})
				.catch(error => {
					console.error(error.message);
				});
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
			let name = result.user.displayName;
			let email = result.user.email;
			let uid = result.user.uid;

			const db = getFirestore();
			const userRef = doc(db, "users", uid);

			const userData = { photo: photo, name: name, userId: uid };

			setDoc(userRef, userData, { merge: true })
				.then(() => {
					console.log("User data saved successfully!");
				})
				.catch(error => {
					console.error(error.message);
				});
		})
		.catch(error => {
			console.error(error.message);
		});
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
			} else {
				setLoggedIn(false);
			}
		});
	}, []);

	return loggedIn;
};

export async function getImageUrl(location) {
	const ImageURL = await getDownloadURL(ref(storage, location));
	return ImageURL;
}

/**
 * Since this is "sensitive" information, it should not be stored
 * 	anywhere in the device
 *
 * This function is to be used to get user unique identifier (uid)
 *
 * @returns Promise to return userId
 */
export const getUserId = () => {
	return new Promise((resolve, reject) => {
		onAuthStateChanged(auth, user => {
			if (user) {
				resolve(user.uid);
			} else {
				reject(new Error("User not authenticated"));
			}
		});
	});
};
