import { Card } from "@material-tailwind/react";
import { collection, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import db from "../../sdk/firebase";
import PageNotFound from "../404";
import DynamicMeta from "../DynamicMeta";
import Header from "../Header";
import LoadingScreen from "../Loading";

import AddToCart from "./AddToCart";
import ReviewDataShow from "./ReviewPage";

const RenderProductDescription = () => {
	const { uid } = useParams();
	const [book, setProduct] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
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
						<p className="text-center font-bold text-2xl books_title">
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
											<p className="text-black font-bold">Description:</p>
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
										<p>No Extra Links!</p>
									)}
								</>
							}
							{
								book.dates && book.dates.length > 0 && (
									<>
										<p className="text-black font-bold">Dates:</p>
										{book.dates.map(date => {
											return <p key={uid}>{date}</p>;
										})}
									</>
								)
							}
							{
								book.item.notes && (
									<>
										<p className="text-black font-bold">Notes:</p>
										<p>{book.item.notes}</p>
									</>
								)
							}
							{
								<>
									{book.item.subjects ? (
										<p className="text-black font-bold">
											Subjects:
										</p>
									) : (
										""
									)}
									{book.item.subjects
										? book.item.subjects.map(subject => {
											return (
												<p key={uid}>{subject}</p>
											);
										})
										: ""}
								</>
							}
							{
								<>
									{
										book.resources[0]?.pdf ? (
											<p className="text-black font-bold">
												PDF Version:
											</p>
										) : ("")
									}
									{
										book.resources[0]?.pdf ? (
											<a
												className="hover:text-orange-300"
												href={book.resources[0]?.pdf}
											>
												{book.resources[0]?.pdf}
											</a>
										) : ("")
									}
								</>
							}
							<AddToCart book={book} />
							<ReviewDataShow bookId={uid} />
						</Card>
					</div>
				</div>
			) : (
				<PageNotFound />
			)}{" "}
		</div>
	);
};

export default RenderProductDescription;
