import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Initialize Firebase Storage
const storage = getStorage();

// Function to retrieve image URL from Firebase Storage
async function getImageUrl(imagePath) {
	const imageRef = ref(storage, imagePath);
	const imageUrl = await getDownloadURL(imageRef).catch(error => {
		console.log(error);
	});
	return imageUrl;
}

export default getImageUrl;
