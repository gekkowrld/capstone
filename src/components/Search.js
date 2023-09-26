import { SearchSharp } from "@mui/icons-material";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

function Search() {
	const [searchTerm, setSearchTerm] = useState("");
	const [productsData, setProductsData] = useState([]);
	const [showResults, setShowResults] = useState(false);

	useEffect(() => {
		const db = getFirestore();
		const productsRef = collection(db, "products");

		const unsubscribe = onSnapshot(productsRef, snapshot => {
			const data = [];
			snapshot.forEach(doc => {
				const { name, id } = { ...doc.data(), id: doc.id };
				data.push({ name, id });
			});
			setProductsData(data);
		});

		return () => unsubscribe();
	}, []);

	const handleSearch = event => {
		setSearchTerm(event.target.value);
		setShowResults(true);
	};

	const handleButtonClick = () => {
		setShowResults(false);
	};

	const filteredProducts = productsData.filter(product =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div>
			<input type="text" value={searchTerm} onChange={handleSearch} />
			{showResults && (
				<ul>
					{filteredProducts.map(product => (
						<li key={product.id}>
							<a href={"/product/" + product.id}>
								{product.name}
							</a>
						</li>
					))}
				</ul>
			)}
			<button
				onClick={handleButtonClick}
				className="text-red-600 w-32 h-36"
			>
				<SearchSharp />
			</button>
		</div>
	);
}

export default Search;
