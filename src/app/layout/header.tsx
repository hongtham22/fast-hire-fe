import React, { useState, useEffect } from 'react';
import Link from 'next/link';

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full ${scrolled ? "bg-white after:content-[''] after:w-full after:h-[2px] after:absolute after:bottom-0 after:left-0 after:bg-gradient-to-r after:from-transparent after:via-orange-primary after:to-transparent shadow-md" : "bg-gray-100"} backdrop-blur-lg  h-[90px] flex items-center px-40 py-4 z-50 transition-all duration-300`}>
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-3xl font-extrabold text-orange-primary tracking-wide">
          FastHire
        </Link>
      </div>

      {/* Navigation - centered */}
      <nav className="flex-1 flex justify-center">
        <ul className="flex space-x-10 text-gray-800 font-medium text-lg">
          {["Home", "Careers", "About Us", "Contact"].map((item, index) => (
            <li key={index} className="relative group">
              <Link 
                href={item === "Home" ? "/" : item === "Careers" ? "/careers" : item === "About Us" ? "/about-us" : "/contact"} 
                className="hover:text-orange-primary transition duration-400"
              >
                {item}
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-primary transition-all duration-400 group-hover:w-full"></span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Empty space for balance */}
      <div className="flex items-center">
      </div>
    </header>
  );
}

export default Header;
