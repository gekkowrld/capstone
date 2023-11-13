import db from "../../sdk/firebase";
import { collection, getDocs } from "firebase/firestore";

async function GetDataFromFirebase() {
	try {
		const booksRef = collection(db, "books");
		const snapshot = await getDocs(booksRef);

		const books = [];
		snapshot.forEach(doc => {
			books.push(doc.data());
		});

		localStorage.setItem("books", JSON.stringify(books));
	} catch (error) {
		console.error(error);
	}
}

GetDataFromFirebase();
