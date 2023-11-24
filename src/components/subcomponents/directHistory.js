import { useEffect, useState } from "react";
import DynamicMeta from "../../components/DynamicMeta";
import { auth } from "../../sdk/firebase";
import Providers from "../../auth/Providers";
import OrderHistory from "./orderHistory";

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

const ShowOrderHistory = () => {
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
			<DynamicMeta title="User order History" />
			{isLoggedIn ? <OrderHistory /> : <Providers />}
		</>
	);
};

export default ShowOrderHistory;
