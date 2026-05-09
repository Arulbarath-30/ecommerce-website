import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Footer from './components/Footer';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white selection:bg-tnGreen selection:text-white flex flex-col">
          {/* Navbar fixed-ah irukkuradhala, adhu mela dhaan irukkum */}
          <Navbar />

          {/* MAIN CONTENT AREA - Inga thaan padding top (pt-24) add panni irukkaen */}
          <main className="flex-grow pt-20 md:pt-28">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;