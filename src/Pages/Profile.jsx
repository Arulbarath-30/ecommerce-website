import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Profile = () => {
  const { user, logout } = useCart();
  const navigate = useNavigate();
  
  // Retrieve registered user details from LocalStorage as fallback
  const [userData, setUserData] = useState({ name: 'Arul', email: 'arul@terabyte.in' });
  const [activeTab, setActiveTab] = useState('orders');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch real data from memory
    const storedUser = localStorage.getItem("terabyte_registered_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserData({
        name: parsed.name || 'Arul',
        email: parsed.email || 'arul@terabyte.in'
      });
    }
  }, []);

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

  const handleLogout = () => {
    playPremiumBeep();
    logout();
    alert("You have been logged out successfully.");
    navigate('/auth');
  };

  const handleActionClick = () => {
    playPremiumBeep();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Dummy premium orders for the visual dashboard
  const dummyOrders = [
    { id: "ORD-2026-891", item: "Terabyte Studio Pro", date: "10 May, 2026", amount: "₹28,900", status: "Dispatched", tracking: "Air Priority (BLR-HUB)" },
    { id: "ORD-2026-704", item: "Terabyte Mouse Pad", date: "02 May, 2026", amount: "₹4,500", status: "Delivered", tracking: "Standard Delivery" }
  ];

  return (
    <div className="bg-[#F9F6F0] min-h-screen text-[#1A1A1A] font-sans antialiased selection:bg-[#D4AF37] selection:text-white pb-32">
      
      {/* --- RESPONSIVE TOAST NOTIFICATION --- */}
      {showToast && (
        <div role="alert" className="fixed bottom-6 md:bottom-10 left-4 right-4 md:left-auto md:right-10 z-[5000] bg-[#1A1A1A] text-[#F9F6F0] p-4 md:p-5 rounded-[20px] shadow-2xl flex items-center justify-between gap-6 border border-white/10 animate-slideUp">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex-shrink-0 flex items-center justify-center font-black text-black text-xs">✓</div>
             <div>
                <p className="text-[7px] font-black tracking-[0.3em] text-[#D4AF37] uppercase">System Request</p>
                <p className="text-xs font-black uppercase tracking-tight text-white">Update Dispatched</p>
             </div>
          </div>
          <span className="text-[8px] font-black tracking-widest text-gray-500 uppercase">Live Node</span>
        </div>
      )}

      {/* --- CINEMATIC USER HEADER --- */}
      <header className="bg-[#1A1A1A] text-[#F9F6F0] pt-24 md:pt-36 pb-16 md:pb-20 px-6 border-b border-white/10 relative overflow-hidden rounded-b-[40px] md:rounded-b-[60px] shadow-xl">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          
          <div className="flex items-center gap-6 text-left animate-slideUp">
             {/* Premium Avatar Circle */}
             <div className="w-20 h-20 md:w-28 md:h-28 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#1A1A1A] font-black text-3xl md:text-5xl shadow-inner border-2 border-white/20">
               {userData.name.charAt(0).toUpperCase()}
             </div>
             <div className="space-y-1">
               <p className="text-[#D4AF37] text-[9px] md:text-[10px] font-black tracking-[0.6em] uppercase italic">Verified Creator Account</p>
               <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-white truncate max-w-xs sm:max-w-lg">
                 {userData.name}
               </h1>
               <p className="text-gray-400 text-xs md:text-sm font-bold tracking-widest lowercase pt-1">{userData.email}</p>
             </div>
          </div>

          {/* Quick Security Status */}
          <div className="flex gap-6 border-t border-white/10 md:border-t-0 pt-6 md:pt-0 w-full md:w-auto justify-start md:justify-end items-center">
            <div className="border-l border-white/10 pl-4 text-left hidden sm:block">
               <p className="text-[8px] font-black tracking-[0.3em] uppercase text-gray-500">Security Standard</p>
               <p className="text-sm font-black uppercase tracking-tight text-green-500">Zero-Trust Active</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-full text-[9px] font-black tracking-widest uppercase hover:bg-red-600 hover:border-red-600 transition-all shadow-md active:scale-95 whitespace-nowrap ml-auto md:ml-0"
            >
              Sign Out ⏏
            </button>
          </div>

        </div>
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none"></div>
      </header>

      {/* --- DASHBOARD CONTROLS & CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side Navigation Columns */}
        <div className="lg:col-span-4 space-y-4 text-left">
           <div className="bg-white rounded-[30px] p-6 border border-gray-100 shadow-sm space-y-2">
              <p className="text-[8px] font-black tracking-widest text-gray-500 uppercase px-4 mb-2">Telemetry Navigation</p>
              
              <button 
                onClick={() => { setActiveTab('orders'); playPremiumBeep(); }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-xs font-black tracking-widest uppercase transition-all ${activeTab === 'orders' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span>📦 Active Dispatches</span>
                <span className="text-[9px] bg-[#D4AF37] text-black px-2 py-0.5 rounded-full font-bold">2</span>
              </button>

              <button 
                onClick={() => { setActiveTab('security'); playPremiumBeep(); }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-xs font-black tracking-widest uppercase transition-all ${activeTab === 'security' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span>🔑 Credentials & Auth</span>
              </button>

              <button 
                onClick={() => { setActiveTab('address'); playPremiumBeep(); }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-xs font-black tracking-widest uppercase transition-all ${activeTab === 'address' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span>📍 Saved Workspaces</span>
              </button>
           </div>

           <div className="bg-[#1A1A1A] text-white rounded-[30px] p-8 space-y-4 shadow-xl relative overflow-hidden">
              <p className="text-[#D4AF37] text-[8px] font-black tracking-[0.4em] uppercase">Enterprise Privilege</p>
              <h3 className="text-xl font-black uppercase italic tracking-tight leading-snug">Need Bulk Custom Hardware?</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-medium">Bypass standard limits. Direct supply lines available for verified startup founders.</p>
              <Link to="/contact" className="inline-block bg-[#D4AF37] text-black px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-md">
                Request Supply Link
              </Link>
           </div>
        </div>

        {/* Right Side Active Panel view */}
        <div className="lg:col-span-8">
           <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm min-h-[400px] text-left">
              
              {/* PANEL 1: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-8 animate-slideUp">
                  <div className="border-b border-gray-100 pb-4 flex justify-between items-end">
                     <div>
                        <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-black">Order Dispatches</h2>
                        <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-1">Real-time uncompromised shipping updates</p>
                     </div>
                     <Link to="/products" className="text-[9px] font-black tracking-widest text-[#D4AF37] uppercase hover:underline">Explore Store →</Link>
                  </div>

                  <div className="space-y-6">
                     {dummyOrders.map((ord) => (
                       <div key={ord.id} className="p-6 rounded-[25px] border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-black transition-all">
                          <div className="space-y-1">
                             <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-black tracking-widest uppercase">{ord.id}</span>
                                <span className={`text-[7px] font-black px-2 py-1 rounded uppercase tracking-widest ${ord.status === 'Dispatched' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-green-100 text-green-700'}`}>
                                  {ord.status}
                                </span>
                             </div>
                             <h3 className="text-base font-black uppercase tracking-tight text-black pt-1">{ord.item}</h3>
                             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Placed: {ord.date} • Link: {ord.tracking}</p>
                          </div>
                          
                          <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200">
                             <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Total</p>
                             <p className="text-lg font-black text-[#D4AF37]">{ord.amount}</p>
                             <button onClick={handleActionClick} className="text-[8px] font-black underline uppercase text-black hover:text-[#D4AF37] block mt-1 tracking-widest">
                               Download Invoice ↓
                             </button>
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              {/* PANEL 2: SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-6 animate-slideUp">
                  <div className="border-b border-gray-100 pb-4">
                     <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-black">Credentials & Trust</h2>
                     <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-1">Encrypted system telemetry identifiers</p>
                  </div>

                  <div className="space-y-4 max-w-md">
                     <div className="space-y-1">
                        <label className="text-[9px] font-black tracking-widest uppercase text-gray-500">Primary Registered Email</label>
                        <input type="text" readOnly value={userData.email} className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-xs font-bold text-gray-600 outline-none lowercase cursor-not-allowed" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-black tracking-widest uppercase text-gray-500">Security Clearance Level</label>
                        <input type="text" readOnly value="Level-1 (Startup Owner)" className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-xs font-black tracking-widest uppercase text-black outline-none cursor-not-allowed" />
                     </div>

                     <button onClick={handleActionClick} className="bg-black text-white px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-md mt-4">
                       Request Password Reset Link
                     </button>
                  </div>
                </div>
              )}

              {/* PANEL 3: ADDRESSES */}
              {activeTab === 'address' && (
                <div className="space-y-6 animate-slideUp">
                  <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                     <div>
                        <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-black">Workspace Nodes</h2>
                        <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-1">Physical hardware shipping destinations</p>
                     </div>
                     <button onClick={handleActionClick} className="bg-[#1A1A1A] text-white px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all">
                       + Add New
                     </button>
                  </div>

                  <div className="p-6 rounded-[20px] border-2 border-black bg-white space-y-2 relative">
                     <span className="absolute top-4 right-4 bg-black text-[#D4AF37] text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Primary</span>
                     <h3 className="text-xs font-black uppercase tracking-tight text-black">Indiranagar Engineering Bay</h3>
                     <p className="text-xs font-bold text-gray-600 leading-relaxed max-w-sm">
                       100ft Road, Phase 1, Startup Hub Incubator, Bangalore, Karnataka - 560038
                     </p>
                     <p className="text-[10px] font-black text-gray-500 tracking-wide uppercase pt-1">Phone Link: +91 98765 43210</p>
                  </div>
                </div>
              )}

           </div>
        </div>

      </main>

    </div>
  );
};

export default Profile;