import DymanicMeta from "./DynamicMeta";

const PageNotFound = () => {
	const currentUrl = window.location.pathname;
	let msg = "Oops! Page Not Found";
	return (
		<div className="flex items-center justify-center flex-col">
			<DymanicMeta
				title={msg}
				description="Due to unknown reasons, page could not be found"
			/>
			<p className="text-gray-600">{currentUrl}</p>
			<div className="bg-white p-8 rounded-lg shadow-md flex items-center flex-col">
				<h1 className="text-4xl font-semibold text-gray-800">{msg}</h1>
				<p className="text-gray-600 mt-2 flex-wrap max-w-lg">
					Looks like you went to the wrong isle
				</p>
				<a
					href="/"
					className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
				>
					Back to Home
				</a>
			</div>
		</div>
	);
};

export default PageNotFound;
