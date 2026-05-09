import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-32 pb-12 px-6 md:px-10 border-t border-gray-100 mt-40 relative overflow-hidden">
      {/* LUXURY BACKGROUND PATTERN */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-30"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24">
          
          {/* BRAND BLOCK */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-5xl font-black tracking-tighter italic leading-none">
              TERABYTE<span className="text-[#D4AF37]">.</span>
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] leading-relaxed max-w-[250px]">
              The global benchmark for premium electronics and aerospace-grade precision engineering.
            </p>
            
            {/* TEXT-BASED SOCIALS */}
            <div className="flex gap-6 text-[10px] font-black tracking-widest uppercase">
              <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Instagram</span>
              <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">LinkedIn</span>
            </div>
          </div>

          {/* INFORMATION MATRIX */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-12 border-l border-gray-50 md:pl-16">
            <div className="space-y-6">
              <p className="text-[9px] font-black text-[#D4AF37] tracking-[0.5em] uppercase border-b border-[#D4AF37]/20 pb-2 w-fit">Support</p>
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-tight hover:text-[#D4AF37] cursor-pointer">support@terabyte.com</p>
                <p className="text-sm font-bold uppercase tracking-tight hover:text-[#D4AF37] cursor-pointer">+91 98765 43210</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[9px] font-black text-[#D4AF37] tracking-[0.5em] uppercase border-b border-[#D4AF37]/20 pb-2 w-fit">Quick Links</p>
              <ul className="space-y-3 text-[11px] font-black tracking-widest uppercase text-gray-400">
                <li className="hover:text-black transition-all cursor-pointer">Store Archive</li>
                <li className="hover:text-black transition-all cursor-pointer">Tech Labs</li>
                <li className="hover:text-black transition-all cursor-pointer">Our Heritage</li>
              </ul>
            </div>

            <div className="space-y-6">
              <p className="text-[9px] font-black text-[#D4AF37] tracking-[0.5em] uppercase border-b border-[#D4AF37]/20 pb-2 w-fit">Location</p>
              <p className="text-[11px] font-bold text-gray-400 uppercase leading-relaxed tracking-widest">
                Level 42, Terabyte Tower<br />
                BKC, Mumbai 400051<br />
                India
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: THE LUXURY LINE */}
        <div className="border-y border-gray-50 py-16 flex flex-col md:flex-row justify-between items-center group">
          <div className="text-center md:text-left">
              <h3 className="text-4xl font-black tracking-tighter uppercase italic opacity-10 group-hover:opacity-100 transition-opacity duration-1000">
                Arul Hardware Standards
              </h3>
          </div>
          <div className="flex gap-4">
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
              <p className="text-[9px] font-black tracking-[0.4em] uppercase text-gray-300">Active Global Network</p>
          </div>
        </div>

        {/* BOTTOM SECTION: CREDITS */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <p className="text-[9px] font-black text-gray-300 tracking-[0.4em] uppercase">
              © {currentYear} Terabyte Intl.
            </p>
          </div>

          {/* SIGNATURE */}
          <div className="group cursor-default">
            <p className="text-[10px] font-black text-black tracking-[1em] uppercase">
              Architected for <span className="text-[#D4AF37]">Arul</span>
            </p>
          </div>

          <div className="flex gap-6">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Ed. 2.0.26</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;