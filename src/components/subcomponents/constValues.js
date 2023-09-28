const projectName = "Capstone Project";
const productPage = "products";
import { setUserId } from "../../firebase/sdk";

export const getUserId = () => {
	return setUserId();
};

export { projectName, productPage };
