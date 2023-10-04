import { Button, Card } from "@material-tailwind/react";
import DynamicMeta from "../DynamicMeta";
import { Settings } from "@mui/icons-material";
import Header from "../Header";
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
	// Seed the same image for the user for consistency sake
	// If null then use "user" as the seed
	const namePhotoSeed = `https://picsum.photos/seed/${
		localStorage.getItem("name").replace(" ", "").toLowerCase() || "user"
	}/200`;
	return (
		<>
			<Header />
			<DynamicMeta
				title={localStorage.getItem("name") || "User"}
				description={localStorage.getItem("name") + "'s dashboard"}
			/>
			<Card
				className="p-3 w-full mb-5"
				style={{ backgroundColor: "#f5f5f5" }}
			>
				<div className="flex gap-6">
					<img
						src={localStorage.getItem("photo") || namePhotoSeed}
						alt={localStorage.getItem("name") || "User"}
						className="rounded-lg w-14 aspect-square sm:w-20"
					/>
					<p className="font-bold self-center flex flex-col">
						<span className="font-bold text-blue-gray-900 text-base sm:text-5xl">
							{localStorage.getItem("name") || "User"}
						</span>
						<span className="text-sm sm:text-xl">
							{localStorage.getItem("email") ||
								"noemail@gekkowrld.me"}
						</span>
					</p>
				</div>
			</Card>
			<Card className="p-5 w-full">
				<p>
					<Settings /> Settings
				</p>
			</Card>
		</>
	);
}

export { LoginDashboard, MemberDashboard };
