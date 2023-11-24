import { useEffect, useState } from "react";
import DynamicMeta from "../DynamicMeta";
import { getUserId } from "../../sdk/firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where
} from "firebase/firestore";
import db from "../../sdk/firebase";
import { Card } from "@mui/material";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import Header from "../Header";

const OrderHistory = () => {
	const [userUid, setUserUid] = useState(null);
	const [userDisplayName, setUserDisplayName] = useState("User");
	const [userImage, setUserImage] = useState(null);
	const [orders, setOrders] = useState([]);
	const [books, setBooks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

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
		const userIdRef = collection(db, "users");
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

	useEffect(() => {
		const userBooks = collection(db, `orders/${userUid}/cart`);
		const fetchBooks = async () => {
			const q = query(userBooks);
			const querySnapshot = await getDocs(q);
			if (querySnapshot.empty) {
				console.error("No matching documents.");
			}

			querySnapshot.forEach(doc => {
				const data = doc.data();
				setOrders(orders => [...orders, data]);
			});
		};

		fetchBooks();
	}, [userUid]);

	useEffect(() => {
		const fetchBooks = async () => {
			const booksArray = [];
			const storage = getStorage();

			for (let item of orders) {
				for (let book of item.bookId) {
					const docRef = doc(db, "books", book);
					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {
						const bookData = docSnap.data();
						const imageRef = ref(storage, bookData.img_url);
						bookData.img_url = await getDownloadURL(imageRef);
						bookData.uid = docSnap.id;
						booksArray.push(bookData);
					} else {
						console.log("No such document!");
					}
				}
			}
			setBooks(booksArray);
		};
		fetchBooks();
	}, [orders]);

	useEffect(() => {
		setIsLoading(false);
	}, [books]);

	orders.sort((a, b) => a.checkedOutAt.seconds - b.checkedOutAt.seconds);

	function priceDecorator(price) {
		return price.toLocaleString("en-US", {
			style: "currency",
			currency: "KES"
		});
	}

	return (
		<>
			<DynamicMeta
				title={"History | " + userDisplayName}
				description={userDisplayName + "'s dashboard"}
			/>
			<Header />
			<Card
				className="p-3 w-full mb-5"
				style={{ backgroundColor: "#f5f5f5" }}
			>
				<div className="flex flex-col items-center">
					<img
						src={userImage}
						alt="user"
						className="w-40 h-40 object-cover rounded-lg"
					/>
					<h1 className="text-2xl font-bold mt-4">
						{userDisplayName}
					</h1>
				</div>
			</Card>
			{books && !isLoading && books.length > 0 && (
				<Card
					className="p-3 w-full mb-5"
					style={{ backgroundColor: "#f5f5f5" }}
				>
					<h1 className="text-2xl font-bold">Order History</h1>
					<div className="flex flex-col items-center border-b-2 border-gray-300 border-t-2 pt-5 pb-5">
						{books.map((order, index) => (
							<div
								key={index}
								className="flex flex-col items-center w-full mb-5"
							>
								<div className="flex flex-row w-full">
									<img
										src={order.img_url}
										alt="book"
										className="w-40 h-40 object-cover rounded-lg"
									/>
									<div className="flex flex-col ml-5">
										<a
											href={`/book/${order.uid}`}
											className="text-xl font-bold"
										>
											{order.title}
										</a>
										<h1 className="text-lg font-bold">
											{priceDecorator(order.price)}
										</h1>
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>
			)}
			{(books === null || books.length === 0) && !isLoading && (
				<Card
					className="p-3 w-full mb-5"
					style={{ backgroundColor: "#f5f5f5" }}
				>
					<h1 className="text-2xl font-bold">Order History</h1>
					<div className="flex flex-col items-center border-b-2 border-gray-300 border-t-2 pt-5 pb-5">
						<div className="text-xl font-bold">
							<span>
								Hey {userDisplayName}, you have no orders yet!
								You can{" "}
							</span>{" "}
							<a href="/books" className="text-blue-500">
								start shopping
							</a>
						</div>
					</div>
				</Card>
			)}
			{isLoading && (
				<Card
					className="p-3 w-full mb-5"
					style={{ backgroundColor: "#f5f5f5" }}
				>
					<h1 className="text-2xl font-bold">Order History</h1>
					<div className="flex flex-col items-center border-b-2 border-gray-300 border-t-2 pt-5 pb-5">
						<h1 className="text-xl font-bold">Loading...</h1>
					</div>
				</Card>
			)}
		</>
	);
};

export default OrderHistory;
