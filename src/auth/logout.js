import { signOut } from "firebase/auth";

import { auth } from "../firebase/sdk";
import DynamicMeta from "../components/DynamicMeta";

function LogoutForm() {
	return (
		<>
			<div className="flex flex-col items-center justify-center h-screen">
				<DynamicMeta
					title={
						"Logout? (" +
						(localStorage.getItem("name") || "User") +
						")"
					}
					description="Logout Page to Capstone Project"
				/>

				<div className="bg-white p-8 rounded-md w-96 border border-gray-800 flex flex-col items-center gap-5">
					<p className="text-2xl text-center">
						Are you sure you want to logout?
					</p>
					<button
						color="blue-gray"
						size="lg"
						className="text-xl font-bold mb-8s border border-gray-700 py-4 px-16 rounded-lg bg-gray-400 hover:bg-gray-500"
						type="button"
						onClick={() => signOut(auth)}
					>
						Logout
					</button>
				</div>
			</div>
		</>
	);
}

export default LogoutForm;
