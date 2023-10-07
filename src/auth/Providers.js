import DynamicMeta from "../components/DynamicMeta";
import { signInWithGoogle, signInWithTwitter } from "../sdk/firebase";
import Footer from "../components/Footer";

const Providers = () => {
	return (
		<div className="h-screen flex flex-col items-center">
			<div className="w-full flex h-screen flex-col items-center justify-center">
				<DynamicMeta
					title="Login"
					description="Login Page to Capstone Project"
				/>
				<div className="bg-white p-8 shadow-md rounded-md w-96">
					<h2 className="text-2xl font-semibold mb-4 text-center">
						Login
					</h2>

					<button
						onClick={signInWithGoogle}
						className="bg-red-400 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full mb-4 w-full duration-500 ease-in-out"
					>
						Login with Google
					</button>

					<button
						onClick={signInWithTwitter}
						className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-full w-full duration-500 ease-in-out"
					>
						Login with Twitter
					</button>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Providers;
