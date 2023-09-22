import { signOut } from "firebase/auth";
import { auth } from "../firebase/sdk";
import { Button } from "@material-tailwind/react";

function LogoutForm() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			Are you sure you want to logout?
			<Button
				color="lightBlue"
				ripple="light"
				size="lg"
				className="text-4xl font-bold mb-8s"
				type="button"
				onClick={() => signOut(auth)}
			>
				Logout
			</Button>
		</div>
	);
}

export default LogoutForm;
