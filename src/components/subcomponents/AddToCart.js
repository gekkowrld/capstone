/**
 * This component is responsible for the cart ui and functionality to add items to the cart
 *
 * This only adds and removes th items to the cart
 *
 * The calculation of the amount of the product(s) price is done at checkout
 * This is to reduce the api calls to the db and avoid a situation where the
 * 	product is marked as sold and removed from the count only for the person
 * 	to never checkout
 * This may make the product(s) not available for genuine buyers
 *
 * This component is to be available for all users (logged in and not logged in)
 * The status of the user login will be checked at checkout
 *
 * @returns The cart ui and functionality to add items to the cart and remove them
 *
 */

import { AddShoppingCartSharp, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db, { getUserId } from "../../sdk/firebase";
import { Button } from "@mui/material";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

const AddToCart = () => {
	const [productCount, setProductCount] = useState(1);
	const [showModal, setShowModal] = useState(false);
	const [userId, setUserId] = useState("");
	const { uid } = useParams();

	useEffect(() => {
		const fetchUserId = async () => {
			try {
				const userId = await getUserId();
				setUserId(userId);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};
		fetchUserId();
	});
	const handleIncrement = () => {
		setProductCount(productCount + 1);
	};

	const handleDecrement = () => {
		if (productCount > 1) {
			setProductCount(productCount - 1);
		} else {
			setShowModal(false);
		}
	};

	const toggleModal = () => {
		setShowModal(!showModal);
	};

	const saveData = async () => {
		let cartRef = doc(db, "cartItems", userId);
		let cVal = collection(cartRef, "cart");
		let dVal = doc(cVal, uid);
		await setDoc(
			dVal,
			{
				quantity: productCount,
				userId,
				bookId: uid,
				addTime: serverTimestamp()
			},
			{ merge: true }
		);
	};

	const showProductCountModal = () => {
		return (
			<div className="flex h-15 w-full items-center gap-4 my-4">
				<button
					className="flex h-9 w-9 items-center bg-orange-500 hover:bg-orange-800 transition-all rounded-md p-2 justify-center"
					onClick={handleDecrement}
				>
					<span className="text-5xl flex items-center justify-center">
						-
					</span>
				</button>
				{productCount}
				<button
					className="flex h-9 w-9 items-center bg-orange-500 hover:bg-orange-800 transition-all rounded-md p-2 justify-center"
					onClick={handleIncrement}
				>
					<span className="text-5xl flex items-center justify-center">
						+
					</span>
				</button>
				<Button onClick={saveData} disabled={!userId}>
					<Save />
					Save To Cart
				</Button>
			</div>
		);
	};

	const showProductAddToCartBtn = () => {
		return (
			<button
				onClick={toggleModal}
				className="flex w-full h-14 items-center bg-orange-500 hover:bg-orange-800 transition-all rounded-md p-7 my-4"
			>
				<AddShoppingCartSharp />
				<span className="flex w-full justify-center">Add to Cart</span>
			</button>
		);
	};

	return showModal ? showProductCountModal() : showProductAddToCartBtn();
};

export default AddToCart;
