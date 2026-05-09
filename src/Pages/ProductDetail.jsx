import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState('specs');

  useEffect(() => {
    const found = products.find(p => p.id === parseInt(id));
    setProduct(found);
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="h-screen bg-white flex items-center justify-center p-6">
        <p className="text-[10px] font-black tracking-[0.5em] md:tracking-[1em] uppercase animate-pulse text-center">
          Accessing Terabyte Vault...
        </p>
      </div>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen text-black antialiased pt-24 md:pt-40 pb-20 selection:bg-[#D4AF37] selection:text-white">
      
      {/* 1. BREADCRUMBS (Mobile Friendly) */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-8 md:mb-12 flex flex-wrap items-center gap-3 md:gap-6">
        <Link to="/" className="text-[9px] md:text-[10px] font-black tracking-widest uppercase hover:text-[#D4AF37] transition-colors">Archive</Link>
        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
        <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-gray-300 italic truncate">{product.category}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-start">
          
          {/* 2. IMAGE SECTION (Responsive Aspect Ratio) */}
          <div className="relative group w-full">
            <div className="aspect-square bg-[#F9F9F9] rounded-[30px] md:rounded-[40px] flex items-center justify-center p-10 md:p-20 overflow-hidden border border-gray-50">
              <img 
                src={product.image || product.img} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain transition-transform duration-[2s] group-hover:scale-110"
              />
            </div>
          </div>

          {/* 3. CONTENT SECTION */}
          <div className="space-y-8 md:space-y-12">
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <span className="bg-black text-white px-3 py-1 md:px-4 md:py-1 rounded-full text-[7px] md:text-[8px] font-black tracking-widest uppercase italic">Elite Hardware</span>
                <span className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase tracking-widest italic">ID: TN-2026-{product.id}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.95] md:leading-[0.9]">
                {product.name}
              </h1>
              <p className="text-2xl md:text-3xl font-light italic text-[#D4AF37]">₹{product.price.toLocaleString('en-IN')}</p>
            </div>

            <p className="text-sm md:text-lg text-gray-500 font-medium leading-relaxed max-w-lg">
              {product.description || "A masterclass in engineering, designed specifically for the 2026 digital ecosystem."}
            </p>

            {/* QUANTITY & ADD TO CART (Mobile Stacked) */}
            <div className="space-y-8 md:space-y-10 pt-8 md:pt-10 border-t border-gray-50">
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-12">
                  <div className="flex items-center border border-gray-100 rounded-full p-1.5 md:p-2 bg-gray-50/50">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg font-bold hover:bg-white rounded-full transition-all">－</button>
                    <span className="w-10 md:w-12 text-center font-black text-sm md:text-base">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg font-bold hover:bg-white rounded-full transition-all">＋</button>
                  </div>
                  <p className="text-[9px] md:text-[10px] font-black tracking-widest text-gray-400 uppercase">Select Quantity</p>
               </div>

               <button 
                 onClick={handleAdd}
                 className={`w-full py-6 md:py-8 rounded-[25px] md:rounded-[40px] text-[10px] md:text-[11px] font-black tracking-[0.3em] md:tracking-[0.5em] uppercase transition-all duration-700 shadow-xl ${added ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-[#D4AF37] hover:text-black hover:-translate-y-1 md:hover:-translate-y-2'}`}
               >
                 {added ? 'Secured ✓' : 'Add to Collection'}
               </button>
            </div>

            {/* TABS (Responsive Content) */}
            <div className="pt-12 md:pt-20">
               <div className="flex gap-8 md:gap-12 border-b border-gray-100 pb-4 md:pb-6 mb-8 md:mb-10">
                  {['specs', 'shipping'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`text-[8px] md:text-[9px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all ${tab === t ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-4 md:pb-6' : 'text-gray-300'}`}>
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
                       {!product.specs && <p className="text-xs text-gray-400 italic">Standard Elite Specifications Apply.</p>}
                    </div>
                  )}
                  {tab === 'shipping' && (
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase leading-relaxed md:leading-loose tracking-widest">
                      White-glove delivery service. Insured transit across all major global hubs. Delivery expected within 3-5 business days.
                    </p>
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