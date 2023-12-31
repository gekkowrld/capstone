import { Button } from "@material-tailwind/react";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where
} from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import db from "../../sdk/firebase";

import AddReview from "./AddReview";

const reviewsRef = collection(db, "reviews");

export default function ReviewDataShow({ bookId }) {
	const [reviews, setReviews] = useState([]);
	const [userImages, setUserImages] = useState({});

	useEffect(() => {
		async function fetchReviews() {
			const bookReview = query(reviewsRef, where("bookId", "==", bookId));

			const querySnapshot = await getDocs(bookReview);
			const reviewsData = [];
			querySnapshot.forEach(doc => {
				reviewsData.push({ ...doc.data(), id: doc.id });
			});
			setReviews(reviewsData);
		}

		fetchReviews();
	}, [bookId]);

	useEffect(() => {
		async function fetchUserImages() {
			const imagePromises = reviews.map(async review => {
				try {
					const userDoc = await getDoc(
						doc(db, "users", review.userId)
					);
					if (userDoc.exists()) {
						return {
							userId: review.userId,
							photo: userDoc.data().photo,
							name: userDoc.data().name
						};
					} else {
						console.error(`No user found with ID ${review.userId}`);
						return {
							userId: review.userId,
							photo: null,
							name: null
						};
					}
				} catch (error) {
					console.error(
						`Error getting user with ID ${review.userId}: ${error}`
					);
					return { userId: review.userId, photo: null, name: null };
				}
			});

			const userImagesArray = await Promise.all(imagePromises);
			const userImagesObject = userImagesArray.reduce((acc, item) => {
				acc[item.userId] = { photo: item.photo, name: item.name };
				if (acc[item.userId].photo === null)
					acc[item.userId].photo = "https://picsum.photos/30";
				if (acc[item.userId].name === null)
					acc[item.userId].name = "Unknown User";
				return acc;
			}, {});

			setUserImages(userImagesObject);
		}

		fetchUserImages();
	}, [reviews]);

	return (
		<div className="mt-12">
			<p className="text-2xl font-bold">Reviews</p>
			{reviews.length === 0 && <p>No reviews yet.</p>}
			{reviews.map(review => (
				<div key={review.id}>
					{userImages[review.userId] && (
						<div className="flex items-center gap-4">
							<img
								src={userImages[review.userId].photo}
								alt={userImages[review.userId].name}
								style={{ width: "30px", height: "30px" }}
								onError={e => {
									e.target.onerror = null;
									e.target.src = "https://picsum.photos/30";
								}}
							/>
							<h3>{userImages[review.userId].name}</h3>
						</div>
					)}
					<p>
						{review.updateTime
							? `Updated on:${new Date(
									review.updateTime * 1000
							  ).toLocaleDateString()} at ${new Date(
									review.updateTime * 1000
							  ).toLocaleTimeString()}`
							: `Reviewed on: ${new Date(
									review.reviewTime * 1000
							  ).toLocaleDateString()} at ${new Date(
									review.reviewTime * 1000
							  ).toLocaleTimeString()}`}
					</p>
					<div className="flex items-center gap-2">
						{Array.from({ length: 5 }, (_, index) => (
							<svg
								key={index}
								xmlns="http://www.w3.org/2000/svg"
								className={`h-5 w-5 ${
									index < review.rating
										? "text-yellow-500"
										: "text-gray-400"
								}`}
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 15.854l-5.51 3.345 1.32-6.893L.49 7.801l6.905-.998L10 1.49l2.605 5.313 6.905.998-5.32 5.505 1.32 6.893z"
									clipRule="evenodd"
								/>
							</svg>
						))}
						<p className="font-bold">{review.review}</p>
					</div>
					<pre className="mt-2 text-sm font-sans text-gray-600">
						{review.reviewBody}
					</pre>
				</div>
			))}
			<div className="mt-4">
				<a href={"/book/review/" + bookId}>
					<Button
						onClick={() => <AddReview bookId={bookId} />}
						color="blue"
						ripple
					>
						Write a review
					</Button>
				</a>
			</div>
		</div>
	);
}

ReviewDataShow.propTypes = {
	bookId: PropTypes.string.isRequired
};
