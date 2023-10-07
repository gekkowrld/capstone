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

import { AddShoppingCartSharp } from "@mui/icons-material";
import { useState } from "react";
import { useParams } from "react-router-dom";

const AddToCart = () => {
	const [productCount, setProductCount] = useState(1);
	const [showModal, setShowModal] = useState(false);
	const { uid } = useParams();

	const productStorageName = `capstone_g_product-${uid}`;

	const handleIncrement = () => {
		setProductCount(productCount + 1);
	};

	const handleDecrement = () => {
		if (productCount > 1) {
			setProductCount(productCount - 1);
		} else {
			// remove the product entry from the local storage and close the modal
			localStorage.removeItem(productStorageName);
			setShowModal(false);
		}
	};

	const toggleModal = () => {
		setShowModal(!showModal);
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
				{localStorage.setItem(productStorageName, productCount)}
				<button
					className="flex h-9 w-9 items-center bg-orange-500 hover:bg-orange-800 transition-all rounded-md p-2 justify-center"
					onClick={handleIncrement}
				>
					<span className="text-5xl flex items-center justify-center">
						+
					</span>
				</button>
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
