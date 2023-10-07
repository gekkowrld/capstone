/**
 * This function is user to update the local storage
 * 	from the database
 * The data is to fetched from "users/userId/cart" field
 * 	in the database
 * The data is stored in a map format (data type)
 *
 * If the data exists in the local storage, it is not updated
 * 	else if the data does not exist in the local storage, it is added
 */

import db, { getUserId } from "../../sdk/firebase";
import { doc, getDoc } from "firebase/firestore";

async function updateLocalStorage() {
	const userId = getUserId();
	const userRef = doc(db, "users", userId);
	const userDoc = await getDoc(userRef);
	if (userDoc.exists()) {
		const cart = userDoc.data().cart;
		if (cart) {
			Object.keys(cart).forEach(key => {
				const productStorageName = `capstone_g_product-${key}`;
				if (!localStorage.getItem(productStorageName)) {
					localStorage.setItem(productStorageName, cart[key]);
				}
			});
		}
	}
}

/**
 * This component is used to get cart items
 * The data is stored in the local storage
 *
 * The function of this is to display nicely the items in the cart
 * 	from the local storage
 *
 * @fileoverview get cart items component
 */

async function DisplayCartItems() {
	await updateLocalStorage();
	const query = "capstone_g_product-"; // replace with your actual query
	const items = [];

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (!key) {
			break;
		}
		if (typeof key !== "string") {
			console.error(`Invalid key in localStorage: ${key}`);
			break;
		}

		console.log(key);
		if (key.indexOf(query) === 0) {
			const value = localStorage.getItem(key);
			if (!isNaN(value)) {
				items.push({ key, value });
			}
		}
	}
	const uniqueItems = Array.from(new Set(items.map(({ key }) => key)));
	if (uniqueItems.length > 0) {
		return uniqueItems.map(key => {
			const value = localStorage.getItem(key);

			return (
				<div className="cart-item" key={key}>
					<p className="cart-item-name">{key.replace(query, "")}</p>
					<p className="cart-item-value">Number: {value}</p>
				</div>
			);
		});
	} else {
		return <p>No items in cart</p>;
	}
}

export default DisplayCartItems;
