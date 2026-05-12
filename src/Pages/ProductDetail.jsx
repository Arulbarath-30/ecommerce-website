import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
// CRITICAL FIX: Direct absolute reference to centralized data vault to eliminate ID mismatches
import { products } from './Home';

const ProductDetail = () => {
  const { id } = useParams();
  // GLOBALIZED PULL: Fetching synchronized active theme engine context directly
  const { addToCart, isDarkMode, toggleTheme } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState('specs');

  // Strict parser mapping & interface top telemetry reset
  useEffect(() => {
    const found = products.find(p => p.id === parseInt(id));
    setProduct(found);
    window.scrollTo(0, 0);
  }, [id]);

  // Premium Auditory Feedback
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

  // Direct trigger executing global context engine state seamlessly
  const handleToggleTheme = () => {
    playPremiumBeep();
    toggleTheme();
  };

  // Fallback missing interface
  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 selection:bg-[#D4AF37] selection:text-white ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-white text-black'}`}>
        <p className="text-[10px] font-black tracking-[0.5em] md:tracking-[1em] uppercase animate-pulse text-center">
          Accessing Arul Vault Telemetry...
        </p>
      </div>
    );
  }

  // ENTERPRISE MULTIPLIER PUSH LOGIC
  // Pushes item exactly ONCE with the explicit payload quantity property attached
  const handleAdd = () => {
    playPremiumBeep();
    
    addToCart({ ...product, quantity: qty });
    
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQty(1); // Auto-reset local multiplier count
    }, 2000);
  };

  return (
    <div className={`min-h-screen font-sans antialiased pt-24 md:pt-40 pb-32 transition-colors duration-500 selection:bg-[#D4AF37] selection:text-white ${isDarkMode ? 'bg-[#121212] text-[#F9F6F0]' : 'bg-white text-black'}`}>
      
      {/* FLOATING THEME SWITCHER DIRECTED TO GLOBAL ENGINE */}
      <button 
        onClick={handleToggleTheme}
        aria-label={`Switch to ${isDarkMode ? 'Light' : 'Dark'} mode`}
        className="fixed bottom-24 md:bottom-10 right-4 md:right-10 z-[4000] bg-[#D4AF37] text-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black shadow-2xl hover:scale-110 transition-transform active:scale-95 cursor-pointer border border-white/20"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-8 md:mb-12 flex flex-wrap items-center gap-3 md:gap-6">
        <Link to="/" onClick={playPremiumBeep} className="text-[9px] md:text-[10px] font-black tracking-widest uppercase hover:text-[#D4AF37] transition-colors">Archive</Link>
        <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-gray-200'}`}></div>
        <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-[#D4AF37] italic truncate">{product.category} Vector</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-start">
          
          {/* IMAGE ASSET */}
          <div className="relative group w-full animate-slideUp">
            <div className={`aspect-square rounded-[30px] md:rounded-[40px] flex items-center justify-center p-10 md:p-20 overflow-hidden border transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-[#F9F9F9] border-gray-50'}`}>
              <span className="absolute top-6 right-6 bg-black text-[#D4AF37] px-4 py-2 rounded-full text-[8px] font-black tracking-widest uppercase shadow-md z-10">
                {product.tag}
              </span>
              <img 
                src={product.image || product.img} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain transition-transform duration-[2s] group-hover:scale-110 p-4"
              />
              <span className="absolute bottom-6 left-6 text-[7px] font-black tracking-widest text-gray-500 uppercase z-10">
                Node verification: TN-ARUL-{product.id}
              </span>
            </div>
          </div>

          {/* METADATA DASHBOARD */}
          <div className="space-y-8 md:space-y-12 animate-slideUp">
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <span className="bg-[#D4AF37] text-black px-3 py-1 md:px-4 md:py-1 rounded-full text-[7px] md:text-[8px] font-black tracking-widest uppercase italic font-black">Arul Standards</span>
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest italic text-gray-500">Telemetry ID: {product.id}</span>
              </div>
              <h1 className={`text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.95] md:leading-[0.9] ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {product.name}
              </h1>
              <p className="text-2xl md:text-3xl font-light italic text-[#D4AF37]">₹{product.price.toLocaleString('en-IN')}</p>
            </div>

            <p className={`text-sm md:text-lg font-medium leading-relaxed max-w-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              {product.spec || product.description || "A masterclass in engineering, designed specifically for elite mechanical workspaces."}
            </p>

            {/* MULTIPLIER CONTROLLERS */}
            <div className={`space-y-8 md:space-y-10 pt-8 md:pt-10 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-12">
                  <div className={`flex items-center rounded-full p-1.5 md:p-2 border ${isDarkMode ? 'bg-black border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <button type="button" onClick={() => { playPremiumBeep(); setQty(q => Math.max(1, q - 1)); }} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg font-bold text-gray-500 hover:text-red-500 rounded-full transition-all cursor-pointer">－</button>
                    <span className={`w-10 md:w-12 text-center font-black text-sm md:text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>{qty}</span>
                    <button type="button" onClick={() => { playPremiumBeep(); setQty(q => q + 1); }} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg font-bold text-gray-500 hover:text-green-500 rounded-full transition-all cursor-pointer">＋</button>
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black tracking-widest text-gray-500 uppercase">Select Payload Multiplier</p>
                    <p className="text-[8px] font-bold text-[#D4AF37] tracking-widest uppercase mt-0.5">Total: ₹{(product.price * qty).toLocaleString('en-IN')}</p>
                  </div>
               </div>

               <button 
                 onClick={handleAdd}
                 className={`w-full py-6 md:py-8 rounded-[25px] md:rounded-[40px] text-[10px] md:text-[11px] font-black tracking-[0.3em] md:tracking-[0.5em] uppercase transition-all duration-500 shadow-xl cursor-pointer font-black ${
                   added ? 'bg-green-500 text-white font-black' : 'bg-[#D4AF37] text-black hover:bg-white active:scale-95 font-black'
                 }`}
               >
                 {added ? `✓ Secured Payload (x${qty})` : `Add to Collection +`}
               </button>
            </div>

            {/* TABS VIEW */}
            <div className="pt-12 md:pt-20">
               <div className={`flex gap-8 md:gap-12 border-b pb-4 md:pb-6 mb-8 md:mb-10 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                  {['specs', 'shipping'].map(t => (
                    <button key={t} onClick={() => { playPremiumBeep(); setTab(t); }} className={`text-[8px] md:text-[9px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all cursor-pointer ${tab === t ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-4 md:pb-6' : 'text-gray-500 hover:text-gray-400'}`}>
                      {t}
                    </button>
                  ))}
               </div>

               <div className="min-h-[120px]">
                  {tab === 'specs' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                       {product.specs?.map((s, i) => (
                         <div key={i} className="flex items-center gap-3 md:gap-4">
                            <div className="w-1 h-1 bg-[#D4AF37] rounded-full"></div>
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">{s}</p>
                         </div>
                       ))}
                       {!product.specs && (
                         <div className={`p-4 rounded-2xl border space-y-1 ${isDarkMode ? 'bg-black/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                           <p className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">Primary Vector Standard</p>
                           <p className={`text-xs font-bold tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{product.spec || "Aerospace Grade Hardware."}</p>
                         </div>
                       )}
                    </div>
                  )}
                  {tab === 'shipping' && (
                    <div className={`p-6 rounded-2xl border space-y-2 ${isDarkMode ? 'bg-black/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                      <p className="text-[9px] font-black tracking-widest uppercase text-[#D4AF37]">Priority Air Dispatch</p>
                      <p className="text-xs font-bold text-gray-500 leading-relaxed tracking-wide">
                        White-glove delivery service handled by elite logistics nodes. Insured transit directly from Bangalore Hub. Expected clearance within 48 hours for verified startup partners.
                      </p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;