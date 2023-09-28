import { Button } from "@material-tailwind/react";
function LoginDashboard() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl font-bold mb-8">You are not logged In</h1>
			<a href="/login ">
				<Button color="blue-gray" size="lg" ripple>
					Login
				</Button>
			</a>
		</div>
	);
}

function MemberDashboard() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl font-bold mb-8">You are logged In</h1>
			<a href="/dashboard">
				<Button color="lightBlue" ripple="light" size="lg">
					Dashboard
				</Button>
			</a>
		</div>
	);
}

export { LoginDashboard, MemberDashboard };
