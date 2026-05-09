import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// --- DATA LAYER ---
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

  const catalogueRef = useRef(null);

  const slides = [
    { title: "TERABYTE ELITE", sub: "THE FUTURE OF TECHNOLOGY", img: "https://plus.unsplash.com/premium_photo-1712764121254-d9867c694b81?w=1200" },
    { title: "PRECISION DESIGN", sub: "AEROSPACE GRADE HARDWARE", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200" },
    { title: "STUDIO SOUND", sub: "PURE AUDIO EXPERIENCE", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200" }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    const sliderTimer = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5000);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(sliderTimer);
    };
  }, [slides.length]);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product);
    setLastAdded(product.name);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const filtered = products.filter(p => 
    (activeCategory === "All" || p.category === activeCategory) && 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F9F6F0] min-h-screen text-[#1A1A1A] font-sans antialiased overflow-x-hidden selection:bg-[#D4AF37] selection:text-white">
      
      {/* 1. RESPONSIVE TOAST POPUP */}
      {showPopup && (
        <div className="fixed bottom-6 md:bottom-10 left-4 right-4 md:left-auto md:right-10 z-[300] 
                        bg-black text-[#F9F6F0] p-4 md:p-6 rounded-[25px] md:rounded-[30px] 
                        shadow-2xl flex items-center justify-between gap-4 border border-white/10 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center font-black text-white text-xs md:text-base">✓</div>
             <div className="overflow-hidden">
                <p className="text-[8px] md:text-[9px] font-black tracking-widest text-green-500 uppercase">Item Added</p>
                <p className="text-xs md:text-sm font-bold uppercase truncate max-w-[120px] md:max-w-[200px]">{lastAdded}</p>
             </div>
          </div>
          <Link to="/cart" className="bg-[#D4AF37] text-black px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase whitespace-nowrap">View Cart</Link>
        </div>
      )}

      {/* 2. HERO SLIDER */}
      <section className="relative h-[80vh] md:h-screen bg-black overflow-hidden">
        {slides.map((slide, i) => (
          <div key={i} className={`absolute inset-0 transition-all duration-[1.5s] ease-in-out ${i === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10"></div>
            <img src={slide.img} className="w-full h-full object-cover opacity-60" alt="" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4">
              <p className="text-[9px] md:text-[11px] font-black tracking-[0.6em] md:tracking-[1.2em] text-[#D4AF37] mb-6 md:mb-8 uppercase">{slide.sub}</p>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-white uppercase italic">
                {slide.title}<span className="text-[#D4AF37] not-italic">.</span>
              </h1>
              <div className="pt-10 md:pt-16 flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-[280px] sm:max-w-none justify-center">
                <button onClick={() => catalogueRef.current.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-black px-8 py-4 md:px-12 md:py-5 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase hover:bg-[#D4AF37] transition-all active:scale-95">Shop Now</button>
                <button className="border border-white/30 text-white px-8 py-4 md:px-12 md:py-5 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all">Watch Film</button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4 z-30">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 md:w-16 bg-[#D4AF37]' : 'w-2 md:w-4 bg-white/20'}`} />
          ))}
        </div>
      </section>

      {/* 3. BRAND STATS (Responsive Grid) */}
      <section className="py-12 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {[{ l: "Engineering", v: "Terabyte Core" }, { l: "Delivery", v: "Fast Shipping" }, { l: "Warranty", v: "1 Year Shield" }, { l: "Support", v: "24/7 Helpline" }].map((item, i) => (
            <div key={i} className="space-y-1 md:space-y-2 border-l border-gray-100 pl-4 md:pl-8">
              <p className="text-[8px] md:text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">{item.l}</p>
              <p className="text-sm md:text-xl font-bold tracking-tight uppercase truncate">{item.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. STICKY NAV (Search & Filters Responsive) */}
      <nav className={`sticky top-0 z-[100] px-4 md:px-6 py-4 md:py-6 transition-all duration-500 ${isScrolled ? 'translate-y-0' : 'translate-y-1'}`}>
        <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-3xl border border-white/20 rounded-[25px] md:rounded-[40px] shadow-2xl p-2 md:p-3 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6">
          <div className="flex gap-1 overflow-x-auto no-scrollbar w-full lg:w-auto px-2">
            {["All", "Wearables", "Audio", "Mobile", "Vision", "Work"].map(c => (
              <button key={c} onClick={() => setActiveCategory(c)} className={`whitespace-nowrap px-5 py-2 md:px-8 md:py-3 rounded-full text-[8px] md:text-[9px] font-black tracking-widest uppercase transition-all ${activeCategory === c ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>{c}</button>
            ))}
          </div>
          <div className="flex-1 w-full flex items-center px-4 lg:px-8 lg:border-l border-gray-100">
             <span className="mr-3 opacity-30 text-xs">🔍</span>
             <input type="text" placeholder="SEARCH PRODUCTS..." className="bg-transparent w-full text-[9px] md:text-[10px] font-black tracking-widest outline-none uppercase" onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="hidden lg:flex items-center gap-6 pr-6">
             <Link to="/cart" className="text-[10px] font-black tracking-widest uppercase flex items-center gap-2">CART <span className="bg-[#D4AF37] text-black w-5 h-5 rounded-full flex items-center justify-center text-[8px]">{cart?.length || 0}</span></Link>
          </div>
        </div>
      </nav>

      {/* 5. PRODUCT CATALOGUE (Grid: 1 Mobile, 2 Tablet, 3 Desktop) */}
      <section ref={catalogueRef} className="max-w-7xl mx-auto px-6 py-20 md:py-40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-6 px-2">
          <div className="space-y-3 md:space-y-4 text-left">
             <p className="text-[10px] md:text-[11px] font-black text-[#D4AF37] tracking-[0.6em] uppercase italic">New Collection</p>
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic">Featured Items</h2>
          </div>
          <p className="text-gray-400 font-medium max-w-xs text-left md:text-right text-xs md:text-sm">Premium global tech inventory curated for perfection.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 lg:gap-20">
          {filtered.map(p => (
            <div key={p.id} className="group relative flex flex-col">
              <div className="relative aspect-[4/5] w-full bg-white rounded-[40px] md:rounded-[60px] overflow-hidden shadow-sm border border-gray-50 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20">
                    <span className="bg-black text-[#D4AF37] px-3 py-1.5 md:px-5 md:py-2 rounded-full text-[7px] md:text-[8px] font-black tracking-widest uppercase">{p.tag}</span>
                </div>
                <Link to={`/product/${p.id}`} className="w-full h-full p-12 md:p-20 flex items-center justify-center">
                  <img src={p.img} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700" alt={p.name} />
                </Link>
                {/* Responsive Button - Visible on touch/Mobile, Hover on desktop */}
                <div className="absolute inset-x-6 bottom-8 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                   <button onClick={(e) => handleAddToCart(e, p)} className="w-full bg-black text-white py-4 rounded-2xl text-[9px] font-black uppercase hover:bg-[#D4AF37] transition-all shadow-xl">Add to Bag +</button>
                </div>
              </div>
              <div className="mt-6 md:mt-10 px-2 text-left space-y-1 md:space-y-2">
                 <p className="text-[8px] md:text-[9px] font-black text-gray-300 tracking-[0.4em] uppercase">{p.spec}</p>
                 <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase truncate">{p.name}</h3>
                 <p className="text-xl md:text-2xl font-bold text-[#D4AF37]">₹{p.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. HERITAGE / STATS (Responsive Layout) */}
      <section className="mx-4 md:mx-6 py-20 md:py-40 bg-[#1A1A1A] rounded-[40px] md:rounded-[80px] text-[#F9F6F0] overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8 md:space-y-12">
               <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase italic">Terabyte Vision</span>
               <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight italic uppercase">Designed for <br className="hidden md:block"/> Perfection.</h2>
               <p className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-md">Clean aesthetics and powerful performance. Every Terabyte product is crafted for a seamless experience.</p>
               <div className="pt-4">
                  <button className="border-b-2 border-[#D4AF37] text-[#D4AF37] pb-2 text-[10px] font-black tracking-widest uppercase hover:text-white transition-all">Learn More</button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
               {[{t:"50k+", l:"Users"}, {t:"24/7", l:"Support"}, {t:"0", l:"Shipping"}, {t:"2026", l:"Tech"}].map((s,i)=>(
                 <div key={i} className={`aspect-square rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-4 text-center ${i===3 ? 'bg-[#D4AF37] text-black' : 'bg-white/5 border border-white/5'}`}>
                   <p className="text-2xl md:text-4xl font-black">{s.t}</p>
                   <p className="text-[7px] md:text-[9px] font-black tracking-widest uppercase opacity-60">{s.l}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. PERFORMANCE BAR SHOWCASE */}
      <section className="py-24 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
           <div className="text-center mb-16 md:mb-32">
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic mb-4">Terabyte Performance</h3>
              <p className="text-gray-400 text-[10px] tracking-widest uppercase font-black">Powering your everyday life</p>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-10 md:space-y-12 order-2 lg:order-1">
                  {[{ t: "Processing", p: "98%" }, { t: "Battery", p: "94%" }, { t: "Build", p: "100%" }].map((spec, i) => (
                    <div key={i} className="group">
                       <div className="flex justify-between items-end mb-3">
                          <h4 className="text-lg md:text-xl font-bold uppercase italic tracking-tighter">{spec.t} Power</h4>
                          <span className="text-[#D4AF37] font-black text-sm">{spec.p}</span>
                       </div>
                       <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
                          <div className="h-full bg-black group-hover:bg-[#D4AF37] transition-all duration-1000 ease-out" style={{ width: spec.p }}></div>
                       </div>
                    </div>
                  ))}
              </div>
              <div className="rounded-[30px] md:rounded-[60px] overflow-hidden shadow-2xl h-[300px] md:h-[500px] order-1 lg:order-2">
                  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000" className="w-full h-full object-cover grayscale brightness-90" alt="" />
              </div>
           </div>
        </div>
      </section>

      {/* 8. NEWSLETTER (Fully Responsive) */}
      <section className="py-24 md:py-40 bg-[#F9F6F0] relative overflow-hidden px-6">
         <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12 relative z-10">
            <div className="w-16 md:w-24 h-[2px] bg-[#D4AF37] mx-auto"></div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none">Stay Ahead.</h2>
            <p className="text-gray-500 text-sm md:text-xl font-medium max-w-xl mx-auto leading-relaxed italic">Join our elite community for exclusive launch access.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 md:pt-8 w-full max-w-lg mx-auto">
               <input type="email" placeholder="EMAIL ADDRESS" className="bg-white border border-gray-100 px-8 py-5 md:py-6 rounded-full text-[10px] font-black tracking-widest outline-none focus:border-[#D4AF37] flex-1 shadow-sm" />
               <button className="bg-black text-white px-10 py-5 md:py-6 rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:bg-[#D4AF37] transition-all shadow-xl">Join</button>
            </div>
         </div>
         {/* Glow effects */}
         <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 md:w-[500px] h-64 md:h-[500px] bg-[#D4AF37]/10 blur-[100px] rounded-full"></div>
      </section>

      {/* 9. GLOBAL FOOTER (Responsive Grid) */}
      <footer className="py-20 md:py-32 border-t border-gray-100 bg-white px-6">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center md:text-left">
              {[{ c: "Mumbai", a: "Official Hub" }, { c: "Dubai", a: "Center" }, { c: "London", a: "Retail" }, { c: "Tokyo", a: "Flagship" }].map((loc, i) => (
                <div key={i} className="space-y-2 md:space-y-4 group">
                   <h5 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic group-hover:text-[#D4AF37] transition-colors">{loc.c}</h5>
                   <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest">{loc.a}</p>
                </div>
              ))}
           </div>
           <div className="mt-20 text-center border-t border-gray-50 pt-10">
              <p className="text-[9px] font-black text-gray-300 tracking-[0.8em] uppercase">Terabyte Systems © 2026</p>
           </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;