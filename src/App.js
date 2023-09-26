import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Providers from "./auth/Providers";
import PageNotFound from "./components/404";
import Home from "./components/Home";
import Products from "./components/Product";
import Header from "./components/Header";
import LogoutPath from "./auth/logout";
import Dashboard from "./components/Dashboard";
import RenderProductDescription from "./components/subcomponents/productPage";
import Search from "./components/Search";

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
				<Route path="*" element={<PageNotFound />} />
			</Routes>{" "}
			<Search />
		</Router>
	);
}

export default App;
