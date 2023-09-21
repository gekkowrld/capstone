import "./App.css";
import PageNotFound from "./components/404";
import { Footer } from "./components/Footer";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "./components/Product";
import Providers from "./auth/Providers";
import Header from "./components/Header";
import LogoutPath from "./auth/logout";
import Dashboard from "./components/Dashboard";

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
				<Route path="*" element={<PageNotFound />} />
			</Routes>
			<Footer />
		</Router>
	);
}

export default App;
