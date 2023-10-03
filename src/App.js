import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LogoutPath from "./auth/logout";
import Providers from "./auth/Providers";
import PageNotFound from "./components/404";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Home from "./components/Home";
import Products from "./components/Product";
import Search from "./components/Search";
import AddReview from "./components/subcomponents/AddReview";
import RenderProductDescription from "./components/subcomponents/productPage";

function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/products" element={<Products />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/login" element={<Providers />} />
				<Route path="/logout" element={<LogoutPath />} />
				<Route
					path="product/:uid"
					element={<RenderProductDescription />}
				/>
				<Route
					path="/product/review/:uid"
					element={<AddReview />}
				/>
				<Route path="*" element={<PageNotFound />} />
			</Routes>{" "}
			<Search />
		</Router>
	);
}

export default App;
