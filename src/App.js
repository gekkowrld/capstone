import './App.css';
import PageNotFound from './components/404';
import { Footer } from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom';

function App() {
  return (
	<Router>
		<Header/>
		<Routes>
			<Route path="/" element={<Home/>}/>
			<Route path="*" element={<PageNotFound />} />
		</Routes>
		<Footer/>
	</Router>
  );
}

export default App;
