import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description Section */}
          <div className="space-y-4">
            <div>
              <a href="/" className="flex items-center">
                <img
                  src="/img/logo.png" // Vite root-relative path
                  alt="Logo"
                  className="h-12"
                  onError={(e) => {
                    console.error("Logo load failed:", {
                      error: e,
                      src: e.target.src,
                      currentSrc: e.target.currentSrc,
                      baseURI: document.baseURI,
                    }); // Detailed logging
                    e.target.src = "https://via.placeholder.com/150"; // Fallback
                  }}
                  onLoad={() => console.log("Logo loaded successfully:", document.baseURI)} // Confirm load
                />
              </a>
            </div>
            <p className="text-gray-600">
              But when shot real her. Chamber her one visite removal six
              sending himself boys scot exquisite existend an
            </p>
            <p className="text-gray-600">But when shot real her hamber her</p>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-800">Newsletter</h4>
            <p className="text-gray-600">
              Stay updated with our latest trends Seed heaven so said place
              winged over given forth fruit.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <i className="ti-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <i className="ti-twitter-alt text-xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <i className="ti-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <i className="ti-skype text-xl"></i>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-800">Contact us</h4>
            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-semibold">Address:</span> Hath of it fly signs bear be one
                blessed after
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Phone:</span> +2 36 265 (8060)
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span> info@colorlib.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="py-6 text-center">
            <p className="text-gray-600">
              Copyright © {new Date().getFullYear()}{" "}
              All rights reserved | This template is made with{" "}
              <i className="ti-heart text-red-500" aria-hidden="true"></i> by{" "}
              <a
                href="https://colorlib.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Colorlib
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;