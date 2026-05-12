import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  // GLOBALIZED PULL: Fetching native authentication controls and real-time absolute theme metrics
  const { login, isDarkMode } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

  // --- 1. VISUAL AUTO-CORRECTION ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'email' ? value.toLowerCase() : value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playPremiumBeep();

    if (!formData.email || !formData.password) {
      alert("Please enter your email and password to continue.");
      return;
    }

    // --- 2. STRICT NORMALIZATION ---
    const normalizedEmail = formData.email.toLowerCase().trim();

    if (formData.password.length < 6) {
      alert("Password is too short. Please use at least 6 characters.");
      return;
    }

    // --- SIGN UP LOGIC ---
    if (!isLogin) {
      const trimmedName = formData.name.trim();
      
      if (!trimmedName) {
        alert("Please enter your name to create an account.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match. Please check again.");
        return;
      }

      const newUser = {
        name: trimmedName,
        email: normalizedEmail,
        password: formData.password
      };
      
      localStorage.setItem("terabyte_registered_user", JSON.stringify(newUser));
      
      alert("Account created successfully! Please Log In with your new credentials.");
      
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setIsLogin(true); 
      return;
    }

    // --- SIGN IN LOGIC (Failsafe Memory Check) ---
    if (isLogin) {
      const storedUserData = localStorage.getItem("terabyte_registered_user");
      
      if (!storedUserData) {
        alert("Account not found! Please switch to 'Sign Up' and create an account first.");
        return;
      }

      const registeredUser = JSON.parse(storedUserData);

      const storedEmailNormalized = (registeredUser.email || "").toLowerCase().trim();

      if (normalizedEmail !== storedEmailNormalized || formData.password !== registeredUser.password) {
        alert("Incorrect Email or Password. Please try again.");
        return;
      }

      // SUCCESSFUL LOGIN
      login({ name: registeredUser.name, email: storedEmailNormalized });
      alert(`Welcome back, ${registeredUser.name}!`);
      navigate('/products');
    }
  };

  return (
    <div className={`min-h-[80vh] flex flex-col items-center justify-center py-20 px-6 selection:bg-[#D4AF37] selection:text-white transition-colors duration-500 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F9F6F0]'}`}>
      <div className="w-full max-w-md animate-slideUp">
        
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-black italic tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {isLogin ? 'Welcome Back' : 'Join Terabyte'}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mt-2">
            {isLogin ? 'Login to your account' : 'Create your new profile'}
          </p>
        </div>

        <div className={`border p-8 md:p-10 rounded-[30px] md:rounded-[40px] shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-100'}`}>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {!isLogin && (
              <div className="space-y-1 animate-slideUp">
                <label htmlFor="name-field" className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                <input 
                  id="name-field"
                  type="text" 
                  name="name" 
                  placeholder="Arul" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  className={`w-full border rounded-2xl px-6 py-4 text-xs font-bold outline-none transition-all uppercase tracking-widest ${isDarkMode ? 'bg-black text-white border-white/10 focus:border-[#D4AF37]' : 'bg-gray-50/50 text-black border-gray-100 focus:border-black'}`}
                />
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email-field" className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
              <input 
                id="email-field"
                type="email" 
                name="email" 
                placeholder="name@example.com" 
                value={formData.email} 
                onChange={handleInputChange}
                className={`w-full border rounded-2xl px-6 py-4 text-xs font-bold outline-none transition-all ${isDarkMode ? 'bg-black text-white border-white/10 focus:border-[#D4AF37]' : 'bg-gray-50/50 text-black border-gray-100 focus:border-black'}`}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password-field" className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Password</label>
              <input 
                id="password-field"
                type="password" 
                name="password" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleInputChange}
                className={`w-full border rounded-2xl px-6 py-4 text-xs font-bold outline-none transition-all ${isDarkMode ? 'bg-black text-white border-white/10 focus:border-[#D4AF37]' : 'bg-gray-50/50 text-black border-gray-100 focus:border-black'}`}
              />
            </div>

            {!isLogin && (
              <div className="space-y-1 animate-slideUp">
                <label htmlFor="confirm-password-field" className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Confirm Password</label>
                <input 
                  id="confirm-password-field"
                  type="password" 
                  name="confirmPassword" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange}
                  className={`w-full border rounded-2xl px-6 py-4 text-xs font-bold outline-none transition-all ${isDarkMode ? 'bg-black text-white border-white/10 focus:border-[#D4AF37]' : 'bg-gray-50/50 text-black border-gray-100 focus:border-black'}`}
                />
              </div>
            )}

            <button 
              type="submit" 
              className={`w-full py-5 rounded-full text-[10px] font-black uppercase tracking-widest mt-6 transition-all active:scale-95 shadow-md cursor-pointer font-black ${isDarkMode ? 'bg-[#D4AF37] text-black hover:bg-white' : 'bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:text-black'}`}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className={`mt-8 text-center pt-6 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
            <button 
              type="button"
              onClick={() => {
                playPremiumBeep();
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }} 
              className="text-[9px] font-black uppercase text-gray-500 hover:text-[#D4AF37] transition-colors underline underline-offset-8 cursor-pointer"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Auth;