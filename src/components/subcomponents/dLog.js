import { Button, Card } from "@material-tailwind/react";
import DynamicMeta from "../DynamicMeta";
import Header from "../Header";
import DisplayCartItems from "./DisplayCartItems";
import { useState, useEffect } from "react";
import db, { getUserId } from "../../sdk/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function MemberDashboard() {
	// Seed the same image for the user for consistency sake
	// If null then use "user" as the seed

	const namePhotoSeed = `https://picsum.photos/seed/${"user"}/200`;
	const [userImage, setUserImage] = useState(namePhotoSeed);
	const [userUid, setUserUid] = useState(null);
	const [userDisplayName, setUserDisplayName] = useState("User");

	const userIdRef = collection(db, "users");

	useEffect(() => {
		const fetchUserId = async () => {
			try {
				const id = await getUserId();
				setUserUid(id);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		fetchUserId();
	}, []);
	useEffect(() => {
		const fetchImage = async () => {
			const q = query(userIdRef, where("userId", "==", userUid));
			const querySnapshot = await getDocs(q);
			if (querySnapshot.empty) {
				console.error("No matching documents.");
			}

			querySnapshot.forEach(doc => {
				const data = doc.data();
				setUserImage(data.photo);
				setUserDisplayName(data.name);
			});
		};

		fetchImage();
	}, [userUid]);

	return (
		<>
			<Header />
			<DynamicMeta
				title={"Dashboard | " + userDisplayName}
				description={userDisplayName + "'s dashboard"}
			/>
			<Card
				className="p-3 w-full mb-5"
				style={{ backgroundColor: "#f5f5f5" }}
			>
				<div className="flex gap-6">
					<img
						src={userImage}
						alt={userDisplayName}
						className="rounded-lg w-14 aspect-square sm:w-20"
					/>
					<p className="font-bold self-center flex flex-col">
						<span className="font-bold text-blue-gray-900 text-base sm:text-5xl">
							{userDisplayName}
						</span>
					</p>
				</div>
			</Card>
			<Card className="p-5 w-full">
				<h2 className="text-center font-bold">Your Cart</h2>
				<DisplayCartItems />
			</Card>
			<div style={{ display: "flex", justifyContent: "center" }}>
				<a href="/history">
					<Button
						style={{ width: "auto" }}
						color="orange"
						ripple
						className="mt-5"
					>
						Show History
					</Button>
				</a>
			</div>
		</>
	);
}

export { MemberDashboard };
