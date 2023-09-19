import { cartIMgX, cartImgL, logo } from "../assets/img";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../firebase/sdk";
import Search from "./Search";

const Header = () => {
	let session_id = /SESS\w*ID=([^;]+)/i.test(document.cookie)
		? RegExp.$1
		: false;
	const currentUserImg = localStorage.getItem("photo");
	const name = localStorage.getItem("name");
	const loggedIn = isLoggedIn();

	let photoUrl = `https://picsum.photos/seed/${session_id}/40/?grayscale&blur=1`;

	if (loggedIn && currentUserImg) {
		photoUrl = currentUserImg;
	}

	if (loggedIn && !currentUserImg) {
		photoUrl = `https://picsum.photos/seed/${name}/40/?grayscale&blur=1`;
	}

	let cartLogo = cartIMgX;

	if (loggedIn) {
		cartLogo = cartImgL;
	}

	return (
		<div className="w-full h-20 bg-white border-b-[1px] border-b-gray-800 px-2 sticky top-0">
			<div className="max-w-screen-xl h-full mx-auto flex items-center justify-between">
				<div className="cursor-pointer">
					<a href="/">
						<img className="w-28" src={logo} alt="Capstone Logo" />
					</a>
				</div>
				<div className="flex items-center gap-8">
					<Search />
				</div>
				<div className="flex">
					<ul className="flex items-center gap-8">
						<li className="cursor-pointer hover:text-orange-600 from-current to-red-600 transition-all duration-1000 ease-out after:bg-black after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 relative">
							{" "}
							<Link to="/">Home</Link>{" "}
						</li>
						<li className="cursor-pointer hover:text-orange-600 from-current to-red-600 transition-all duration-1000 ease-out after:bg-black after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 relative">
							{" "}
							<Link to="/products"> Products </Link>{" "}
						</li>
						<li className="cursor-pointer">
							{" "}
							<img src={cartLogo} alt="cart" />{" "}
						</li>
						<li className="cursor-pointer">
							{" "}
							<img
								className="rounded-full w-10 h-10"
								src={photoUrl}
								alt="profile"
							/>{" "}
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Header;
