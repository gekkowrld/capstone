import { SearchRounded } from "@mui/icons-material";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * This search bar was influenced by ALX's search bar.
 * Note that the search bar is not fully replicated.
 * This is due to copyright reasons (all intellectual and creativity
 *  properties are to be reserved ).
 * But the functionality is there.
 *
 * The books are first fetched from the database.
 * After fetching (probably every time the user presses the search bar (or slash)),
 * 	this is to "ensure" that the books are up to date.
 *
 * This is to ensure that less api calls are made while keeping everything up to date.
 * 		(If the books are not fetched every time the user presses the search bar,
 * 			then the books will not be up to date.)
 *
 * The books are then filtered by the search term.
 * 		(If the search term is empty, then no book is displayed.)
 *
 * This style is not recommended for production (or large dataset).
 * This is because the search is done on the client side.
 * This means that the client will have to download all the books (the name and id) of the books collection.
 * This is not efficient.
 *
 * If you have a large dataset, then you should use Algolia (or other books).
 * 	There are many tutorials on how to use Algolia with Firebase.
 *
 * Or if you hate non open source books, then you can use ElasticSearch (not fully open source).
 *
 * @returns A stylized search bar that allows the user to search for books by
 *     name.
 */

function Search() {
	const [searchTerm, setSearchTerm] = useState("");
	const [booksData, setProductsData] = useState([]);
	const [showResults, setShowResults] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleModalClose = () => {
		setShowModal(false);
	};

	const handleButtonClick = () => {
		setShowModal(true);
	};

	useEffect(() => {
		const db = getFirestore();
		const booksRef = collection(db, "books");

		const unsubscribe = onSnapshot(booksRef, snapshot => {
			const data = [];
			snapshot.forEach(doc => {
				const { title, id } = { ...doc.data(), id: doc.id };
				data.push({ title, id });
			});
			setProductsData(data);
		});

		return () => unsubscribe();
	}, []);

	const handleSearch = event => {
		setSearchTerm(event.target.value);
		setShowResults(true);
	};

	const filteredProducts = booksData.filter(book => {
		let searchTermLower = searchTerm.toLowerCase();
		let bookNameLower = book.title.toLowerCase();

		const bookWords = bookNameLower.split(" ");
		if (bookNameLower.startsWith(searchTermLower)) {
			return true;
		} else if (bookWords.includes(searchTermLower)) {
			return true;
		} else if (bookWords.some(word => word.startsWith(searchTermLower))) {
			return true;
		} else if (bookNameLower.includes(searchTermLower)) {
			return true;
		} else return false;
	});

	function handleSlash() {
		document.addEventListener("keydown", function (event) {
			if (event.key === "/") {
				event.preventDefault();
				setShowModal(true);
			}
		});
	}
	const displayResults = () => {
		return (
			<div className="w-full flex items-center flex-col justify-center overflow-auto">
				{showResults && (
					<ul className="flex items-center flex-col w-full overflow-y-auto">
						{filteredProducts.map(book => (
							<Link
								className="w-4/5 h-14 z-40 bg-deep-orange-900 p-14 rounded-md flex items-center justify-center flex-col hover:text-orange-700 hover:bg-blue-gray-500"
								to={"/book/" + book.id}
								key={book.id}
							>
								<li>
									<p>{book.title}</p>
								</li>
							</Link>
						))}
					</ul>
				)}
			</div>
		);
	};

	const createModal = () => {
		return (
			<div
				className="fixed top-0 p-7 w-full h-screen bg-black bg-opacity-50 flex items-center flex-col"
				onClick={handleModalClose}
			>
				<div
					onClick={e => e.stopPropagation()}
					className="w-4/5 h-14 z-50 bg-deep-orange-900 p-14 rounded-md flex items-center justify-center mb-5"
				>
					<input
						autoFocus
						type="text"
						value={searchTerm}
						onChange={handleSearch}
						placeholder="✨Start search by typing in this field✨"
						className="w-96 h-14 rounded-lg border border-black text-center border-opacity-50 outline-none"
					/>
				</div>
				{searchTerm.length > 0 && displayResults()}
			</div>
		);
	};

	return (
		<div>
			{handleSlash()}
			<button
				aria-description="Search for books"
				aria-label="search"
				onClick={handleButtonClick}
				className="fixed z-40 h-14 w-14 bottom-11 bg-deep-orange-800 right-11 rounded-lg text-white flex items-center justify-center border border-black"
			>
				<SearchRounded
					sx={{
						color: "white",
						fontSize: "3rem"
					}}
				/>
			</button>
			{showModal && createModal()}
		</div>
	);
}

export default Search;
