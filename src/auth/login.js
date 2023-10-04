import { useEffect, useState } from "react";
import DynamicMeta from "../components/DynamicMeta";
import { auth } from "../firebase/sdk";
import Providers from "../auth/Providers";
import Home from "../components/Home";

/**
 * This function checks if the user is logged in or not.
 * If the user is logged in, then it redirects them to the Home Page.
 * 	else it redirects them to the Login Page.
 *
 * This is to prevent the user from accessing the Login Page when they are logged in.
 *
 * This is the same mechanism implemented by github.com (not really, but it's similar)
 *
 * @returns The Login Page if the user is not logged in, otherwise it returns the Home Page
 */

const LoginUser = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			if (user) {
				setIsLoggedIn(true);
				window.location.href = "/";
			} else {
				setIsLoggedIn(false);
			}
		});

		return unsubscribe;
	}, []);

	return (
		<>
			<DynamicMeta title="Login" />
			{isLoggedIn ? <Home /> : <Providers />}
		</>
	);
};

export default LoginUser;
