import { useEffect, useState } from "react";
import { Card } from "@material-tailwind/react";
import { collection, onSnapshot } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

import LoadingScreen from "../components/Loading";
import db from "../sdk/firebase";
import Header from "./Header";
import Footer from "./Footer";
import DynamicMeta from "./DynamicMeta";
import RenderProductDescription from "./subcomponents/productPage";

export default function Products() {
	const [books, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchImage = async book => {
			const imageUrl = await getImageUrl(book.img_url);
			return imageUrl;
		};

		const storage = getStorage();
		const getImageUrl = async imageName => {
			const imageUrl = await getDownloadURL(ref(storage, imageName));
			return imageUrl;
		};

		const unsubscribe = onSnapshot(collection(db, "books"), snapshot => {
			const books = snapshot.docs.map(doc => ({
				...doc.data(),
				uid: doc.id
			}));
			const bookPromises = books.map(book => fetchImage(book));
			Promise.all(bookPromises)
				.then(imageUrls => {
					const booksWithImages = books.map((book, index) => ({
						...book,
						imageUrl: imageUrls[index]
					}));
					setProducts(booksWithImages);
					setLoading(true);
					localStorage.setItem(
						"books",
						JSON.stringify(booksWithImages)
					);
				})
				.catch(error => {
					console.error(error);
				});
		});

		return unsubscribe;
	}, []);

	if (!loading) {
		return <LoadingScreen />;
	}

	function priceDecorator(price) {
		return price.toFixed(2);
	}

	return (
		<>
			<Header />
			<div className="h-screen flex flex-col">
				<main className="flex gap-10 flex-wrap justify-start items-center mx-7 p-10">
					<DynamicMeta
						title="Books"
						description="All books available on the store"
					/>
					{books.map(book => (
						<Card
							onClick={() => (
								<RenderProductDescription bookDetails={book} />
							)}
							className="text-center cursor-pointer items-center bg-white p-4 min-w-min max-w-xs"
							key={book.uid}
						>
							<img
								src={localStorage.getItem(`image_${book.uid}`)}
								alt={book.name}
								className="h-32"
							/>
							<a
								href={"/book/" + book.uid}
								className="hover:text-orange-300"
								style={{
									display: "-webkit-box",
									WebkitBoxOrient: "vertical",
									WebkitLineClamp: 2,
									overflow: "hidden",
									textOverflow: "ellipsis"
								}}
								title={book.title}
							>
								{book.title}
							</a>
							<div className="italic text-orange-400">
								{book.currency} {priceDecorator(book.price)}
							</div>
						</Card>
					))}
				</main>
				<Footer />
			</div>
		</>
	);
}
