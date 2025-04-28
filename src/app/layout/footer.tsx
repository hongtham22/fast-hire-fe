import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-40">
      <div className="grid grid-cols-4 gap-16">
        {/* Logo + Description */}
        <div className="flex flex-col gap-6">
          <div className="text-3xl font-extrabold text-orange-primary tracking-wide">
            FastHire
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            We’re more than a traditional recruiting platform. 
            At our core, we’re driven by a commitment to improve lives 
            and connect talents with meaningful opportunities.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Follow us</span>
            <a href="#" className="text-white hover:text-orange-primary text-sm font-semibold transition">
              Facebook
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="text-gray-400 text-sm mb-6">Explore</h3>
          <ul className="flex flex-col gap-4 font-semibold text-lg">
            <li><a href="/about-us" className="hover:text-orange-primary transition">About us</a></li>
            <li><a href="/life" className="hover:text-orange-primary transition">Life @FastHire</a></li>
            <li><a href="/case-studies" className="hover:text-orange-primary transition">Case Studies</a></li>
          </ul>
        </div>

        {/* Products Links */}
        <div>
          <h3 className="text-gray-400 text-sm mb-6">Products</h3>
          <ul className="flex flex-col gap-4 font-semibold text-lg">
            <li><a href="/products" className="hover:text-orange-primary transition">Products</a></li>
            <li><a href="/careers" className="hover:text-orange-primary transition">Careers</a></li>
            <li><a href="/blogs" className="hover:text-orange-primary transition">Blogs</a></li>
          </ul>
        </div>

        {/* Address */}
        <div className="text-sm text-gray-400">
          <h3 className="mb-6 text-gray-400 text-sm">Address</h3>
          <div className="mb-4">
            <p className="text-white">Floor 11, VINA BUILDING,</p>
            <p>131 Xo Viet Nghe Tinh, Ward 17, Binh Thanh District, HCMC, Vietnam</p>
          </div>
          <div className="mb-4">
            <p className="text-white">Diamond Time Complex,</p>
            <p>35 Thai Phien Street, Phuoc Ninh Ward, Hai Chau District, Danang, Vietnam</p>
          </div>
          <div>
            <p className="text-white">Floor 3, Dolphin Plaza Tower,</p>
            <p>28 Tran Binh, My Dinh 2 Ward, Nam Tu Liem District, Hanoi, Vietnam</p>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-16 border-t border-gray-700 pt-6 flex justify-between text-gray-500 text-sm">
        <p>©2025 FastHire, all rights reserved</p>
        <div className="flex gap-8">
          <p>info@fasthire.vn</p>
          <p>(84)-838-633-399</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
