import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  // GLOBALIZED PULL: Fetching native shared active theme triggers directly from unified state aggregator
  const { cart, removeFromCart, addToCart, decreaseQuantity, clearCart, cartTotal, isLoggedIn, user, isDarkMode, toggleTheme } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Payment triggers
  const [paymentMethod, setPaymentMethod] = useState('upi'); 
  const [upiStatus, setUpiStatus] = useState('idle'); // idle, verifying, verified
  
  const [shippingData, setShippingData] = useState({ 
    phone: '', 
    address: '', 
    email: '',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

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

  // Direct context hook execution maintaining auditories effortlessly
  const handleToggleTheme = () => {
    playPremiumBeep();
    toggleTheme();
  };

  // Securely retrieve registered user from memory
  let displayUser = user;
  if (!displayUser || !displayUser.name) {
    const stored = localStorage.getItem("terabyte_registered_user");
    if (stored) {
      displayUser = JSON.parse(stored);
    }
  }

  const formatINR = (amount) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(amount);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); 
    if (value.length <= 10) {
      setShippingData({ ...shippingData, phone: value });
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    let formatted = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += value[i];
    }
    if (formatted.length <= 19) { 
      setShippingData({ ...shippingData, cardNumber: formatted });
    }
  };

  // LIVE INTERACTIVE UPI VERIFIER
  const handleVerifyUpi = () => {
    if (!shippingData.upiId || !shippingData.upiId.includes('@')) {
      alert("Please enter a valid UPI ID containing '@' (e.g., arul@okaxis)");
      return;
    }
    playPremiumBeep();
    setUpiStatus('verifying');
    
    setTimeout(() => {
      setUpiStatus('verified');
    }, 1200);
  };

  // STRICT AUTHENTICATION BLOCK
  const handleCheckoutClick = () => {
    playPremiumBeep();
    
    // STRICT CHECK: Fails if not logged in
    if (!isLoggedIn && (!displayUser || !displayUser.name)) {
      alert("🔒 Authorization Required: Please Sign In or Create an Account to process your transaction.");
      navigate('/auth');
      return;
    }
    
    if (displayUser && displayUser.email && !shippingData.email) {
      setShippingData(prev => ({ ...prev, email: displayUser.email.toLowerCase() }));
    }
    
    setShowModal(true);
  };

  const handleFinalOrder = (e) => {
    e.preventDefault();
    playPremiumBeep();

    if (shippingData.phone.length !== 10) { 
      alert("Please enter a valid 10-digit mobile number."); 
      return; 
    }

    // STRICT GATEWAY VALIDATIONS
    if (paymentMethod === 'upi') {
      if (upiStatus !== 'verified') {
        alert("Please click 'Verify' to authenticate your UPI identifier before proceeding.");
        return;
      }
    }
    if (paymentMethod === 'card' && (shippingData.cardNumber.replace(/\s/g, "").length !== 16 || shippingData.cardCvv.length !== 3)) {
      alert("Please complete the Credit Card authentication parameters.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowModal(false);
      setOrderSuccess(true);
      clearCart();
    }, 2000);
  };

  if (orderSuccess) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 text-center selection:bg-[#D4AF37] selection:text-white animate-slideUp transition-colors duration-500 ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#F9F6F0] text-black'}`}>
        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl animate-bounce mb-8 shadow-xl">✓</div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">Transaction Confirmed!</h2>
        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] font-bold mt-4 max-w-md leading-relaxed">
          Payment authorized via <span className="text-[#D4AF37] font-black">{paymentMethod.toUpperCase()}</span>. Custom node deployment artifacts are en route to your workspace.
        </p>
        
        <div className={`mt-8 p-4 rounded-2xl border inline-flex items-center gap-4 text-left shadow-sm ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'}`}>
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <div>
              <p className="text-[8px] font-black tracking-widest uppercase text-gray-400">Order Telemetry Link</p>
              <p className={`text-xs font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>TRX-2026-ARUL-{(Math.random() * 9000 + 1000).toFixed(0)}</p>
           </div>
        </div>

        <Link to="/products" onClick={playPremiumBeep} className="bg-[#D4AF37] text-black px-12 py-5 rounded-full text-[10px] font-black uppercase mt-12 transition-all hover:bg-white shadow-md active:scale-95 tracking-widest font-black">
          Return to Store Archive
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 space-y-8 selection:bg-[#D4AF37] selection:text-white transition-colors duration-500 ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#F9F6F0] text-black'}`}>
        <div className="text-6xl grayscale opacity-20 animate-pulse" aria-hidden="true">🛒</div>
        <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em]" role="status">The archive is empty</p>
        <Link to="/products" onClick={playPremiumBeep} className="bg-[#D4AF37] text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl active:scale-95 font-black">
          Start Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-[#D4AF37] selection:text-white pb-32 pt-28 md:pt-40 px-6 md:px-12 transition-colors duration-500 ${isDarkMode ? 'bg-[#121212] text-[#F9F6F0]' : 'bg-[#F9F6F0] text-[#1A1A1A]'}`}>
      
      {/* FLOATING THEME SWITCHER CONTROLLER GUIDED DIRECTLY TO NATIVE AGGREGATOR */}
      <button 
        onClick={handleToggleTheme}
        aria-label={`Switch to ${isDarkMode ? 'Light' : 'Dark'} mode`}
        className="fixed bottom-24 md:bottom-10 right-4 md:right-10 z-[4000] bg-[#D4AF37] text-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black shadow-2xl hover:scale-110 transition-transform active:scale-95 cursor-pointer border border-white/20"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic mb-12 md:mb-20 text-left">
          My Cart<span className="text-[#D4AF37]">.</span>
        </h1>
        
        <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 transition-all duration-500 ${showModal ? 'blur-md scale-95 opacity-50 pointer-events-none' : ''}`}>
          
          {/* PRODUCTS LIST */}
          <div className="flex-1 space-y-8 text-left" aria-label="Shopping Cart Items">
            {cart.map((item) => (
              <div key={item.id} className={`flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-10 border-b pb-10 group animate-slideUp ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <img src={item.image || item.img} alt={item.name} className={`w-32 h-32 md:w-28 md:h-28 object-contain rounded-[25px] p-4 shadow-sm border group-hover:scale-105 transition-transform duration-500 ${isDarkMode ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-gray-100'}`} />
                
                <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                  <h3 className={`text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.name}</h3>
                  <p className="text-xs font-black text-[#D4AF37] tracking-widest mt-2 mb-6">{formatINR(item.price)}</p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-6">
                    <div className={`flex items-center gap-4 px-4 py-2 rounded-full border shadow-sm ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'}`}>
                      <button onClick={() => { playPremiumBeep(); decreaseQuantity(item.id); }} aria-label="Decrease quantity" className="w-6 h-6 font-black text-gray-500 hover:text-red-500 transition-colors cursor-pointer">－</button>
                      <span className={`font-bold text-xs w-4 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.quantity}</span>
                      
                      {/* SHARED MULTIPLIER ACCUMULATOR TRIGGER Hooked securely to context limits */}
                      <button onClick={() => { playPremiumBeep(); addToCart({ ...item, quantity: 1 }); }} aria-label="Increase quantity" className="w-6 h-6 font-black text-gray-500 hover:text-green-600 transition-colors cursor-pointer">＋</button>
                    </div>
                    <button onClick={() => { playPremiumBeep(); removeFromCart(item.id); }} className="text-[9px] font-black uppercase text-gray-500 hover:text-red-600 tracking-widest transition-colors cursor-pointer">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <aside className="w-full lg:w-[400px]" aria-label="Order Checkout Summary">
            <div className={`rounded-[40px] p-8 md:p-10 sticky top-32 border shadow-sm text-left transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'}`}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] border-b pb-4 mb-8 text-gray-500 border-gray-200/20">Transaction Details</h2>
              
              <div className="space-y-4 mb-10">
                 <div className="flex justify-between text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>{formatINR(cartTotal)}</span>
                 </div>
                 <div className="flex justify-between text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    <span>Shipping Dispatch</span>
                    <span className="text-green-500 font-black">Free Secure</span>
                 </div>
                 <div className={`flex justify-between text-2xl md:text-3xl font-black italic uppercase pt-4 border-t ${isDarkMode ? 'text-white border-white/10' : 'text-black border-gray-100'}`}>
                  <span>Total</span>
                  <span className="text-[#D4AF37]">{formatINR(cartTotal)}</span>
                </div>
              </div>

              {/* STRICT CHECKOUT BUTTON */}
              <button 
                onClick={handleCheckoutClick}
                className="w-full bg-[#D4AF37] text-black py-6 md:py-8 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-md active:scale-95 cursor-pointer font-black"
              >
                Checkout Now →
              </button>
              
              <p className="text-[8px] text-center text-gray-500 font-bold tracking-widest uppercase mt-4">Verified Authentication Required</p>
            </div>
          </aside>

        </div>

      </div>

      {/* --- SHIPPING & PAYMENT MODAL (INTEGRATED PREMIUM GATEWAY SWITCHER + LIVE UPI VERIFIER) --- */}
      {showModal && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[5000] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} aria-hidden="true"></div>
          
          <div className={`w-full max-w-xl rounded-t-[40px] md:rounded-[40px] p-8 md:p-10 relative z-10 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto text-left transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A] text-white border border-white/10' : 'bg-white text-black'}`}>
            
            <div className="w-12 h-1 bg-gray-500/30 rounded-full mx-auto mb-6 md:hidden"></div>
            
            <div className="flex justify-between items-center mb-6 border-b border-gray-500/20 pb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">Dispatch Infrastructure</h2>
                <span className="text-[8px] font-black bg-green-500/20 text-green-500 px-2 py-0.5 rounded uppercase tracking-widest mt-1 inline-block">Secure Node Active</span>
              </div>
              <button onClick={() => setShowModal(false)} aria-label="Close dialog" className="text-gray-500 hover:text-[#D4AF37] font-black text-sm">✕</button>
            </div>
            
            <form onSubmit={handleFinalOrder} className="space-y-6">
              
              {/* SECTION A: IDENTITY & SHIPPING */}
              <div className="space-y-4">
                <p className="text-[8px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">Telemetry Identity</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="customer-field" className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Architect</label>
                    <input 
                      id="customer-field" 
                      type="text" 
                      value={displayUser?.name || "Arul"} 
                      disabled 
                      className={`w-full rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest cursor-not-allowed border-none outline-none ${isDarkMode ? 'bg-black/50 text-white/50' : 'bg-gray-100 text-black/60'}`} 
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="mobile-field" className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Mobile Link</label>
                    <input 
                      id="mobile-field"
                      type="text" inputMode="numeric" placeholder="10 DIGITS" required 
                      value={shippingData.phone}
                      onChange={handlePhoneChange}
                      className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none tracking-widest transition-all ${isDarkMode ? 'bg-black text-white border-white/10 focus:border-[#D4AF37]' : 'bg-gray-50 text-black border-gray-200 focus:border-[#D4AF37]'}`} 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email-field" className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Secure Email ID</label>
                  <input 
                    id="email-field"
                    type="email" placeholder="name@domain.com" required 
                    value={shippingData.email}
                    onChange={(e) => setShippingData({...shippingData, email: e.target.value.toLowerCase()})}
                    className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all lowercase ${isDarkMode ? 'bg-black text-white border-white/10 focus:border-[#D4AF37]' : 'bg-gray-50 text-black border-gray-200 focus:border-[#D4AF37]'}`} 
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="addr-field" className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Destination Node Address</label>
                  <textarea 
                    id="addr-field"
                    placeholder="Full Workspace Destination Address..." required 
                    value={shippingData.address}
                    onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                    className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none h-20 resize-none transition-all uppercase tracking-wide ${isDarkMode ? 'bg-black text-white border-white/10 focus:border-[#D4AF37]' : 'bg-gray-50 text-black border-gray-200 focus:border-[#D4AF37]'}`} 
                  />
                </div>
              </div>

              {/* SECTION B: PAYMENT SWITCHER WITH 4 OPTIONS (ADDED COD) */}
              <div className="space-y-4 pt-2 border-t border-gray-500/20">
                 <div className="flex justify-between items-center">
                    <p className="text-[8px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">Payment System</p>
                    <span className="text-[8px] font-black bg-green-500/20 text-green-500 px-2 py-0.5 rounded uppercase tracking-widest">256-Bit SSL</span>
                 </div>

                 <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-white/10' : 'bg-gray-50 border-gray-200'}`} role="radiogroup">
                    {[
                      { id: 'upi', l: 'UPI / GPay' },
                      { id: 'card', l: 'Credit Card' },
                      { id: 'nb', l: 'Net Banking' },
                      { id: 'cod', l: 'COD Option' } 
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        role="radio"
                        aria-checked={paymentMethod === method.id}
                        onClick={() => { 
                          playPremiumBeep(); 
                          setPaymentMethod(method.id); 
                          if(method.id === 'upi') setUpiStatus('idle');
                        }}
                        className={`py-2 text-[9px] font-black tracking-widest uppercase rounded-lg transition-all ${
                          paymentMethod === method.id 
                            ? 'bg-[#D4AF37] text-black shadow-sm font-black' 
                            : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                        }`}
                      >
                        {method.l}
                      </button>
                    ))}
                 </div>

                 {/* DYNAMIC FORM 1: LIVE INTERACTIVE UPI VERIFIER */}
                 {paymentMethod === 'upi' && (
                   <div className="space-y-2 animate-slideUp pt-1">
                      <label htmlFor="upi-field" className="text-[9px] font-bold text-gray-500 block uppercase tracking-widest">Enter Virtual Payment Address (VPA)</label>
                      <div className={`flex rounded-xl overflow-hidden border focus-within:border-[#D4AF37] transition-all ${isDarkMode ? 'border-white/10 bg-black' : 'border-gray-200 bg-white'}`}>
                         <input 
                           id="upi-field"
                           type="text" 
                           placeholder="arul@okaxis" 
                           required={paymentMethod === 'upi'}
                           value={shippingData.upiId}
                           onChange={(e) => {
                             setShippingData({...shippingData, upiId: e.target.value.toLowerCase().trim()});
                             if (upiStatus !== 'idle') setUpiStatus('idle'); // Reset verification on change
                           }}
                           className="w-full bg-transparent px-4 py-3 text-xs font-bold outline-none lowercase"
                         />
                         
                         {/* INTERACTIVE LIVE VERIFIER BUTTON TRIGGER */}
                         <button 
                           type="button"
                           onClick={handleVerifyUpi}
                           disabled={upiStatus === 'verifying'}
                           className={`px-5 py-3 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border-l ${
                             upiStatus === 'verified' 
                               ? 'bg-green-500 text-white border-green-500' 
                               : upiStatus === 'verifying'
                               ? 'bg-yellow-500 text-black border-yellow-500 animate-pulse'
                               : isDarkMode ? 'bg-white/10 text-[#D4AF37] border-white/10 hover:bg-white/20' : 'bg-gray-100 text-black border-gray-200 hover:bg-gray-200'
                           }`}
                         >
                           {upiStatus === 'verified' ? '✓ Verified' : upiStatus === 'verifying' ? 'Verifying...' : 'Verify'}
                         </button>

                      </div>
                      <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest pt-1">Click 'Verify' to confirm identifier activation.</p>
                   </div>
                 )}

                 {/* DYNAMIC FORM 2: CREDIT CARD */}
                 {paymentMethod === 'card' && (
                   <div className={`space-y-3 animate-slideUp pt-1 p-4 rounded-xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="space-y-1">
                         <label htmlFor="card-num" className="text-[8px] font-black uppercase tracking-widest text-gray-500">Card Number</label>
                         <input 
                           id="card-num"
                           type="text" 
                           placeholder="•••• •••• •••• ••••" 
                           required={paymentMethod === 'card'}
                           value={shippingData.cardNumber}
                           onChange={handleCardNumberChange}
                           className={`w-full border rounded-lg px-3 py-2 text-xs font-black tracking-[0.2em] outline-none focus:border-[#D4AF37] ${isDarkMode ? 'bg-black text-white border-white/10' : 'bg-white text-black border-gray-200'}`}
                         />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                            <label htmlFor="card-exp" className="text-[8px] font-black uppercase tracking-widest text-gray-500">Valid Thru</label>
                            <input 
                              id="card-exp"
                              type="text" 
                              placeholder="MM/YY" 
                              required={paymentMethod === 'card'}
                              maxLength="5"
                              value={shippingData.cardExpiry}
                              onChange={(e) => setShippingData({...shippingData, cardExpiry: e.target.value})}
                              className={`w-full border rounded-lg px-3 py-2 text-xs font-bold outline-none text-center tracking-widest focus:border-[#D4AF37] ${isDarkMode ? 'bg-black text-white border-white/10' : 'bg-white text-black border-gray-200'}`}
                            />
                         </div>
                         <div className="space-y-1">
                            <label htmlFor="card-cvv" className="text-[8px] font-black uppercase tracking-widest text-gray-500">Security Code</label>
                            <input 
                              id="card-cvv"
                              type="password" 
                              placeholder="CVV" 
                              required={paymentMethod === 'card'}
                              maxLength="3"
                              value={shippingData.cardCvv}
                              onChange={(e) => setShippingData({...shippingData, cardCvv: e.target.value.replace(/\D/g,"")})}
                              className={`w-full border rounded-lg px-3 py-2 text-xs font-bold outline-none text-center tracking-widest focus:border-[#D4AF37] ${isDarkMode ? 'bg-black text-white border-white/10' : 'bg-white text-black border-gray-200'}`}
                            />
                         </div>
                      </div>
                   </div>
                 )}

                 {/* DYNAMIC FORM 3: NET BANKING */}
                 {paymentMethod === 'nb' && (
                   <div className="space-y-2 animate-slideUp pt-1">
                      <label htmlFor="bank-select" className="text-[9px] font-bold text-gray-500 block uppercase tracking-widest">Authorized Financial Node</label>
                      <select 
                        id="bank-select"
                        className={`w-full border rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none cursor-pointer focus:border-[#D4AF37] ${isDarkMode ? 'bg-black text-white border-white/10' : 'bg-white text-black border-gray-200'}`}
                      >
                         <option value="hdfc">HDFC Corporate Banking</option>
                         <option value="icici">ICICI Net Banking</option>
                         <option value="sbi">SBI Enterprise Telemetry</option>
                         <option value="axis">Axis Premium Startup Access</option>
                      </select>
                   </div>
                 )}

                 {/* DYNAMIC FORM 4: CASH ON DELIVERY VIEW */}
                 {paymentMethod === 'cod' && (
                   <div className={`p-4 rounded-xl border space-y-2 animate-slideUp text-left ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-yellow-50/50 border-yellow-200'}`}>
                      <p className="text-[10px] font-black tracking-widest uppercase text-[#D4AF37]">Doorstep Cash Clearance</p>
                      <p className="text-xs font-bold text-gray-500 leading-relaxed">
                        Pay via physical cash or live delivery scanner link upon physical drop-off. An additional handling charge of ₹50 is fully waived for verified startup founding partners.
                      </p>
                   </div>
                 )}
              </div>

              {/* SECTION C: ACTION CONTROLLERS */}
              <div className="flex flex-col-reverse md:flex-row gap-4 pt-4 border-t border-gray-500/20">
                <button type="button" onClick={() => { playPremiumBeep(); setShowModal(false); }} className="w-full md:w-auto px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] cursor-pointer">
                  Abort Transmission
                </button>
                <button type="submit" disabled={isProcessing} className={`flex-1 text-black py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-md ${isProcessing ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-[#D4AF37] hover:bg-white active:scale-95 cursor-pointer font-black'}`}>
                  {isProcessing ? 'Transmitting Key...' : `Authorize ${formatINR(cartTotal)}`}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Cart;