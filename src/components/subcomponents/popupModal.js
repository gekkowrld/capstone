/**
 * This file specifies the popup that will be displayed when the user input is received
 *
 * It is like a skeleton for the popup modal
 * Whenever it is used, the modal should be given the notification number and the content
 *
 * This can be considered a prototype for the popup modal
 * It uses the react-toastify library
 *
 * Check the documentation here for more information: https://fkhadra.github.io/react-toastify/introduction/
 *
 * @returns The popup modal with custom content
 *
 */

import PropTypes from "prop-types";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const PopupModal = ({ content, notificationNumber }) => {
	const notify = () => {
		switch (notificationNumber) {
			case 0:
				return toast.info(content);
			case 1:
				return toast.success(content);
			case 2:
				return toast.error(content);
			case 3:
				return toast.warning(content);
			default:
				return toast.info(content);
		}
	};
	return (
		<>
			{notify()}
			<ToastContainer
				position="top-left"
				theme="dark"
				limit={1}
				autoClose={3000}
				newestOnTop={true}
				closeOnClick={true}
				transition={Slide}
			/>
		</>
	);
};

PopupModal.propTypes = {
	content: PropTypes.element.isRequired,
	notificationNumber: PropTypes.number.isRequired
};

export default PopupModal;
