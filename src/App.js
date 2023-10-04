import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LogoutPath from "./auth/logout";
import PageNotFound from "./components/404";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Products from "./components/Product";
import Search from "./components/Search";
import AddReview from "./components/subcomponents/AddReview";
import RenderProductDescription from "./components/subcomponents/productPage";
import LoginUser from "./auth/login";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/products" element={<Products />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/login" element={<LoginUser />} />
				<Route path="/logout" element={<LogoutPath />} />
				<Route
					path="product/:uid"
					element={<RenderProductDescription />}
				/>
				<Route path="/product/review/:uid" element={<AddReview />} />
				<Route path="*" element={<PageNotFound />} />
			</Routes>{" "}
			<Search />
		</Router>
	);
}

export default App;
