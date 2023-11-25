import { useEffect, useState } from "react";
import { getUserId } from "../../sdk/firebase";
import { useParams } from "react-router-dom";
import {
	collection,
	doc,
	getDoc,
	setDoc,
	serverTimestamp,
	onSnapshot,
} from "firebase/firestore";
import db from "../../sdk/firebase";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { Edit } from "@mui/icons-material";
import DynamicMeta from "../DynamicMeta";
import { Input, Textarea, Button } from "@material-tailwind/react";

const AddReview = () => {
	const [review, setReview] = useState("");
	const [rating, setRating] = useState(null);
	const [reviewBody, setReviewBody] = useState("");
	const [userId, setUserId] = useState(null);
	const bookId = useParams().uid;
	const [isReviewAvailable, setIsReviewAvailable] = useState(false);
	const [book, setbook] = useState([]);
	const [isValid, setIsValid] = useState(false);

	useEffect(() => {
		const fetchbook = async () => {
			const bookRef = doc(collection(db, "books"), bookId);
			const bookDoc = await getDoc(bookRef);
			if (bookDoc.exists()) {
				setbook(bookDoc.data());
			} else {
				console.error("Something went wrong!");
			}
		};

		const fetchUserId = async () => {
			try {
				const userId = await getUserId();
				setUserId(userId);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		const fetchUserbookReview = () => {
			const userbookReviewRef = doc(
				collection(db, "reviews"),
				`${userId}-${bookId}`
			);

			const unsubscribe = onSnapshot(userbookReviewRef, (snapshot) => {
				if (snapshot.exists()) {
					const data = snapshot.data();
					setReview(data.review);
					setRating(data.rating);
					setReviewBody(data.reviewBody);
					setIsReviewAvailable(true);
				}
			});

			return unsubscribe;
		};


		fetchUserbookReview();
		fetchUserId();
		fetchbook();
	}, [userId, bookId]);

	useEffect(() => {
		const form = { review, rating, reviewBody };
		const formValues = Object.values(form);
		setIsValid(formValues.every((field) => field !== ""));
	}, [review, rating, reviewBody]);

	const saveReview = async () => {
		if (isReviewAvailable) {
			await setDoc(doc(db, "reviews", `${userId}-${bookId}`), {
				review: review,
				rating: rating,
				reviewBody: reviewBody,
				userId: userId,
				bookId: bookId,
				updateTime: serverTimestamp(),
			}, { merge: true });
		} else {
			await setDoc(doc(db, "reviews", `${userId}-${bookId}`), {
				review: review,
				rating: rating,
				reviewBody: reviewBody,
				userId: userId,
				bookId: bookId,
				reviewTime: serverTimestamp(),
			}, { merge: true });
		}
	};

	return (
		<>
			{isReviewAvailable ? (
				<DynamicMeta
					title={"Editing review for " + (book ? book.title : "?")}
				/>
			) : (
				<DynamicMeta
					title={"Adding review for" + (book ? book.title : "?")}
				/>
			)}
			<div className="flex flex-col justify-center items-center">
				<div className="w-3/4 flex gap-8 flex-col">
					{isReviewAvailable ? (
						<p>Edit Review for {book.title} {<Edit />}</p>
					) : (
						<p>Add Review for {book.title} {<Edit />}</p>
					)}
					<Input
						type="text"
						placeholder="Review"
						onChange={(e) => setReview(e.target.value)}
						defaultValue={review}
						label="Review"
						className="font-bold"
					/>
					<Textarea
						placeholder="Review Body"
						onChange={(e) => setReviewBody(e.target.value)}
						defaultValue={reviewBody}
						label="Review Body"
						slots={{
							input: reviewBody,
						}}
					/>
					<Rating
						name="hover-feedback"
						value={rating}
						onChange={(event, newValue) => {
							setRating(newValue);
						}}
						emptyIcon={
							<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
						}
					/>
					<br />
					<div style={{ display: "flex" }}>
						<Button
							style={{
								width: "auto"
							}}
							disabled={!isValid}
							onClick={() => saveReview()}>Submit</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddReview;
