import { Card } from "@material-tailwind/react";
import { collection, onSnapshot } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";

import LoadingScreen from "../components/Loading";
import db from "../sdk/firebase";
import Header from "./Header";
import Footer from "./Footer";

import DynamicMeta from "./DynamicMeta";
import RenderProductDescription from "./subcomponents/productPage";

export default function Products() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchImage = async product => {
			const imageUrl = await getImageUrl(product.img);
			return imageUrl;
		};

		let storage = getStorage();
		const getImageUrl = async imageName => {
			let imageUrl = await getDownloadURL(ref(storage, imageName));
			return imageUrl;
		};

		const unsubscribe = onSnapshot(collection(db, "products"), snapshot => {
			const products = snapshot.docs.map(doc => ({
				...doc.data(),
				uid: doc.id
			}));
			const productPromises = products.map(product =>
				fetchImage(product)
			);
			Promise.all(productPromises).then(imageUrls => {
				const productsWithImages = products.map((product, index) => ({
					...product,
					imageUrl: imageUrls[index]
				}));
				setProducts(productsWithImages);
				setLoading(true);
			});
		});
		return unsubscribe;
	}, []);

	// Set Loading Screen when false ???
	if (!loading) {
		return <LoadingScreen />;
	}

	// Decorate the price with different font sizes
	function priceDecorator(price) {
		const intPart = price.toString().split(".")[0];
		const _decPart = price.toString().split(".")[1];
		const decPart = _decPart ? _decPart.padEnd(2, "0") : "00";
		const formattedIntPart = parseInt(intPart).toLocaleString();

		return (
			<div className="inline">
				<span className="text-lg">{formattedIntPart}</span>
				<sup className="text-sm">{decPart}</sup>
			</div>
		);
	}

	return (
		<>
			<Header />
			<div className="h-screen flex flex-col">
				<main className="flex gap-10 flex-wrap justify-start items-center mx-7 p-10">
					<DynamicMeta
						title="Products"
						description="All products available on the store"
					/>
					{products.map(product => (
						// The RenderProductDescription passed argument apparently only passes the uid
						<Card
							onClick={() => (
								<RenderProductDescription
									productDetails={product}
								/>
							)}
							className="text-center cursor-pointer items-center bg-white p-4 min-w-min max-w-xs"
							key={product.uid}
						>
							<img
								src={product.imageUrl}
								alt={product.name}
								className="h-32"
							/>
							<a
								href={"/product/" + product.uid}
								className="hover:text-orange-300"
							>
								<p>{product.name}</p>
							</a>
							<div className="italic text-orange-400">
								KES {priceDecorator(product.price)}
							</div>
						</Card>
					))}
				</main>
				<Footer />
			</div>
		</>
	);
}
