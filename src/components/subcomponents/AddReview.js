import { useEffect, useState } from "react";
import { getUserId } from "../../sdk/firebase";
import { useParams } from "react-router-dom";
import {
	collection,
	doc,
	getDoc,
	setDoc,
	serverTimestamp
} from "firebase/firestore";
import db from "../../sdk/firebase";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { loadingSquare } from "../../assets/img";
import { Edit } from "@mui/icons-material";
import DynamicMeta from "../DynamicMeta";
import { Input, Textarea, Button } from "@material-tailwind/react";

/**
 * Save the user review using the document id of:
 * 		- the user + the product id
 * 		e.g if the product id is 1234567890 and the user id is 0987654321
 * 			then the document id will be 0987654321-1234567890
 *
 * This will make it easier to query the reviews of a specific user
 *	and avoid having to query all the reviews and then filter them/duplicate them
 */

const AddReview = () => {
	const [review, setReview] = useState("");
	const [rating, setRating] = useState(null);
	const [reviewBody, setReviewBody] = useState("");
	const [userId, setUserId] = useState(null);
	const productId = useParams().uid;
	const [isReviewAvailable, setIsReviewAvailable] = useState(false);
	const [product, setProduct] = useState(null);

	let reviewKey = `capstone_g_-review-${productId}}`;
	let ratingKey = `capstone_g_-rating-${productId}}`;
	let reviewBodyKey = `capstone_g_-reviewBody-${productId}}`;
	let reviewAvailable = `capstone_g_-reviewAvailable-${productId}}`;
	useEffect(() => {
		const fetchProduct = async () => {
			const productRef = doc(collection(db, "products"), productId);
			const productDoc = await getDoc(productRef);
			if (productDoc.exists()) {
				setProduct(productDoc.data());
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

		const fetchUserProductReview = async () => {
			const userProductReviewRef = doc(
				collection(db, "reviews"),
				`${userId}-${productId}`
			);
			const userProductReviewDoc = await getDoc(userProductReviewRef);
			if (userProductReviewDoc.exists()) {
				setReview(userProductReviewDoc.data().review);
				setRating(userProductReviewDoc.data().rating);
				setReviewBody(userProductReviewDoc.data().reviewBody);
				setIsReviewAvailable(true);
			}
		};
		const saveDataToLocalStorage = () => {
			if (review) {
				localStorage.setItem(reviewKey, review);
			}
			if (rating) {
				localStorage.setItem(ratingKey, rating);
			}
			if (reviewBody) {
				localStorage.setItem(reviewBodyKey, reviewBody);
			}
			if (isReviewAvailable) {
				localStorage.setItem(reviewAvailable, isReviewAvailable);
			}
		};

		saveDataToLocalStorage();
		fetchUserProductReview();
		fetchUserId();
		fetchProduct();
	}, []);

	const saveReview = async () => {
		if (isReviewAvailable) {
			await setDoc(doc(db, "reviews", `${userId}-${productId}`), {
				review: review,
				rating: rating,
				reviewBody: reviewBody,
				userId: userId,
				productId: productId,
				updateTime: serverTimestamp()
			});
		} else {
			await setDoc(doc(db, "reviews", `${userId}-${productId}`), {
				review: review,
				rating: rating,
				reviewBody: reviewBody,
				userId: userId,
				productId: productId,
				reviewTime: serverTimestamp()
			});
		}

		localStorage.removeItem(reviewKey);
		localStorage.removeItem(ratingKey);
		localStorage.removeItem(reviewBodyKey);
		localStorage.removeItem(reviewAvailable);
	};

	return (
		<>
			{isReviewAvailable ? (
				<DynamicMeta
					title={
						"Editing review for " + (product ? product.name : "?!")
					}
				/>
			) : (
				<DynamicMeta
					title={
						"Adding review for" + (product ? product.name : "?!")
					}
				/>
			)}
			<div className="flex flex-col justify-center items-center">
				<div className="w-3/4 flex gap-8 flex-col">
					{isReviewAvailable ? (
						<p>Edit Review {<Edit />}</p>
					) : (
						<p>Add Review {<Edit />}</p>
					)}
					{review ? localStorage.setItem(reviewKey, review) : null}
					{rating ? localStorage.setItem(ratingKey, rating) : null}
					{reviewBody
						? localStorage.setItem(reviewBodyKey, reviewBody)
						: null}
					{isReviewAvailable
						? localStorage.setItem(
							reviewAvailable,
							isReviewAvailable
						)
						: null}
					<Input
						type="text"
						placeholder="Review"
						onChange={e => setReview(e.target.value)}
						defaultValue={review}
						label="Review"
						className="font-bold"
					/>
					<Textarea
						placeholder="Review Body"
						onChange={e => setReviewBody(e.target.value)}
						defaultValue={reviewBody}
						label="Review Body"
						slots={{
							input: reviewBody
						}}
					/>
					<Rating
						name="hover-feedback"
						value={rating}
						onChange={(event, newValue) => {
							setRating(newValue);
						}}
						emptyIcon={
							<StarIcon
								style={{ opacity: 0.55 }}
								fontSize="inherit"
							/>
						}
					/>
					<button
						onClick={() => {
							setRating(localStorage.getItem(ratingKey));
							setReview(localStorage.getItem(reviewKey));
							setReviewBody(localStorage.getItem(reviewBodyKey));
							setIsReviewAvailable(
								localStorage.getItem(reviewAvailable)
							);
						}}
					>
						<img
							className="w-10 h-10"
							src={loadingSquare}
							alt="Load previous data"
						/>
					</button>
					<br />
					<Button onClick={() => saveReview()}>Submit</Button>
				</div>
			</div>
		</>
	);
};

export default AddReview;
