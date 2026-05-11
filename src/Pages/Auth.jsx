import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useCart();
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

  // --- 1. VISUAL AUTO-CORRECTION ---
  // User type pannum bodhey email field-ai force panni lowercase mathidrom
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'email' ? value.toLowerCase() : value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

      // CRITICAL FIX: Stored email-aiyum naama lowercase mathi thaan compare pandrom.
      // Idhu unga browser-la pazhaya caps data irundhalum crash aagama pathukkum!
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
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F9F6F0] py-20 px-6 selection:bg-[#D4AF37] selection:text-white">
      <div className="w-full max-w-md animate-slideUp">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-black">
            {isLogin ? 'Welcome Back' : 'Join Terabyte'}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mt-2">
            {isLogin ? 'Login to your account' : 'Create your new profile'}
          </p>
        </div>

        <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-[30px] md:rounded-[40px] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            
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
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-black transition-all text-black uppercase tracking-widest"
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
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-black transition-all text-black"
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
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-black transition-all text-black"
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
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-black transition-all text-black"
                />
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#1A1A1A] text-white py-5 rounded-full text-[10px] font-black uppercase tracking-widest mt-6 hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95 shadow-md"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }} 
              className="text-[9px] font-black uppercase text-gray-500 hover:text-black transition-colors underline underline-offset-8"
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