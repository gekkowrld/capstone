import { useEffect, useState } from "react";
import { MemberDashboard } from "./subcomponents/dLog";
import DynamicMeta from "./DynamicMeta";
import { auth } from "../firebase/sdk";
import Providers from "../auth/Providers";

/**
 * Do not redirect to login (the url) if not logged in
 *
 * This is to ensure that if the user logs in successfully, they will be redirected to the dashboard
 * 	instead of the login page
 *
 * In every way this is a hack, but it works and it's not too bad either
 */

const Dashboard = () => {
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
			<DynamicMeta title="Dashboard" />
			{isLoggedIn ? <MemberDashboard /> : <Providers />}
		</>
	);
};

export default Dashboard;
