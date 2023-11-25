import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	onSnapshot,
	serverTimestamp
} from "firebase/firestore";
import db, { getUserId } from "../../sdk/firebase";
import { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { oneLineLoading } from "../Loading";
import { Button } from "@material-tailwind/react";

const DisplayCartItems = () => {
	const [cartItems, setCartItems] = useState([]);
	const [userId, setUserId] = useState("");
	const [books, setBooks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

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
		if (userId) {
			const q = collection(db, `/cartItems/${userId}/cart`);

			const unsubscribe = onSnapshot(q, snapshot => {
				const data = [];
				snapshot.forEach(doc => {
					data.push(doc.data());
				});
				setCartItems(data);
			});

			return () => unsubscribe();
		}
	}, [userId]);

	useEffect(() => {
		const fetchBooks = async () => {
			const booksArray = [];
			const storage = getStorage();

			for (let item of cartItems) {
				const docRef = doc(db, "books", item.bookId);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const bookData = docSnap.data();
					const imageRef = ref(storage, bookData.img_url);
					bookData.img_url = await getDownloadURL(imageRef);
					booksArray.push(bookData);
				} else {
					console.error("No such document!");
				}
			}
			setBooks(booksArray);
			setIsLoading(false);
		};

		fetchBooks();
	}, [cartItems]);

	if (isLoading === true) {
		return oneLineLoading();
	}

	if (books.length === 0) {
		return (
			<div>
				<p className="text-center text-2xl font-bold text-gray-500">
					Oh no, your cart is empty! Discover your{" "}
					<a
						className="hover:text-orange-300 text-orange-100 underline"
						href="/books"
					>
						next favorite book
					</a>{" "}
					now!
				</p>
			</div>
		);
	}

	const formatPrice = price => {
		return new Intl.NumberFormat("en-KE", {
			style: "currency",
			currency: "KES"
		}).format(price);
	};

	const handleCheckout = async () => {
		setIsLoading(true);
		let orderDoc = doc(db, "orders", userId);
		let cVal = collection(orderDoc, "cart");
		const cartItemsCopy = [...cartItems];
		const bookIdArr = cartItems.map(item => item.bookId);
		const bookQuantity = cartItems.map(item => item.quantity);
		const bookPrice = books.map(book => book.price);
		const totalPrice = books.reduce(
			(total, book, index) =>
				total + book.price * cartItemsCopy[index].quantity,
			0
		);
		const itemsInCart = cartItems.length;

		try {
			await addDoc(cVal, {
				userId: userId,
				bookId: bookIdArr,
				bookQuantity: bookQuantity,
				bookPrice: bookPrice,
				totalPrice: totalPrice,
				bookNo: itemsInCart,
				checkedOutAt: serverTimestamp()
			});
			cartItems.forEach(async item => {
				/* I'm assuming that the userId will be filled by the time the user clicks on the checkout button */
				const docRef = doc(
					db,
					`/cartItems/${userId}/cart`,
					item.bookId
				);
				await deleteDoc(docRef);
				setIsLoading(false);
			});
		} catch (error) {
			console.error("Error adding document: ", error);
			setIsLoading(false);
		}
	};

	return (
		<>
			<div>
				{books &&
					cartItems &&
					books.map((book, index) => (
						<div
							key={index}
							className="flex items-center gap-2 p-2 border-b border-gray-300"
						>
							<img
								style={{ width: "40px" }}
								src={book.img_url}
								alt={book.title}
							/>
							<p className="text-sm font-bold text-gray-500 border-r border-gray-300 pr-2">
								{cartItems[index].quantity}
							</p>
							<p className="text-sm font-bold text-gray-500 border-r border-gray-300 pr-2">
								{formatPrice(
									book.price * cartItems[index].quantity
								)}
							</p>
							<a
								className="text-sm font-bold text-gray-500 hover:text-orange-300 hover:underline"
								href={`/book/${cartItems[index].bookId}`}
							>
								{book.title}
							</a>
						</div>
					))}
			</div>
			{books && (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Button
						style={{ width: "auto" }}
						color="orange"
						ripple
						className="mt-5"
						onClick={handleCheckout}
					>
						Checkout
					</Button>
				</div>
			)}
		</>
	);
};

export default DisplayCartItems;
