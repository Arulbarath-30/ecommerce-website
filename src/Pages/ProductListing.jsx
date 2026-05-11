import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// --- DATA LAYER (Optimized with automated modern WebP compression for max Performance) ---
export const products = [
  { id: 1, name: "Terabyte Watch Ultra", price: 65999, category: "Wearables", img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=60&w=500", tag: "Limited", spec: "Grade-5 Titanium Build" },
  { id: 2, name: "Terabyte Studio Pro", price: 28900, category: "Audio", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=60&w=1000", tag: "Best Seller", spec: "Lossless Audio 2.0" },
  { id: 3, name: "Terabyte Phone 15 Pro", price: 144900, category: "Mobile", img: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=60&w=1000", tag: "New", spec: "A17 Pro Silicon" },
  { id: 4, name: "Terabyte Vision Glass", price: 299000, category: "Vision", img: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=60&w=1000", tag: "Elite", spec: "Spatial Computing Ready" },
  { id: 5, name: "Terabyte Aero Pods", price: 49900, category: "Audio", img: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=60&w=1000", tag: "Trending", spec: "Active Noise Cancellation" },
  { id: 6, name: "Terabyte MagSafe Hub", price: 14900, category: "Power", img: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&q=60&w=1000", tag: "Essential", spec: "15W Fast Wireless" },
  { id: 7, name: "Terabyte Keyboard Pro", price: 12900, category: "Work", img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=60&w=1000", tag: "Mechanical", spec: "Silver Switches" },
  { id: 8, name: "Terabyte Mouse Pad", price: 4500, category: "Work", img: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&q=60&w=1000", tag: "Minimal", spec: "Waterproof Micro-texture" },
  { id: 9, name: "Terabyte Laptop Stand", price: 8900, category: "Work", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=60&w=1000", tag: "Ergonomic", spec: "Brushed Aluminum" }
];

const ProductListing = () => {
  const { addToCart, cart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  
  const [showPopup, setShowPopup] = useState(false);
  const [lastAdded, setLastAdded] = useState("");
  const [addedStatus, setAddedStatus] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const playPremiumBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (err) {}
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    playPremiumBeep();
    addToCart(product);
    setLastAdded(product.name);
    setShowPopup(true);
    setAddedStatus(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedStatus(prev => ({ ...prev, [product.id]: false }));
    }, 2500);
    setTimeout(() => setShowPopup(false), 3500);
  };

  let processedProducts = products.filter(p => 
    (activeCategory === "All" || p.category === activeCategory) && 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortBy === "price-asc") {
    processedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    processedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="bg-[#F9F6F0] min-h-screen text-[#1A1A1A] font-sans antialiased selection:bg-[#D4AF37] selection:text-white pb-32">
      
      {/* --- RESPONSIVE TOAST NOTIFICATION --- */}
      {showPopup && (
        <div 
          role="alert"
          className="fixed bottom-6 md:bottom-10 left-4 right-4 md:left-auto md:right-10 z-[5000] 
                     bg-[#1A1A1A] text-[#F9F6F0] p-4 md:p-5 rounded-[20px] md:rounded-[25px] 
                     shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-between gap-6 
                     border border-white/10 transition-all duration-300 animate-slideUp"
        >
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-8 h-8 md:w-10 md:h-10 bg-[#D4AF37] rounded-full flex-shrink-0 flex items-center justify-center font-black text-black text-xs md:text-base">✓</div>
             <div className="overflow-hidden">
                <p className="text-[7px] md:text-[8px] font-black tracking-[0.3em] text-[#D4AF37] uppercase">Artifact Secured</p>
                <p className="text-xs md:text-sm font-black uppercase tracking-tight truncate max-w-[140px] md:max-w-[220px]">{lastAdded}</p>
             </div>
          </div>
          <Link to="/cart" className="bg-white text-black px-5 py-2.5 rounded-full text-[9px] font-black tracking-widest uppercase hover:bg-[#D4AF37] transition-all whitespace-nowrap shadow-sm">
            View Bag →
          </Link>
        </div>
      )}

      {/* --- CINEMATIC HEADER SECTION --- */}
      <header className="bg-[#1A1A1A] text-[#F9F6F0] pt-24 md:pt-36 pb-16 md:pb-24 px-6 border-b border-white/10 relative overflow-hidden rounded-b-[40px] md:rounded-b-[60px] shadow-2xl">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-3 max-w-xl text-left">
            <p className="text-[#D4AF37] text-[9px] md:text-[10px] font-black tracking-[0.6em] uppercase italic">Lossless Architecture</p>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-none">
              Catalogue<span className="text-[#D4AF37] not-italic">.</span>
            </h1>
            <p className="text-gray-300 text-xs md:text-sm font-medium tracking-wide leading-relaxed pt-2">
              Browse tier-1 precision electronics. Filtered through aerospace industrial standards.
            </p>
          </div>

          <div className="flex gap-6 border-t border-white/10 md:border-t-0 pt-6 md:pt-0 w-full md:w-auto justify-start md:justify-end">
            <div className="border-l border-white/10 pl-4 text-left">
               <p className="text-[8px] font-black tracking-[0.3em] uppercase text-[#D4AF37]">Inventory Status</p>
               <p className="text-xl font-black uppercase tracking-tight">{products.length} Nodes</p>
            </div>
            <div className="border-l border-white/10 pl-4 text-left">
               <p className="text-[8px] font-black tracking-[0.3em] uppercase text-[#D4AF37]">Security</p>
               <p className="text-xl font-black uppercase tracking-tight">Zero-Trust</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-10 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none"></div>
      </header>

      {/* --- ADVANCED STICKY SEARCH & CONTROL DASHBOARD --- */}
      <section className="sticky top-4 z-[2000] max-w-7xl mx-auto px-4 md:px-6 my-8" aria-label="Catalog Filtering Controls">
        <div className="bg-white/85 backdrop-blur-2xl border border-gray-100 rounded-[25px] md:rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] p-3 md:p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          
          <div className="flex gap-1 overflow-x-auto no-scrollbar w-full lg:w-auto px-2 py-1" role="group" aria-label="Filter by Product Category">
            {["All", "Wearables", "Audio", "Mobile", "Vision", "Work"].map(c => (
              <button 
                key={c} 
                aria-pressed={activeCategory === c}
                onClick={() => setActiveCategory(c)} 
                className={`whitespace-nowrap px-5 py-2.5 md:px-7 md:py-3 rounded-full text-[8px] md:text-[9px] font-black tracking-widest uppercase transition-all ${
                  activeCategory === c ? 'bg-[#1A1A1A] text-white shadow-md scale-105' : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex-1 w-full flex items-center px-4 lg:px-6 bg-gray-50/50 rounded-full border border-gray-100 py-1 focus-within:border-black transition-all">
             <span className="mr-3 opacity-30 text-xs" aria-hidden="true">🔍</span>
             <label htmlFor="search-artifacts" className="sr-only">Search complete catalogue</label>
             <input 
               id="search-artifacts"
               type="text" 
               value={searchQuery} 
               placeholder="SEARCH INVENTORY..." 
               className="bg-transparent w-full text-[9px] md:text-[10px] font-black tracking-widest outline-none uppercase text-black placeholder:text-gray-500 py-2" 
               onChange={(e) => setSearchQuery(e.target.value)} 
             />
             {searchQuery && (
               <button onClick={() => setSearchQuery("")} aria-label="Clear active search" className="text-[10px] font-bold text-gray-500 hover:text-black px-2">✕</button>
             )}
          </div>

          <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3 px-2 lg:border-l border-gray-100 pl-4">
             <label htmlFor="sort-dropdown" className="text-[8px] font-black tracking-widest text-gray-500 uppercase hidden sm:inline">Sort:</label>
             <select 
               id="sort-dropdown"
               value={sortBy} 
               onChange={(e) => setSortBy(e.target.value)}
               className="bg-transparent text-[9px] font-black tracking-widest uppercase text-black outline-none cursor-pointer py-2 pr-4 border-none"
             >
                <option value="default">Standard Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
             </select>
          </div>

        </div>
      </section>

      {/* --- INVENTORY GRID SHOWCASE --- */}
      <main className="max-w-7xl mx-auto px-6 pt-6 md:pt-12" aria-label="Product Catalogue Grid">
        {processedProducts.length === 0 ? (
          <div className="py-32 text-center space-y-6 bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm max-w-lg mx-auto mt-10">
            <div className="text-5xl grayscale opacity-20" aria-hidden="true">🎛️</div>
            <p className="text-gray-500 text-xs font-black tracking-widest uppercase leading-relaxed" role="status">
              Zero results matching current telemetry parameters.
            </p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); setSortBy("default"); }} 
              className="bg-black text-white px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-md"
            >
              Reset All Telemetry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 lg:gap-20">
            {processedProducts.map(p => (
              <div key={p.id} className="group relative flex flex-col animate-slideUp">
                
                <div className="relative aspect-[4/5] w-full bg-white rounded-[40px] md:rounded-[50px] overflow-hidden shadow-sm border border-gray-50 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col justify-between">
                  
                  <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 flex items-center gap-2">
                      <span className="bg-[#1A1A1A] text-[#D4AF37] px-4 py-2 rounded-full text-[7px] md:text-[8px] font-black tracking-widest uppercase shadow-md">{p.tag}</span>
                  </div>

                  <Link to={`/product/${p.id}`} aria-label={`View full details of ${p.name}`} className="w-full h-full p-12 md:p-16 flex items-center justify-center my-auto">
                    <img 
                      src={p.img} 
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out p-4" 
                      alt="" 
                    />
                  </Link>
                  
                  <div className="absolute inset-x-5 bottom-5 z-20">
                     <button 
                      onClick={(e) => handleAddToCart(e, p)} 
                      disabled={addedStatus[p.id]} 
                      aria-label={`Add ${p.name} to custom order bag`}
                      className={`w-full py-4 rounded-full text-[9px] font-black tracking-widest uppercase transition-all duration-300 shadow-lg ${
                        addedStatus[p.id] 
                          ? 'bg-green-500 text-white scale-100' 
                          : 'bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:text-black active:scale-95'
                      }`}
                     >
                      {addedStatus[p.id] ? '✓ Secured In Bag' : 'Add To Bag +'}
                     </button>
                  </div>

                </div>

                <div className="mt-6 px-2 text-left space-y-1 md:space-y-2">
                   <p className="text-[8px] font-black text-gray-500 tracking-[0.3em] uppercase">{p.spec}</p>
                   <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase truncate text-black">{p.name}</h2>
                   <p className="text-lg md:text-xl font-black text-[#D4AF37]">
                     ₹{p.price.toLocaleString('en-IN')}
                   </p>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- RETAIL DISPATCH BANNER --- */}
      <section className="max-w-7xl mx-auto px-6 mt-32" aria-labelledby="custom-build-heading">
        <div className="bg-white rounded-[30px] md:rounded-[50px] p-10 md:p-16 border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-8 text-left shadow-sm">
           <div className="space-y-2 max-w-md">
              <p className="text-[8px] font-black tracking-[0.4em] text-[#D4AF37] uppercase">Priority Air Dispatch</p>
              <h2 id="custom-build-heading" className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-black">Need custom build integrations?</h2>
           </div>
           <Link to="/contact" className="bg-[#1A1A1A] text-white px-8 py-5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all whitespace-nowrap shadow-md">
             Contact Node Hub
           </Link>
        </div>
      </section>

    </div>
  );
};

export default ProductListing;