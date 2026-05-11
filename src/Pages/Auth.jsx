import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useCart();
  const navigate = useNavigate();

  // Form state structure
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Basic Empty Validation
    if (!formData.email || !formData.password) {
      alert("Please enter your email and password to continue.");
      return;
    }

    // 2. Minimum Password Length check
    if (formData.password.length < 6) {
      alert("Password is too short. Please use at least 6 characters.");
      return;
    }

    // --- LOGIC FOR SIGN UP (Create Account) ---
    if (!isLogin) {
      if (!formData.name) {
        alert("Please enter your name to create an account.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match. Please check again.");
        return;
      }

      // Store the registered user details in LocalStorage
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      localStorage.setItem("terabyte_registered_user", JSON.stringify(newUser));
      
      alert("Account created successfully! Please Log In with your new credentials.");
      
      // Clear form and switch mode to Sign In
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setIsLogin(true); 
      return;
    }

    // --- LOGIC FOR SIGN IN (Strict Check) ---
    if (isLogin) {
      // Fetch the registered user from memory
      const storedUserData = localStorage.getItem("terabyte_registered_user");
      
      if (!storedUserData) {
        alert("Account not found! Please switch to 'Sign Up' and create an account first.");
        return;
      }

      const registeredUser = JSON.parse(storedUserData);

      // Verify email and password matching
      if (formData.email !== registeredUser.email || formData.password !== registeredUser.password) {
        alert("Incorrect Email or Password. Please try again.");
        return;
      }

      // SUCCESSFUL LOGIN
      login({ name: registeredUser.name, email: registeredUser.email });
      alert(`Welcome back, ${registeredUser.name}!`);
      navigate('/products');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white py-20 px-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-black">
            {isLogin ? 'Welcome Back' : 'Join Terabyte'}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mt-2">
            {isLogin ? 'Login to your account' : 'Create your new profile'}
          </p>
        </div>

        <div className="bg-[#F9F9F9] border border-gray-100 p-10 rounded-[40px] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1 animate-slideUp">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                <input 
                  type="text" name="name" placeholder="Arul" 
                  value={formData.name} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-black transition-all text-black uppercase tracking-widest"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <input 
                type="email" name="email" placeholder="name@example.com" 
                value={formData.email} onChange={handleInputChange}
                className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-black transition-all text-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <input 
                type="password" name="password" placeholder="••••••••" 
                value={formData.password} onChange={handleInputChange}
                className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-black transition-all text-black"
              />
            </div>

            {!isLogin && (
              <div className="space-y-1 animate-slideUp">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirm Password</label>
                <input 
                  type="password" name="confirmPassword" placeholder="••••••••" 
                  value={formData.confirmPassword} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-black transition-all text-black"
                />
              </div>
            )}

            <button type="submit" className="w-full bg-black text-white py-5 rounded-full text-[10px] font-black uppercase tracking-widest mt-6 hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95 shadow-md">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' }); // Reset values on switch
              }} 
              className="text-[9px] font-black uppercase text-gray-400 hover:text-black transition-colors underline underline-offset-8"
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