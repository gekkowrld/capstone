import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import LoadingScreen from "../components/Loading";
import db, { getImageUrl } from "../firebase/sdk";
import { Card } from "@material-tailwind/react";

const Products = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	const getProducts = async () => {
		setLoading(true);
		const querySnapshot = await getDocs(collection(db, "products"));
		const productsData = querySnapshot.docs.map(doc => doc.data());

		// Fetch image URLs for all products in parallel
		const productsWithImageUrls = await Promise.all(
			productsData.map(async product => {
				const imageUrl = await getImageUrl(product.img);
				return { ...product, imageUrl }; // Include imageUrl in the product data
			})
		);

		setProducts(productsWithImageUrls);
		setLoading(false);
	};

	useEffect(() => {
		// Initialize the products once on component mount
		getProducts();

		// Set up a real-time listener for updates
		const unsubscribe = onSnapshot(collection(db, "products"), snapshot => {
			const updatedProducts = snapshot.docs.map(doc => ({
				...doc.data(),
				uid: doc.id
			}));
			setProducts(updatedProducts);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<div className="flex gap-10 flex-wrap justify-center items-center h-screen my-5">
			{products.map(product => (
				<div key={product.name}>
					<Card className="text-center cursor-pointer items-center bg-white p-4">
						<img
							src={product.imageUrl}
							alt={product.name}
							className="h-32"
						/>
						<h1 className="font-bold text-gray-700 text-ellipsis">
							{product.name}
						</h1>
						<h2 className="italic text-orange-400">
							ksh {product.price}
						</h2>
					</Card>
				</div>
			))}
		</div>
	);
};

export default Products;
