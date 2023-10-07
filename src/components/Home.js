import Footer from "./Footer";
import Header from "./Header";
import { useEffect, useState } from "react";
import { oneLineLoading } from "./Loading";

function Home() {
	const [quoteContent, setQuoteContent] = useState("");
	const [quoteAuthor, setQuoteAuthor] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchQuote();
		const intervalId = setInterval(fetchQuote, 15000);

		return () => clearInterval(intervalId);
	}, []);
	const fetchQuote = () => {
		setIsLoading(true);
		fetch("https://api.quotable.io/random?maxLength=100")
			.then(response => response.json())
			.then(data => {
				setQuoteContent(data.content);
				setQuoteAuthor(data.author);
				setIsLoading(false);
			});
	};

	return (
		<>
			<Header />
			<div className="flex flex-col items-center justify-center h-screen overflow-hidden">
				<p
					className={`text-4xl font-bold text-center ${
						isLoading
							? "ease-in-out opacity-0 transition-opacity duration-1000"
							: "ease-in-out opacity-1 transition-opacity duration-1000"
					}`}
				>
					<span>
						&quot;{quoteContent ? quoteContent : oneLineLoading()}
						&quot;
					</span>
				</p>
				<p
					className={`text-2xl font-bold text-center ${
						isLoading
							? "ease-in-out opacity-0 transition-opacity duration-1000"
							: "ease-in-out opacity-1 transition-opacity duration-1000"
					}`}
				>
					-{quoteAuthor ? quoteAuthor : oneLineLoading()}
				</p>
			</div>
			<Footer />
		</>
	);
}

export default Home;
