import {
	getDoc,
	doc,
	serverTimestamp,
	collection,
	addDoc
} from "firebase/firestore";
import db, { getUserId } from "../../sdk/firebase";
import { useEffect, useState } from "react";
import { oneLineLoading } from "../Loading";
import { Button } from "@material-tailwind/react";

function DisplayCartItems() {
	let localStoragePrefix = "capstone_g_product-";
	const [products, setProducts] = useState([]);
	const [productIdArr, setProductIdArr] = useState([]);
	const [productQuantity, setProductQuantity] = useState([]);
	const [productPrice, setProductPrice] = useState([]);
	const [userId, setUserId] = useState(null);
	const [totalPrice, setTotalPrice] = useState(0);
	const [itemsInCart, setItemsInCart] = useState(0);

	useEffect(() => {
		async function fetchProducts() {
			const productsData =
				await getProductsFromLocalStorage(localStoragePrefix);
			setProducts(productsData);
		}
		const fetchUserId = async () => {
			try {
				const userId = await getUserId();
				setUserId(userId);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		async function getProductsFromLocalStorage(prefix) {
			const products = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key.startsWith(prefix)) {
					const product = JSON.parse(localStorage.getItem(key));
					products.push({ key, value: product.value });
				}
			}
			const productsWithInfo = await getProductsFromFirebase(products);
			return productsWithInfo;
		}

		async function getProductsFromFirebase(products) {
			const productIds = products.map(product =>
				product.key.replace(localStoragePrefix, "")
			);
			setProductIdArr(productIds);
			const productRefs = productIds.map(productId =>
				doc(db, "products", productId)
			);
			const productDocs = await Promise.all(productRefs.map(getDoc));
			const productInfoMap = new Map();
			productDocs.forEach(doc => {
				productInfoMap.set(doc.id, doc.data());
			});
			return products.map(product => {
				const productId = product.key.replace(localStoragePrefix, "");
				const productInfo = productInfoMap.get(productId);
				return { ...product, productInfo };
			});
		}

		function getTotalQuantity() {
			let totalQuantity = 0;
			let productQuantityV = [];
			let productPriceV = [];
			products.forEach(product => {
				const value = localStorage.getItem(product.key);
				if (value !== null) {
					productQuantityV.push(parseInt(value));
					productPriceV.push(product.productInfo.price);
					totalQuantity +=
						product.productInfo.price * parseInt(value);
				}
			});
			setProductPrice(productPriceV);
			setProductQuantity(productQuantityV);
			setTotalPrice(totalQuantity.toFixed(2));
		}

		function getItemsInCart() {
			let itemsInCart = 0;
			products.forEach(product => {
				const value = localStorage.getItem(product.key);
				if (value !== null) {
					itemsInCart += parseInt(value);
				}
			});
			setItemsInCart(itemsInCart);
		}
		getItemsInCart();
		fetchUserId();
		fetchProducts();
		getTotalQuantity();
	}, []);

	const checkOutCart = async () => {
		let orderDoc = doc(db, "orders", userId);
		let cVal = collection(orderDoc, "cart");
		await addDoc(cVal, {
			userId: userId,
			productId: productIdArr,
			productQuantity: productQuantity,
			productPrice: productPrice,
			totalPrice: totalPrice,
			productNo: itemsInCart,
			checkedOutAt: serverTimestamp()
		});
	};

	return (
		<>
			{products.length === 0 ? (
				oneLineLoading()
			) : (
				<div className="flex flex-col gap-4">
					{products.map(product => {
						return (
							<>
								<div key={product.key}>
									<p>{product.value}</p>
									{(product.productInfo && (
										<div>
											<a
												href={`/product/${product.key.replace(
													localStoragePrefix,
													""
												)}`}
												className="font-bold"
											>
												{product.productInfo.name}
											</a>
											<p>
												KES{" "}
												{product.productInfo.price.toFixed(
													2
												)}
											</p>
										</div>
									)) ||
										oneLineLoading()}
								</div>
							</>
						);
					})}
				</div>
			)}
			<p>
				Total Price: ({itemsInCart} items) KES {totalPrice}
			</p>
			<Button
				onClick={() => checkOutCart()}
				color="blue-gray"
				buttonType="filled"
				size="regular"
				ripple
			>
				Checkout
			</Button>
		</>
	);
}

export default DisplayCartItems;
