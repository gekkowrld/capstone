import { useEffect, useState } from "react";
import db, { getUserId } from "../../sdk/firebase";
import {
	collection,
	documentId,
	getDocs,
	onSnapshot,
	query,
	where
} from "firebase/firestore";
import DynamicMeta from "../DynamicMeta";

const OrderHistory = () => {
	const [userId, setUserId] = useState(null);
	const [userDisplayName, setUserDisplayName] = useState("user");
	const [userImage, setUserImage] = useState(null);
	const [userOrderHistory, setUserOrderHistory] = useState([]);

	useEffect(() => {
		const fetchUserId = async () => {
			try {
				const id = await getUserId();
				setUserId(id);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		fetchUserId();
	}, []);

	useEffect(() => {
		let userIdRef = collection(db, "users");
		const fetchImage = async () => {
			const q = query(userIdRef, where("userId", "==", userId));
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
	}, [userId]);

	useEffect(() => {
		if (userId) {
			const q = collection(db, `/orders/${userId}/cart`);

			const unsubscribe = onSnapshot(q, snapshot => {
				const data = [];
				snapshot.forEach(doc => {
					data.push(doc.data());
				});
				setUserOrderHistory(data);
			});

			return () => unsubscribe();
		}
	}, [userId]);

	const fetchIndividualBookInfo = async bookId => {
		const docRef = collection(db, "books");
		const q = query(docRef, where(documentId, "==", bookId));

		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			console.error("No matching documents for bookId:", bookId);
			return null;
		}

		const bookInfo = [];
		querySnapshot.forEach(doc => {
			bookInfo.push(doc.data());
		});

		return bookInfo;
	};

	console.log(userOrderHistory);
	userOrderHistory.sort((a, b) => {
		return a.checkedOutAt - b.checkedOutAt;
	});

	return (
		<>
			<DynamicMeta
				title={`Order History | ${userDisplayName}`}
				description={`Order History of ${userDisplayName}`}
			/>
			<img
				src={userImage}
				alt={userDisplayName}
				className="w-20 h-20 mx-auto rounded-md"
			/>
			<h1 className="text-3xl font-bold text-center">
				{userDisplayName}
			</h1>
			{userOrderHistory &&
				userOrderHistory.map(async (order, index) => (
					<div key={index}>
						<p>Order {index + 1}</p>
						{await Promise.all(
							order.bookId.map(async bookId => {
								const bookInfo =
									await fetchIndividualBookInfo(bookId);
								return (
									<div key={bookId}>
										<p>{bookId}</p>
										{Array.isArray(bookInfo) &&
											bookInfo.map((book, bookIndex) => (
												<p key={bookIndex}>
													{book.title}
												</p>
											))}
									</div>
								);
							})
						)}
					</div>
				))}
		</>
	);
};

export default OrderHistory;
