import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Providers from "./auth/Providers";
import PageNotFound from "./components/404";
import { Footer } from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import Products from "./components/Product";

function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/products" element={<Products />} />
				<Route path="/login" element={<Providers />} />
				<Route path="*" element={<PageNotFound />} />
			</Routes>{" "}
			<Footer />
		</Router>
	);
}

export default App;
