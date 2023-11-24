import { useEffect, useState } from "react";
import DynamicMeta from "../DynamicMeta";
import { auth } from "../../sdk/firebase";
import Providers from "../../auth/Providers";
import OrderHistory from "./orderHistory";

/**
 * Do not redirect to login (the url) if not logged in
 *
 * This is to ensure that if the user logs in successfully, they will be redirected to the dashboard
 * 	instead of the login page
 *
 * In every way this is a hack, but it works and it's not too bad either
 */

const ShowOrderHistory = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<>
			<DynamicMeta title="History" />
			{isLoggedIn ? <OrderHistory /> : <Providers />}
		</>
	);
};

export default ShowOrderHistory;
