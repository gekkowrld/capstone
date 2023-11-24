import DynamicMeta from "../components/DynamicMeta";
import {
	signInWithGithub,
	signInWithGoogle,
	signInWithTwitter
} from "../sdk/firebase";
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
					<p>
						Disclaimer: The login may show that you will be
						redirected to another website than the one that you are
						on. This is an expected behaviour, DO NOT PANIC.
					</p>
					<br />

					<button
						onClick={signInWithGoogle}
						className="bg-blue-gray-600 hover:bg-blue-gray-400 text-white font-semibold py-2 px-4 rounded-sm mb-4 w-full duration-500 ease-in-out flex justify-center gap-4"
					>
						<img
							style={{
								width: "20px"
							}}
							src="https://raw.githubusercontent.com/firebase/firebaseui-web/master/image/google.svg"
						/>
						Login with Google
					</button>

					<button
						onClick={signInWithTwitter}
						className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-sm w-full duration-500 ease-in-out mb-4 flex justify-center gap-4"
					>
						<img
							style={{
								width: "20px"
							}}
							src="https://raw.githubusercontent.com/firebase/firebaseui-web/master/image/twitter.svg"
						/>
						Login with Twitter
					</button>

					<button
						onClick={signInWithGithub}
						className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-sm w-full duration-500 ease-in-out flex justify-center gap-4"
					>
						<img
							style={{
								width: "20px"
							}}
							src="https://raw.githubusercontent.com/firebase/firebaseui-web/master/image/github.svg"
						/>
						Login with Github
					</button>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Providers;
