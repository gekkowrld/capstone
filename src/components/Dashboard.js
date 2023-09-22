import { useEffect, useState } from "react";
import { LoginDashboard, MemberDashboard } from "./subcomponents/dLog";
import DynamicMeta from "./DynamicMeta";
import { auth } from "../firebase/sdk";

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
			{isLoggedIn ? <MemberDashboard /> : <LoginDashboard />}
		</>
	);
};

export default Dashboard;
