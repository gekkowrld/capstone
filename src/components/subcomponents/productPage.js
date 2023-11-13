import { useEffect, useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useParams } from "react-router-dom";

import { getUserId } from "../../sdk/firebase";
import db from "../../sdk/firebase";
import DynamicMeta from "../DynamicMeta";
import LoadingScreen from "../Loading";
import Header from "../Header";

import ReviewDataShow from "./ReviewPage";
import AddToCart from "./AddToCart";
import { Card } from "@material-tailwind/react";
import PageNotFound from "../404";

const RenderProductDescription = () => {
	const { uid } = useParams();
	const [book, setProduct] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [userUid, setUserUid] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProduct = async () => {
			const bookRef = doc(collection(db, "books"), uid);
			const bookDoc = await getDoc(bookRef);
			if (bookDoc.exists()) {
				const bookData = bookDoc.data();
				setProduct(bookData);

				const storageRef = ref(getStorage(), bookData.img_url);
				const url = await getDownloadURL(storageRef);
				setImageUrl(url);
			} else {
				setLoading(false);
				console.error("No Image for this book");
			}
		};
		const fetchUserId = async () => {
			try {
				const userId = await getUserId();
				setUserUid(userId);
			} catch (error) {
				console.error(error);
			}
		};

		fetchUserId();
		fetchProduct().then(() => setLoading(false));
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
	console.log(userUid);
	return (
		<div>
			<Header />
			{loading ? (
				<LoadingScreen />
			) : book ? (
				<div className="flex justify-center">
					<div className="flex flex-row flex-wrap w-11/12">
						<DynamicMeta
							title={book.title}
							description={book.title + book.description}
						/>
						<p className="text-center font-bold text-2xl">
							{book.title}
						</p>
						<div className="flex w-full py-8 flex-grow-0 justify-center bg-gray-300 rounded-md">
							<img
								src={imageUrl}
								alt={book.name}
								className="h-96"
							/>
						</div>
						<Card className="p-3 my-5 w-full">
							<div className="italic text-gray-800">
								<span className="text-black font-bold">
									Price:{" "}
								</span>
								{book.currency} {priceDecorator(book.price)}
							</div>
							{
								<>
									{book.contributor ? (
										<p className="text-black font-bold">
											Contributors:
										</p>
									) : (
										""
									)}
									{book.contributor
										? book.contributor.map(contributor => {
												return (
													<p key={uid}>
														{contributor}
													</p>
												);
										  })
										: ""}
								</>
							}
							{
								<>
									{book.description ? (
										<>
											<p>Description</p>
											<p>{book.description}</p>
										</>
									) : (
										""
									)}
								</>
							}
							{
								<>
									<p className="text-black font-bold">
										LCCN Permalink:{" "}
									</p>
									{
										<p className="hover:text-orange-300">
											{book.url ? (
												<a
													href={book.url}
													target="_blank"
													rel="noreferrer"
												>
													{book.url}
												</a>
											) : (
												"No book url"
											)}
										</p>
									}
								</>
							}
							{
								<>
									<p className="text-black font-bold">
										LC classification:{" "}
									</p>
									{
										<p>
											{book.shelf_id
												? book.shelf_id
												: "No shelf id"}
										</p>
									}
								</>
							}
							{
								<>
									<p className="text-black font-bold">ID: </p>
									{<p>{book.id ? book.id : "No shelf id"}</p>}
								</>
							}
							{
								<>
									<p className="text-black font-bold">
										Other Links:{" "}
									</p>
									{book.aka ? (
										book.aka.map(a__ => {
											return (
												<a
													className="hover:text-orange-300"
													key={uid}
													href={a__}
												>
													{a__}
												</a>
											);
										})
									) : (
										<p>No Extra Links</p>
									)}
								</>
							}
							{
								<>
									<p className="text-black font-bold">
										Dates:{" "}
									</p>
									{book.dates ? (
										book.dates.map(date => {
											return <p key={uid}>{date}</p>;
										})
									) : (
										<p>No dates exists</p>
									)}
								</>
							}
							{
								<>
									{book.item.notes ? (
										<p className="text-black font-bold">
											Notes
										</p>
									) : (
										""
									)}
									{book.item.notes
										? book.item.notes.map(note => {
												return <p key={uid}>{note}</p>;
										  })
										: ""}
								</>
							}
							<AddToCart book={book} />
							<ReviewDataShow bookId={uid} />
						</Card>
					</div>
				</div>
			) : (
				<PageNotFound />
			)}
		</div>
	);
};

export default RenderProductDescription;
