import { cartIMg, logo } from "../assets/img";
import { Link } from "react-router-dom";

const Header = () => {
	let session_id = /SESS\w*ID=([^;]+)/i.test(document.cookie)
		? RegExp.$1
		: false;
	let photoUrl = `https://picsum.photos/seed/${session_id}/40/?grayscale&blur=1`;
	return (
		<div className="w-full h-20 bg-white border-b-[1px] border-b-gray-800 px-2">
			<div className="max-w-screen-xl h-full mx-auto flex items-center justify-between">
				<div className="cursor-pointer">
					<a href="/">
						<img className="w-28" src={logo} alt="Capstone Logo" />
					</a>
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
							<img src={cartIMg} alt="cart" />{" "}
						</li>
						<li className="cursor-pointer">
							{" "}
							<img
								className="rounded-full"
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
