import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductListing = () => {
  const { addToCart } = useCart();
  
  const [selectedCats, setSelectedCats] = useState([]);
  const [maxPrice, setMaxPrice] = useState(250000);
  const [minRating, setMinRating] = useState(0);
  const [filteredItems, setFilteredItems] = useState(products);

  const [showPopup, setShowPopup] = useState(false);
  const [addedItemName, setAddedItemName] = useState("");

  useEffect(() => {
    const result = products.filter(p => {
      const catMatch = selectedCats.length === 0 || selectedCats.includes(p.category);
      const priceMatch = p.price <= maxPrice;
      const ratingMatch = (p.rating || 4) >= minRating; 
      return catMatch && priceMatch && ratingMatch;
    });
    setFilteredItems(result);
  }, [selectedCats, maxPrice, minRating]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItemName(product.name);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const toggleCat = (cat) => {
    setSelectedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    /* FIXED: Added pt-40 for mobile and pt-48 for desktop to clear fixed Navbar */
   // ProductListing.jsx
<div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-32 flex flex-col lg:flex-row gap-16 bg-white overflow-hidden">
      
      {/* --- NOTIFICATION POPUP --- */}
      <div className={`fixed bottom-8 right-8 md:bottom-12 md:right-12 z-[500] transition-all duration-500 ease-in-out transform ${showPopup ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'}`}>
        <div className="bg-black text-white px-6 py-5 md:px-8 md:py-6 rounded-[24px] md:rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center gap-4 md:gap-6 min-w-[300px] md:min-w-[380px] border border-white/5">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg md:text-xl font-bold">✓</span>
          </div>
          <div className="flex-1">
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-0.5">Item Added</p>
            <h4 className="text-xs md:text-sm font-black uppercase tracking-wider italic truncate max-w-[150px]">{addedItemName}</h4>
          </div>
          <Link to="/cart" className="bg-[#1A1A1A] hover:bg-[#D4AF37] hover:text-black transition-all text-[8px] md:text-[9px] font-black uppercase tracking-widest px-4 py-2 md:px-6 md:py-3 rounded-full border border-white/10">
            View
          </Link>
        </div>
      </div>

      {/* --- SIDEBAR FILTER --- */}
      {/* FIXED: Added z-10 and ensured it stays below Navbar's z-index */}
      <aside className="w-full lg:w-64 space-y-12 h-fit lg:sticky lg:top-40 z-10">
        <div className="text-black">
          <h4 className="font-black mb-8 uppercase tracking-[0.4em] text-[10px] border-b border-gray-100 pb-4">Filter by Category</h4>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-0">
            {['Audio', 'Wearables', 'Mobile', 'Vision', 'Work'].map(c => (
              <label key={c} className="flex items-center gap-4 mb-5 text-gray-400 hover:text-black cursor-pointer transition-all group">
                <input type="checkbox" checked={selectedCats.includes(c)} onChange={() => toggleCat(c)} className="accent-black w-4 h-4" /> 
                <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] ${selectedCats.includes(c) ? 'text-black' : ''}`}>{c}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-10 border-t border-gray-50 text-black">
          <div className="flex justify-between items-end mb-6">
            <h4 className="font-black uppercase tracking-[0.4em] text-[10px]">Price Limit</h4>
            <span className="text-[10px] font-black text-[#D4AF37]">₹{Number(maxPrice).toLocaleString('en-IN')}</span>
          </div>
          <input type="range" min="0" max="250000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full accent-black cursor-pointer h-1 bg-gray-100 rounded-lg appearance-none" />
        </div>
      </aside>

      {/* --- PRODUCT GRID --- */}
      <div className="flex-1 z-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 border-b border-gray-50 pb-8 text-black gap-4">
           <p className="text-[9px] md:text-[10px] font-black tracking-[0.5em] text-gray-300 uppercase italic">Terabyte Store / {filteredItems.length} Products</p>
           <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase">Our Collection</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 text-black">
          {filteredItems.map(product => (
             <div key={product.id} className="group relative">
                <div className="aspect-square bg-[#F9F9F9] rounded-[30px] md:rounded-[40px] mb-6 md:mb-8 overflow-hidden p-8 md:p-12 flex items-center justify-center relative border border-gray-50 transition-all duration-700 group-hover:shadow-2xl">
                    <img src={product.image || product.img} className="max-w-[80%] max-h-[80%] object-contain group-hover:scale-110 transition-transform duration-[1.5s]" alt={product.name} />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3 p-6 backdrop-blur-[2px]">
                        <button onClick={() => handleAddToCart(product)} className="w-full bg-black text-white py-4 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all transform translate-y-4 group-hover:translate-y-0">
                          Add to Cart
                        </button>
                        <Link to={`/product/${product.id}`} className="w-full bg-white text-black py-4 rounded-full text-[9px] font-black uppercase tracking-widest text-center border border-black hover:bg-black hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0">
                          View Details
                        </Link>
                    </div>
                </div>
                
                <div className="px-2 md:px-4 flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <h4 className="font-black text-lg md:text-xl tracking-tighter uppercase italic leading-none truncate">{product.name}</h4>
                    <p className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase tracking-widest mt-2 italic">Official Unit</p>
                  </div>
                  <span className="font-light text-lg md:text-xl italic text-[#AF8F2C]">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
             </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[10px] font-black uppercase tracking-[1em] text-gray-200 animate-pulse">No Artifacts Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing;