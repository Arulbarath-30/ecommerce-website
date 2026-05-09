import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart, isLoggedIn, user, logout } = useCart();
  const [isOpen, setIsOpen] = useState(false); 
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <nav className="fixed top-0 left-0 w-full z-[2000] bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 md:px-12 py-3 md:py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="relative z-[2100] text-xl md:text-2xl font-black tracking-tighter text-black">
          TERABYTE<span className="text-[#AF8F2C]">.</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">Home</Link>
          <Link to="/products" className="text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">Explore</Link>
          {isLoggedIn ? (
            <button onClick={logout} className="text-xs font-bold text-red-500">Sign Out</button>
          ) : (
            <Link to="/auth" className="text-xs font-bold text-black border-b-2 border-black">Sign In</Link>
          )}
          <Link to="/cart" className="relative text-xl">🛒 
            {totalItems > 0 && <span className="absolute -top-2 -right-3 bg-[#AF8F2C] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{totalItems}</span>}
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden relative z-[2200] p-2 text-xl focus:outline-none"
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* SLIDING SIDEBAR (Compact) */}
        <div className={`
          fixed top-0 right-0 h-screen w-[75%] max-w-[280px] bg-white shadow-2xl z-[2150] 
          flex flex-col pt-20 px-8 transition-transform duration-500 md:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          
          <div className="flex flex-col">
            {/* SHOPPING SECTION */}
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Shop</p>
            
            <Link to="/cart" onClick={() => setIsOpen(false)} className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-base font-black uppercase tracking-widest">My Cart</span>
              <span className="text-sm font-bold bg-black text-white px-2 py-0.5 rounded-full">{totalItems}</span>
            </Link>

            <Link to="/products" onClick={() => setIsOpen(false)} className="py-3 text-base font-black uppercase tracking-widest border-b border-gray-50">
              Explore
            </Link>

            {/* NAVIGATION */}
            <div className="mt-6">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Menu</p>
              <Link to="/" onClick={() => setIsOpen(false)} className="py-3 text-base font-black uppercase tracking-widest border-b border-gray-50">
                Home
              </Link>
            </div>

            {/* ACCOUNT */}
            <div className="mt-6">
               <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">User</p>
               {isLoggedIn ? (
                 <div className="space-y-3">
                   <p className="text-base font-black italic">{user?.name || 'Praveen'}</p>
                   <button 
                    onClick={() => { logout(); setIsOpen(false); }} 
                    className="w-full text-left py-3 text-sm font-black text-red-500 uppercase tracking-widest border-t border-gray-50"
                   >
                    Sign Out
                   </button>
                 </div>
               ) : (
                 <Link to="/auth" onClick={() => setIsOpen(false)} className="block py-3 text-base font-black uppercase tracking-widest">
                   Sign In
                 </Link>
               )}
            </div>
          </div>

          <div className="mt-auto pb-6">
             <p className="text-[8px] font-black text-gray-200 uppercase tracking-[0.4em]">Terabyte v1.0</p>
          </div>
        </div>

        {/* OVERLAY */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[2100] md:hidden" onClick={() => setIsOpen(false)} />
        )}

      </div>
    </nav>
  );
};

export default Navbar;