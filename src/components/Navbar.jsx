import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart, isLoggedIn, user, logout } = useCart();
  const [isOpen, setIsOpen] = useState(false); 
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // LOGIC FIX: Inga isLoggedIn true-ah irundha mattum thaan per-ai fetch pannanum
  let displayUser = null;
  if (isLoggedIn) {
    displayUser = user;
    if (!displayUser || !displayUser.name) {
      const stored = localStorage.getItem("terabyte_registered_user");
      if (stored) {
        displayUser = JSON.parse(stored);
      }
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-[2000] bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 md:px-12 py-3 md:py-4" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="relative z-[2100] text-xl md:text-2xl font-black tracking-tighter text-black">
          TERABYTE<span className="text-[#AF8F2C]">.</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">Home</Link>
          <Link to="/products" className="text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">Explore</Link>
          
          {/* LOGIC UPDATE: Sign in button condition fixed */}
          {isLoggedIn && displayUser && displayUser.name ? (
            <Link 
              to="/profile" 
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full hover:border-[#AF8F2C] transition-all group shadow-sm"
            >
              <div className="w-4 h-4 bg-[#AF8F2C] text-white rounded-full flex items-center justify-center font-black text-[9px]">
                {displayUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-black uppercase tracking-widest group-hover:text-[#AF8F2C]">
                {displayUser.name}
              </span>
            </Link>
          ) : (
            <Link to="/auth" className="text-xs font-bold text-black border-b-2 border-black uppercase tracking-widest">Sign In</Link>
          )}

          <Link to="/cart" aria-label={`Shopping Cart with ${totalItems} items`} className="relative text-xl">
            🛒 
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#AF8F2C] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="md:hidden relative z-[2200] p-2 text-xl text-black"
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* SLIDING SIDEBAR */}
        <div className={`
          fixed top-0 right-0 h-screen w-[75%] max-w-[280px] bg-white shadow-2xl z-[2150] 
          flex flex-col pt-20 px-8 transition-transform duration-500 md:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          
          <div className="flex flex-col text-left">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Shop</p>
            <Link to="/cart" onClick={() => setIsOpen(false)} className="flex justify-between items-center py-3 border-b border-gray-50 text-black">
              <span className="text-base font-black uppercase tracking-widest">My Cart</span>
              <span className="text-sm font-bold bg-black text-white px-2 py-0.5 rounded-full">{totalItems}</span>
            </Link>
            <Link to="/products" onClick={() => setIsOpen(false)} className="block py-3 text-base font-black uppercase tracking-widest border-b border-gray-50 text-black">
              Explore
            </Link>

            <div className="mt-6">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Menu</p>
              <Link to="/" onClick={() => setIsOpen(false)} className="block py-3 text-base font-black uppercase tracking-widest border-b border-gray-50 text-black">
                Home
              </Link>
            </div>

            <div className="mt-6">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Account</p>
               {/* MOBILE LOGIC FIX */}
               {isLoggedIn && displayUser && displayUser.name ? (
                 <div className="space-y-2 pt-1">
                   <Link 
                     to="/profile" 
                     onClick={() => setIsOpen(false)}
                     className="flex items-center justify-between py-2 text-base font-black text-black uppercase tracking-widest"
                   >
                     <span>⚙ {displayUser.name}</span>
                   </Link>
                   <button 
                    onClick={() => { logout(); setIsOpen(false); }} 
                    className="w-full text-left py-3 text-xs font-black text-red-500 uppercase tracking-widest border-t border-gray-50"
                   >
                    Sign Out
                   </button>
                 </div>
               ) : (
                 <Link to="/auth" onClick={() => setIsOpen(false)} className="block py-3 text-base font-black uppercase tracking-widest text-black">
                   Sign In
                 </Link>
               )}
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[2100] md:hidden" onClick={() => setIsOpen(false)} />
        )}

      </div>
    </nav>
  );
};

export default Navbar;