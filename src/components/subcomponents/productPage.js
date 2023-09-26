import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import db from "../../firebase/sdk";
import LoadingScreen from "../Loading";
import { Card } from "@material-tailwind/react";
import DynamicMeta from "../DynamicMeta";

const RenderProductDescription = () => {
	const { uid } = useParams();
	const [product, setProduct] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);

	const formatCapacity = capacity => {
		if (capacity < 900) {
			return `${capacity} GB`;
		} else {
			return `${(capacity / 1000).toFixed(1)} TB`;
		}
	};

	useEffect(() => {
		const fetchProduct = async () => {
			const productRef = doc(collection(db, "products"), uid);
			const productDoc = await getDoc(productRef);
			if (productDoc.exists()) {
				setProduct(productDoc.data());
				const storageRef = ref(getStorage(), productDoc.data().img);
				const url = await getDownloadURL(storageRef);
				setImageUrl(url);
			} else {
				console.error("Something went wrong!");
			}
		};
		fetchProduct();
	}, [uid]);

	function priceDecorator(price) {
		const intPart = price.toString().split(".")[0];
		const _decPart = price.toString().split(".")[1];
		const decPart = _decPart ? _decPart.padEnd(2, "0") : "00";
		const formattedIntPart = parseInt(intPart).toLocaleString();

		return (
			<div className="inline">
				<span className="text-lg">{formattedIntPart}</span>
				<span className="text-sm">.{decPart}</span>
			</div>
		);
	}

	return (
		<div>
			{product ? (
				<div className="flex flex-row flex-wrap">
					<DynamicMeta
						title={product.name}
						description={product.name + product.description}
					/>
					{imageUrl && (
						<img
							src={imageUrl}
							alt={product.name}
							className="w-1/4 m-7"
						/>
					)}
					<Card className="m-9 p-3 w-7/12">
						<p className="text-center font-bold text-2xl">
							{product.name}
						</p>
						<div className="italic text-gray-800">
							<span className="text-black font-bold">
								Price:{" "}
							</span>
							KES {priceDecorator(product.price)}
						</div>
						<p className="text-gray-800">
							<span className="text-black font-bold">
								Attribute:{" "}
							</span>
							<a
								href={product.attr}
								className="hover:text-orange-300 hover:underline"
							>
								{product.attr}
							</a>
						</p>
						{product.color && (
							<p className="text-gray-800">
								<span className="text-black font-bold">
									Color:{" "}
								</span>
								{product.color}
							</p>
						)}
						{product.brand && (
							<p className="text-gray-800">
								<span className="text-black font-bold">
									Brand:{" "}
								</span>
								{product.brand}
							</p>
						)}
						{product.capacity && (
							<p className="text-gray-800">
								<span className="text-black font-bold">
									Memory:{" "}
								</span>
								{formatCapacity(product.capacity)}
							</p>
						)}
						{product.ram && (
							<p className="text-gray-800">
								<span className="text-black font-bold">
									RAM:{" "}
								</span>
								{formatCapacity(product.ram)}
							</p>
						)}
						{product.cpu && (
							<p className="text-gray-800">
								<span className="text-black font-bold">
									Processor:{" "}
								</span>
								{product.cpu}
							</p>
						)}
						{product.model && (
							<p className="text-gray-800">
								<span className="text-black font-bold">
									Model:{" "}
								</span>
								{product.model}
							</p>
						)}
					</Card>
				</div>
			) : (
				<LoadingScreen />
			)}
		</div>
	);
};

export default RenderProductDescription;
