import {
	Button,
	Input,
	Rating,
	Textarea,
	Typography
} from "@material-tailwind/react";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import db, { getUserId } from "../../firebase/sdk";
import DynamicMeta from "../DynamicMeta";

/**
 * Check in the review collection if the user has already reviewed the product.
 *
 * The relevant fields are:
 * 		- productId
 * 		- userId
 *
 * This fields store the info about the product and the user who reviewed it.
 * If the current user had already reviewed the product, then then populate the
 * review form with the data from the review. Then use this as the basis of an
 * edit.
 *
 * If the user has not reviewed the product, then the form is blank and the user
 * 	is required to enter there review.
 *
 * The form should have the following fields:
 * 		- Title
 * 		- Rating (Should be displayed as stars but stored as a number)
 * 		- Review
 * 		- Submit Button
 *
 * The info sent back to the Firestore Database should be:
 * 		- title
 * 			- String
 * 		- rating
 * 			- Number
 * 		- body
 * 			- String
 * 		- productId
 * 			- String
 * 		- userId
 * 			- String
 * 		- reviewTime
 * 			- Timestamp
 *
 * If the user had already made a review, a new field should be created called
 * 		- editTime
 * 			- Timestamp
 *
 * For no reason should the "reviewTime" field be updated.
 * Only update the "editTime" field if the user had already made a review
 * (multiple).
 */

const reviewRef = collection(db, "reviews");

const AddReview = () => {
	<DynamicMeta title="Add Review" />;
	const { uid } = useParams();
	const [product, setProduct] = useState(null);
	const [user, setUser] = useState(null);
	const [review, setReview] = useState(null);
	const [_userId, _setUserId] = useState(null);
	const [rated, setRated] = useState(1);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const fetchProduct = async () => {
			const productRef = doc(collection(db, "products"), uid);
			const productDoc = await getDoc(productRef);
			if (productDoc.exists()) {
				setProduct(productDoc.data());
			} else {
				console.error("Something went wrong!");
			}
		};
		const fetchUser = async () => {
			try {
				const userId = await getUserId();
				const userRef = doc(collection(db, "users"), userId);
				const userDoc = await getDoc(userRef);
				if (userId) {
					_setUserId(userId);
				}
				if (userDoc.exists()) {
					setUser(userDoc.data());
				} else {
					console.error("Something went wrong!");
				}
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		const fetchReviews = async () => {
			const productReview = query(
				reviewRef,
				where("productId", "==", uid),
				where("userId", "==", _userId)
			);
			const querySnapshot = await getDocs(productReview);
			const reviewArr = [];
			querySnapshot.forEach(doc => {
				reviewArr.push({ ...doc.data(), id: doc.id });
			});

			if (reviewArr.length > 0) {
				const existingReview = reviewArr[0];
				setReview(existingReview);
				setIsEditing(true);
			}
		};

		fetchUser();
		fetchProduct();
		fetchReviews();
	}, []);

	const submitForm = async () => {
		const title = document.querySelector("input").value;
		const body = document.querySelector("textarea").value;
		const rating = rated;
		const productId = uid;
		const userId = _userId;
		const reviewTime = new Date();

		if (isEditing) {
			const editTime = new Date();
			const reviewRef = doc(
				collection(db, "reviews"),
				review.id // Assuming you have the review document ID
			);
			await updateDoc(reviewRef, {
				title,
				body,
				rating,
				productId,
				userId,
				editTime
			});
		} else {
			const reviewRef = doc(collection(db, "reviews"));
			await setDoc(reviewRef, {
				title,
				body,
				rating,
				productId,
				userId,
				reviewTime
			});
		}
	};

	return (
		<div className="w-full center h-screen flex flex-col justify-center">
			<DynamicMeta
				title={`Add Review for ${product ? product.name : "?!"} (${
					user ? user.name : "?!"
				})`}
			/>
			<form>
				<div className="flex flex-col items-center">
					<div className="mb-4 flex flex-col gap-6">
						<Input
							size="lg"
							label="Topic"
							required
							defaultValue={review ? review.title : ""}
						/>
						<Textarea
							size="lg"
							label="Review"
							defaultValue={review ? review.body : ""}
						/>
					</div>
					<div className="flex items-center gap-2">
						<Rating value={1} onChange={value => setRated(value)} />
						<Typography color="blue-gray" className="font-medium">
							{rated}.0 Rated
						</Typography>
					</div>
					<Button
						type="submit"
						color="blue"
						ripple
						className="mt-6"
						onClick={e => {
							e.preventDefault();
							submitForm();
						}}
					>
						Submit
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddReview;
