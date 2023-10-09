import { Card } from "@material-tailwind/react";
import DynamicMeta from "../DynamicMeta";
import Header from "../Header";
import DisplayCartItems from "./DisplayCartItems";

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
				title={
					"Dashboard | " + (localStorage.getItem("name") || "User")
				}
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
				<h2 className="text-center font-bold">Your Cart</h2>
				<DisplayCartItems />
			</Card>
		</>
	);
}

export { MemberDashboard };
