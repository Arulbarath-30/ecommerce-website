import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, addToCart, decreaseQuantity, clearCart, cartTotal, isLoggedIn, user } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({ 
    phone: '', 
    address: '', 
    email: '' 
  });

  const formatINR = (amount) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(amount);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); 
    if (value.length <= 10) {
      setShippingData({ ...shippingData, phone: value });
    }
  };

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      alert("Please Sign In to place your order.");
      navigate('/auth');
      return;
    }
    setShowModal(true);
  };

  const handleFinalOrder = (e) => {
    e.preventDefault();
    if (shippingData.phone.length !== 10) { alert("Invalid phone number"); return; }
    
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
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl animate-bounce mb-8">✓</div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-black italic">Order Confirmed!</h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold mt-4">Artifacts are on the way.</p>
        <Link to="/products" className="bg-black text-white px-12 py-5 rounded-full text-[10px] font-black uppercase mt-12 transition-all hover:bg-[#D4AF37]">Return to Store</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 space-y-8">
        <div className="text-6xl grayscale opacity-20">🛒</div>
        <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em]">The archive is empty</p>
        <Link to="/products" className="bg-black text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Start Browsing</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 md:pt-40 pb-20 text-black min-h-screen">
      <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic mb-12 md:mb-20">
        My Cart<span className="text-[#D4AF37]">.</span>
      </h1>
      
      <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 transition-all duration-500 ${showModal ? 'blur-xl scale-95 opacity-40 pointer-events-none' : ''}`}>
        
        {/* PRODUCTS LIST */}
        <div className="flex-1 space-y-8">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-10 border-b border-gray-50 pb-10">
              <img src={item.image || item.img} alt="" className="w-32 h-32 md:w-28 md:h-28 object-contain bg-[#F9F9F9] rounded-3xl p-6" />
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none">{item.name}</h3>
                <p className="text-xs font-bold text-[#D4AF37] mt-2 mb-6">{formatINR(item.price)}</p>
                
                <div className="flex items-center justify-center sm:justify-start gap-6">
                  <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <button onClick={() => decreaseQuantity(item.id)} className="w-6 h-6 font-black hover:text-red-500 transition-colors">－</button>
                    <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="w-6 h-6 font-black hover:text-green-600 transition-colors">＋</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-[9px] font-black uppercase text-gray-300 hover:text-red-600 tracking-widest transition-colors">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <aside className="w-full lg:w-[400px]">
          <div className="bg-[#F9F9F9] rounded-[40px] p-8 md:p-10 sticky top-32 border border-gray-100">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] border-b border-gray-200 pb-4 mb-8 text-gray-400">Transaction Details</h2>
            
            <div className="space-y-4 mb-10">
               <div className="flex justify-between text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>{formatINR(cartTotal)}</span>
               </div>
               <div className="flex justify-between text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-green-500">Free</span>
               </div>
               <div className="flex justify-between text-2xl md:text-3xl font-black italic uppercase text-black pt-4 border-t border-gray-100">
                <span>Total</span>
                <span>{formatINR(cartTotal)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckoutClick}
              className="w-full bg-black text-white py-6 md:py-8 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-black transition-all shadow-2xl shadow-black/10"
            >
              Checkout Now
            </button>
          </div>
        </aside>
      </div>

      {/* --- SHIPPING MODAL (MOBILE RESPONSIVE) --- */}
      {showModal && (
        <div className="fixed inset-0 z-[5000] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          
          <div className="bg-white w-full max-w-lg rounded-t-[40px] md:rounded-[50px] p-8 md:p-12 relative z-10 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-8 md:hidden"></div>
            <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-8">Delivery Details</h2>
            
            <form onSubmit={handleFinalOrder} className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Customer</label>
                  <input type="text" value={user?.name || "Praveen"} disabled className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-xs font-bold text-black/50" />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-black ml-1">Email Address</label>
                  <input 
                    type="email" placeholder="praveen@terabyte.com" required 
                    value={shippingData.email}
                    onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-1 ring-black outline-none transition-all" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-black ml-1">Mobile</label>
                  <input 
                    type="text" inputMode="numeric" placeholder="10 Digits" required 
                    value={shippingData.phone}
                    onChange={handlePhoneChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-1 ring-black outline-none transition-all" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-black ml-1">Address</label>
                  <textarea 
                    placeholder="Full Delivery Address" required 
                    onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-1 ring-black outline-none h-24 resize-none transition-all" 
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="w-full md:w-auto px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Cancel</button>
                <button 
                  type="submit" 
                  className="flex-1 bg-black text-white py-6 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-black/20"
                >
                  {isProcessing ? 'Validating...' : 'Confirm Order'}
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