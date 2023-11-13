import {
	collection,
	query,
	where,
	limit,
	getDocs,
	orderBy
} from "firebase/firestore";
import Footer from "./Footer";
import Header from "./Header";
import db from "../sdk/firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Card } from "@mui/material";
import {
	ArrowBackIosNewRounded,
	ArrowForwardIosRounded
} from "@mui/icons-material";
import { oneLineLoading } from "../components/Loading";
import { masterHeaderBG } from "../assets/img";

function getRandomNumber() {
	return Math.floor(Math.random() * 600);
}

const booksRef = collection(db, "books");
const storage = getStorage();

function Home() {
	const [books, setBooks] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [randomNumber, setRandomNumber] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [greetingIndex, setGreetingIndex] = useState(0);
	let greetingText = [
		"absorbing",
		"acclaimed",
		"addictive",
		"brilliant",
		"classical",
		"emotional",
		"evocative",
		"exquisite",
		"inspiring",
		"intensive",
		"intuitive",
		"inventive",
		"memorable",
		"narrative",
		"realistic",
		"revealing",
		"sarcastic",
		"visionary",
		"whimsical",
		"wholesome"
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setGreetingIndex(Math.floor(Math.random() * greetingText.length));
		}, 2300);
		return () => clearInterval(interval);
	}, [greetingIndex, greetingText]);

	useEffect(() => {
		setRandomNumber(getRandomNumber());
	}, []);

	const q = query(
		booksRef,
		where("book_no", ">=", randomNumber),
		orderBy("book_no"),
		limit(10)
	);

	useEffect(() => {
		const fetchBooks = async () => {
			const booksSnapshot = await getDocs(q);
			const booksData = await Promise.all(
				booksSnapshot.docs.map(async doc => {
					const data = doc.data();
					const storageRef = ref(storage, data.img_url);
					data.img_url = await getDownloadURL(storageRef);
					return { uid: doc.id, ...data };
				})
			);
			setBooks(booksData);
			setIsLoading(false);
		};
		fetchBooks();
	}, []);

	console.log(books);

	if (isLoading) {
		return (
			<>
				<Header />
				<div className="flex justify-center items-center">
					<Card
						sx={{
							backgroundColor: "#B9B9B9",
							color: "#3E3E3E"
						}}
						className="flex justify-center items-center flex-col text-center w-60 sm:w-80 h-96 text-gray-800 bg-blue-gray-500"
					>
						{oneLineLoading()}
					</Card>
				</div>
				<Footer />
			</>
		);
	}

	function greetBookText() {
		return (greetingText = greetingText[greetingIndex]);
	}

	return (
		<>
			<Header />
			<>
				<div
					className="mt-10 mb-4 h-96 flex justify-center items-center"
					style={{
						backgroundImage: `url(${masterHeaderBG})`,
						backgroundSize: "cover",
						backgroundPosition: "bottom",
						width: "100%",
						backgroundRepeat: "no-repeat"
					}}
				>
					<p className="text-center text-6xl sm:text-9xl font-bold text-deep-orange-900">
						<span>Meet your next </span>
						<span className="text-deep-orange-500">
							{greetBookText()}
						</span>
						<span> book.</span>
					</p>
				</div>
				{books.length > 0 ? (
					<div className="flex flex-row justify-center">
						<button
							onClick={() =>
								setCurrentIndex(
									currentIndex > 0
										? currentIndex - 1
										: books.length - 1
								)
							}
						>
							<ArrowBackIosNewRounded />
						</button>
						<Card className="flex justify-center items-center flex-col text-center w-60 sm:w-80 h-96 relative overflow-hidden">
							{books && books[currentIndex] && (
								<div className="flex justify-center items-center flex-col">
									<img
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover"
										}}
										src={books[currentIndex].img_url}
										alt={books[currentIndex].title}
									/>
									<a
										className="hover:text-orange-300 absolute p-4 bottom-3 w-full text-center"
										style={{
											display: "-webkit-box",
											WebkitBoxOrient: "vertical",
											overflow: "scroll",
											background: "rgba(0, 0, 0, 0.5)",
											color: "#fff"
										}}
										title={books[currentIndex].title}
										href={
											"/book/" + books[currentIndex].uid
										}
									>
										{books[currentIndex].title}
									</a>
								</div>
							)}
						</Card>
						<button
							onClick={() =>
								setCurrentIndex(
									currentIndex < books.length - 1
										? currentIndex + 1
										: 0
								)
							}
						>
							<ArrowForwardIosRounded />
						</button>
					</div>
				) : (
					<div className="flex justify-center items-center">
						<Card
							sx={{
								backgroundColor: "#B9B9B9",
								color: "#3E3E3E"
							}}
							className="flex justify-center items-center flex-col text-center w-60 sm:w-80 h-96 text-gray-800 bg-blue-gray-500"
						>
							<p>
								The Query cannot find any interesting document
							</p>
						</Card>
					</div>
				)}
			</>
			<Footer />
		</>
	);
}

export default Home;
