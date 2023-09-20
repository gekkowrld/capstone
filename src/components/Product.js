import {collection, getDocs} from "firebase/firestore";
import {useEffect, useState} from "react";

import LoadingScreen from "../components/Loading";
import db from "../firebase/sdk";

const Products = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	const getProducts = async () => {
		setLoading(true);
		const querySnapshot = await getDocs(collection(db, "products"));
		const products = querySnapshot.docs.map(doc => doc.data());
		setProducts(products);
		setLoading(false);
	};

	useEffect(() => {
		getProducts();
	}, []);

	if (loading) {
		return <LoadingScreen />;
	}
	return (
		<div>
			{products.map(product => (
				<div key={product.id}>
					<h1>{product.name}</h1>
					<h2>{product.price}</h2>
					<p>{product.description}</p>
				</div>
			))}
		</div>
	);
};

export default Products;
