import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// --- DATA LAYER (Unchanged as requested) ---
export const products = [
  { id: 1, name: "Terabyte Watch Ultra", price: 65999, category: "Wearables", img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500", tag: "Limited", spec: "Grade-5 Titanium Build" },
  { id: 2, name: "Terabyte Studio Pro", price: 28900, category: "Audio", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000", tag: "Best Seller", spec: "Lossless Audio 2.0" },
  { id: 3, name: "Terabyte Phone 15 Pro", price: 144900, category: "Mobile", img: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000", tag: "New", spec: "A17 Pro Silicon" },
  { id: 4, name: "Terabyte Vision Glass", price: 299000, category: "Vision", img: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1000", tag: "Elite", spec: "Spatial Computing Ready" },
  { id: 5, name: "Terabyte Aero Pods", price: 49900, category: "Audio", img: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=1000", tag: "Trending", spec: "Active Noise Cancellation" },
  { id: 6, name: "Terabyte MagSafe Hub", price: 14900, category: "Power", img: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=1000", tag: "Essential", spec: "15W Fast Wireless" },
  { id: 7, name: "Terabyte Keyboard Pro", price: 12900, category: "Work", img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000", tag: "Mechanical", spec: "Silver Switches" },
  { id: 8, name: "Terabyte Mouse Pad", price: 4500, category: "Work", img: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?q=80&w=1000", tag: "Minimal", spec: "Waterproof Micro-texture" },
  { id: 9, name: "Terabyte Laptop Stand", price: 8900, category: "Work", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000", tag: "Ergonomic", spec: "Brushed Aluminum" }
];

const Home = () => {
  const { addToCart, cart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [lastAdded, setLastAdded] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [addedStatus, setAddedStatus] = useState({});
  const catalogueRef = useRef(null);

  const slides = [
    { title: "TERABYTE ELITE", sub: "THE FUTURE OF TECHNOLOGY", img: "https://plus.unsplash.com/premium_photo-1712764121254-d9867c694b81?w=1200" },
    { title: "PRECISION DESIGN", sub: "AEROSPACE GRADE HARDWARE", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200" },
    { title: "STUDIO SOUND", sub: "PURE AUDIO EXPERIENCE", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200" }
  ];

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    const sliderTimer = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5500);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(sliderTimer);
    };
  }, [slides.length]);

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

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    if (catalogueRef.current) {
      const yOffset = -120;
      const y = catalogueRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const filtered = products.filter(p => 
    (activeCategory === "All" || p.category === activeCategory) && 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F9F6F0] min-h-screen text-[#1A1A1A] font-sans antialiased overflow-x-hidden selection:bg-[#D4AF37] selection:text-white">
      
      {/* 1. ADVANCED RESPONSIVE TOAST POPUP */}
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
                <p className="text-[7px] md:text-[8px] font-black tracking-[0.3em] text-[#D4AF37] uppercase">Inventory Updated</p>
                <p className="text-xs md:text-sm font-black uppercase tracking-tight truncate max-w-[140px] md:max-w-[220px]">{lastAdded}</p>
             </div>
          </div>
          <Link to="/cart" className="bg-white text-black px-5 py-2.5 rounded-full text-[9px] font-black tracking-widest uppercase hover:bg-[#D4AF37] transition-all whitespace-nowrap shadow-sm">
            Checkout →
          </Link>
        </div>
      )}

      {/* 2. HERO SLIDER */}
      <section className="relative h-[80vh] md:h-screen bg-black overflow-hidden" aria-label="Featured Products Slider">
        {slides.map((slide, i) => (
          <div key={i} className={`absolute inset-0 transition-all duration-[1.5s] ease-in-out ${i === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`} aria-hidden={i !== currentSlide}>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
            <img src={slide.img} className="w-full h-full object-cover opacity-70" alt={slide.title} />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4">
              <p className="text-[9px] md:text-[11px] font-black tracking-[0.8em] md:tracking-[1.2em] text-[#D4AF37] mb-6 uppercase">{slide.sub}</p>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-white uppercase italic">
                {slide.title}<span className="text-[#D4AF37] not-italic">.</span>
              </h1>
              <div className="pt-10 md:pt-16 flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-[280px] sm:max-w-none justify-center">
                <button onClick={() => catalogueRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-black px-8 py-4 md:px-12 md:py-5 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase hover:bg-[#D4AF37] transition-all active:scale-95 shadow-xl">Shop Inventory</button>
                <button className="border border-white/30 text-white px-8 py-4 md:px-12 md:py-5 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all">Watch Film</button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4 z-30">
          {slides.map((_, i) => (
            <button 
              key={i} 
              aria-label={`Go to slide ${i + 1}`} 
              aria-current={i === currentSlide}
              onClick={() => setCurrentSlide(i)} 
              className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-10 md:w-16 bg-[#D4AF37]' : 'w-3 md:w-6 bg-white/30'}`} 
            />
          ))}
        </div>
      </section>

      {/* 3. BRAND STATS */}
      <section className="py-12 md:py-20 bg-white border-b border-gray-100 shadow-sm relative z-20" aria-label="Brand Core Values">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {[{ l: "Engineering", v: "Terabyte Core" }, { l: "Delivery", v: "Priority Air" }, { l: "Warranty", v: "1 Year Shield" }, { l: "Support", v: "24/7 Concierge" }].map((item, i) => (
            <div key={i} className="space-y-1 md:space-y-2 border-l-2 border-[#F9F6F0] pl-4 md:pl-8">
              <p className="text-[8px] md:text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">{item.l}</p>
              <p className="text-sm md:text-xl font-black tracking-tight uppercase truncate text-[#1A1A1A]">{item.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ADVANCED STICKY NAV (Search & Sync Filters) */}
      <nav className={`sticky top-4 z-[2000] px-4 md:px-6 my-4 transition-all duration-500 ${isScrolled ? 'translate-y-0 shadow-2xl' : 'translate-y-0'}`} aria-label="Product Filtering Navigation">
        <div className="max-w-6xl mx-auto bg-white/85 backdrop-blur-2xl border border-gray-100 rounded-[25px] md:rounded-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-2 md:p-3 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6">
          <div className="flex gap-1 overflow-x-auto no-scrollbar w-full lg:w-auto px-2 py-1" role="group" aria-label="Filter by Category">
            {["All", "Wearables", "Audio", "Mobile", "Vision", "Work"].map(c => (
              <button 
                key={c} 
                aria-pressed={activeCategory === c}
                onClick={() => handleCategorySelect(c)} 
                className={`whitespace-nowrap px-5 py-2 md:px-7 md:py-3 rounded-full text-[8px] md:text-[9px] font-black tracking-widest uppercase transition-all ${activeCategory === c ? 'bg-[#1A1A1A] text-white shadow-md scale-105' : 'text-gray-600 hover:text-black'}`}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className={`flex-1 w-full flex items-center px-4 lg:px-8 lg:border-l border-gray-100 rounded-full transition-all ${searchQuery ? 'bg-gray-50 ring-1 ring-black/5 py-1' : ''}`}>
             <span className="mr-3 opacity-30 text-xs" aria-hidden="true">🔍</span>
             <label htmlFor="search-input" className="sr-only">Search Artifacts</label>
             <input 
               id="search-input"
               type="text" 
               value={searchQuery} 
               placeholder="SEARCH ARTIFACTS..." 
               className="bg-transparent w-full text-[9px] md:text-[10px] font-black tracking-widest outline-none uppercase text-black placeholder:text-gray-500" 
               onChange={(e) => setSearchQuery(e.target.value)} 
             />
             {searchQuery && (
               <button 
                 onClick={() => setSearchQuery("")} 
                 aria-label="Clear search query"
                 className="text-[10px] font-bold text-gray-500 hover:text-black px-2"
               >
                 ✕
               </button>
             )}
          </div>

          <div className="hidden lg:flex items-center gap-6 pr-6">
             <Link to="/cart" aria-label={`View Cart with ${cart?.length || 0} items`} className="text-[10px] font-black tracking-widest uppercase flex items-center gap-2 text-black hover:text-[#D4AF37] transition-colors">
               BAG <span className="bg-[#D4AF37] text-black w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black shadow-sm">{cart?.length || 0}</span>
             </Link>
          </div>
        </div>
      </nav>

      {/* 5. PRODUCT CATALOGUE */}
      <section ref={catalogueRef} className="max-w-7xl mx-auto px-6 py-16 md:py-32 scroll-mt-32" aria-labelledby="catalog-title">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-6 px-2 border-b border-gray-100 pb-8">
          <div className="space-y-2 text-left">
             <p className="text-[9px] md:text-[10px] font-black text-[#D4AF37] tracking-[0.5em] uppercase italic">System Inventory</p>
             <h2 id="catalog-title" className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic text-black">Featured Artifacts</h2>
          </div>
          <p className="text-gray-500 font-bold max-w-xs text-left md:text-right text-[10px] md:text-xs uppercase tracking-widest leading-relaxed">
            {activeCategory === "All" ? "Displaying Complete Catalogue" : `Filtered by: ${activeCategory}`} ({filtered.length} items)
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-gray-500 text-xs font-black tracking-widest uppercase" role="status">No artifacts match your parameters.</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="bg-black text-white px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 lg:gap-20">
            {filtered.map(p => (
              <div key={p.id} className="group relative flex flex-col">
                <div className="relative aspect-[4/5] w-full bg-white rounded-[40px] md:rounded-[50px] overflow-hidden shadow-sm border border-gray-50 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-2 flex flex-col justify-between">
                  
                  <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 flex items-center gap-2">
                      <span className="bg-[#1A1A1A] text-[#D4AF37] px-4 py-2 rounded-full text-[7px] md:text-[8px] font-black tracking-widest uppercase shadow-md">{p.tag}</span>
                  </div>

                  <Link to={`/product/${p.id}`} className="w-full h-full p-12 md:p-16 flex items-center justify-center my-auto" aria-label={`View details for ${p.name}`}>
                    <img src={p.img} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out p-4" alt="" />
                  </Link>
                  
                  <div className="absolute inset-x-5 bottom-5 z-20">
                     <button 
                      onClick={(e) => handleAddToCart(e, p)} 
                      disabled={addedStatus[p.id]} 
                      aria-label={`Add ${p.name} to bag`}
                      className={`w-full py-4 rounded-full text-[9px] font-black tracking-widest uppercase transition-all duration-300 shadow-lg ${
                        addedStatus[p.id] 
                          ? 'bg-green-500 text-white scale-100' 
                          : 'bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:text-black active:scale-95'
                      }`}
                     >
                      {addedStatus[p.id] ? '✓ Added To Bag' : 'Add To Bag +'}
                     </button>
                  </div>

                </div>

                <div className="mt-6 px-2 text-left space-y-1 md:space-y-2">
                   <p className="text-[8px] font-black text-gray-500 tracking-[0.3em] uppercase">{p.spec}</p>
                   <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase truncate text-black">{p.name}</h3>
                   <p className="text-lg md:text-xl font-black text-[#D4AF37]">₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. HERITAGE / STATS */}
      <section className="mx-4 md:mx-6 py-20 md:py-32 bg-[#1A1A1A] rounded-[30px] md:rounded-[60px] text-[#F9F6F0] overflow-hidden shadow-2xl" aria-labelledby="infrastructure-title">
         <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8 md:space-y-10 text-left">
               <span className="text-[#D4AF37] text-[9px] font-black tracking-[0.6em] uppercase italic">Terabyte Systems</span>
               <h2 id="infrastructure-title" className="text-4xl md:text-6xl font-black tracking-tighter leading-tight italic uppercase">Engineered for <br className="hidden md:block"/> Supremacy.</h2>
               <p className="text-gray-300 text-xs md:text-base leading-relaxed max-w-md font-medium">Precision industrial manufacturing aligned with lossless processing architectures. Every product delivers uncompromised standard.</p>
               <div className="pt-2">
                  <button className="border-b-2 border-[#D4AF37] text-[#D4AF37] pb-1 text-[9px] font-black tracking-widest uppercase hover:text-white transition-all">Explore Infrastructure</button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
               {[{t:"50k+", l:"Active Nodes"}, {t:"99.9%", l:"Precision"}, {t:"M17", l:"Architecture"}, {t:"2026", l:"Deployment"}].map((s,i)=>(
                 <div key={i} className={`aspect-square rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-4 text-center transition-transform hover:scale-105 ${i===3 ? 'bg-[#D4AF37] text-black shadow-xl' : 'bg-white/5 border border-white/5 backdrop-blur-sm'}`}>
                   <p className="text-2xl md:text-4xl font-black italic">{s.t}</p>
                   <p className="text-[7px] md:text-[8px] font-black tracking-[0.2em] uppercase opacity-80 mt-1">{s.l}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. PERFORMANCE BAR SHOWCASE */}
      <section className="py-20 md:py-32 bg-white" aria-labelledby="metrics-title">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
           <div className="text-center mb-16 md:mb-24">
              <h2 id="metrics-title" className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic mb-2 text-black">Operational Metrics</h2>
              <p className="text-[#D4AF37] text-[8px] tracking-[0.4em] uppercase font-black">Industrial Load Output</p>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8 md:space-y-10 order-2 lg:order-1 text-left">
                  {[{ t: "Spatial Logic", p: "98%" }, { t: "Acoustic Fidelity", p: "96%" }, { t: "Silicon Speed", p: "100%" }].map((spec, i) => (
                    <div key={i} className="group">
                       <div className="flex justify-between items-end mb-2">
                          <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-black">{spec.t}</h3>
                          <span className="text-[#D4AF37] font-black text-xs tracking-widest">{spec.p}</span>
                       </div>
                       <div className="h-[3px] w-full bg-gray-100 overflow-hidden rounded-full border border-gray-200">
                          <div className="h-full bg-[#1A1A1A] group-hover:bg-[#D4AF37] transition-all duration-1000 ease-out rounded-full" style={{ width: spec.p }}></div>
                       </div>
                    </div>
                  ))}
              </div>
              <div className="rounded-[30px] md:rounded-[50px] overflow-hidden shadow-xl h-[280px] md:h-[400px] order-1 lg:order-2 bg-[#F9F6F0]">
                  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000" className="w-full h-full object-cover grayscale contrast-125 brightness-90 mix-blend-multiply p-2" alt="Infrastructure performance telemetry graphic" />
              </div>
           </div>
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="py-20 md:py-32 bg-[#F9F6F0] relative overflow-hidden px-6 border-t border-b border-gray-100" aria-labelledby="newsletter-title">
         <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
            <div className="w-12 h-[3px] bg-[#D4AF37] mx-auto"></div>
            <h2 id="newsletter-title" className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-black">Initialize Access.</h2>
            <p className="text-gray-600 text-xs md:text-sm font-bold tracking-widest max-w-lg mx-auto uppercase">Secure privileged bandwidth for tier-1 prototype dispatches.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 justify-center pt-4 w-full max-w-md mx-auto">
               <label htmlFor="comm-id-input" className="sr-only">Communication Email ID</label>
               <input 
                 id="comm-id-input"
                 type="email" 
                 required
                 placeholder="COMMUNICATION ID" 
                 className="bg-white border border-gray-200 px-6 py-4 rounded-full text-[9px] font-black tracking-widest outline-none focus:border-[#D4AF37] flex-1 text-black placeholder:text-gray-400 shadow-sm uppercase" 
               />
               <button 
                 type="submit"
                 aria-label="Transmit communication identifier"
                 className="bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-[9px] font-black tracking-[0.3em] uppercase hover:bg-[#D4AF37] hover:text-black transition-all shadow-md"
               >
                 Transmit
               </button>
            </form>
         </div>
         <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none"></div>
      </section>
    </div>
  );
};

export default Home;