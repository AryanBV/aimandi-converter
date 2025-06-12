'use client';

import { useState } from 'react';
import FileConverter from '@/components/converter/FileConverter';
import RecentConversions from '@/components/converter/RecentConversions';

export default function Home() {
  const [activeTab, setActiveTab] = useState('converter');

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white font-sans relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-[-2]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(102,126,234,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(245,87,108,0.15)_0%,transparent_50%),radial-gradient(circle_at_40%_40%,rgba(79,172,254,0.15)_0%,transparent_50%)]"></div>
      </div>

      {/* Floating Shapes */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute w-[200px] h-[200px] top-[10%] left-[10%] bg-gradient-to-r from-[rgba(102,126,234,0.1)] to-[rgba(245,87,108,0.1)] rounded-full animate-[float_20s_infinite_linear]"></div>
        <div className="absolute w-[150px] h-[150px] top-[60%] right-[10%] bg-gradient-to-r from-[rgba(102,126,234,0.1)] to-[rgba(245,87,108,0.1)] rounded-full animate-[float_20s_infinite_linear] [animation-delay:7s]"></div>
        <div className="absolute w-[100px] h-[100px] bottom-[20%] left-[20%] bg-gradient-to-r from-[rgba(102,126,234,0.1)] to-[rgba(245,87,108,0.1)] rounded-full animate-[float_20s_infinite_linear] [animation-delay:14s]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-[#1a1a2e] backdrop-blur-[20px] border-b border-[rgba(255,255,255,0.1)] px-5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-[70px]">
          {/* Logo */}
          <a href="/" className="flex items-center gap-[5px] text-white no-underline text-[1.8rem] font-[800]">
            <span className="bg-[#667eea] text-white px-2 py-1 rounded-md">AI</span>
            <span>Mandi</span>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-[35px]">
            {/* Services Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-[5px] cursor-pointer text-[#b8b8d1] hover:text-white transition-colors duration-300 font-medium">
                Services
                <span className="text-[0.7rem] transition-transform duration-300 group-hover:rotate-180">▼</span>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-[-150px] bg-[#1a1a2e] border border-[rgba(255,255,255,0.1)] rounded-[20px] p-5 mt-[15px] opacity-0 invisible translate-y-[-10px] transition-all duration-300 w-[600px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] grid grid-cols-2 gap-[30px] group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-[15px] p-5">
                  <h3 className="text-[1.1rem] font-bold mb-5 text-white">PDF Tools</h3>
                  <div className="flex flex-col gap-[15px]">
                    <a href="#" className="flex items-center gap-3 text-[#b8b8d1] no-underline p-[10px] rounded-[10px] transition-all duration-300 hover:bg-[rgba(102,126,234,0.1)] hover:text-white hover:translate-x-[5px]">
                      <span className="w-6 h-6 flex items-center justify-center text-[1.2rem]">🔄</span>
                      <span>Organize PDF</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-[#b8b8d1] no-underline p-[10px] rounded-[10px] transition-all duration-300 hover:bg-[rgba(102,126,234,0.1)] hover:text-white hover:translate-x-[5px]">
                      <span className="w-6 h-6 flex items-center justify-center text-[1.2rem]">🔧</span>
                      <span>Convert PDF</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-[#b8b8d1] no-underline p-[10px] rounded-[10px] transition-all duration-300 hover:bg-[rgba(102,126,234,0.1)] hover:text-white hover:translate-x-[5px]">
                      <span className="w-6 h-6 flex items-center justify-center text-[1.2rem]">✏️</span>
                      <span>Edit PDF</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-[#b8b8d1] no-underline p-[10px] rounded-[10px] transition-all duration-300 hover:bg-[rgba(102,126,234,0.1)] hover:text-white hover:translate-x-[5px]">
                      <span className="w-6 h-6 flex items-center justify-center text-[1.2rem]">🔒</span>
                      <span>PDF Security</span>
                    </a>
                  </div>
                </div>
                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-[15px] p-5">
                  <h3 className="text-[1.1rem] font-bold mb-5 text-white">Image Tools</h3>
                  <div className="flex flex-col gap-[15px]">
                    <a href="#" className="flex items-center gap-3 text-[#b8b8d1] no-underline p-[10px] rounded-[10px] transition-all duration-300 hover:bg-[rgba(102,126,234,0.1)] hover:text-white hover:translate-x-[5px]">
                      <span className="w-6 h-6 flex items-center justify-center text-[1.2rem]">🖼️</span>
                      <span>Image Generator</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-[#b8b8d1] no-underline p-[10px] rounded-[10px] transition-all duration-300 hover:bg-[rgba(102,126,234,0.1)] hover:text-white hover:translate-x-[5px]">
                      <span className="w-6 h-6 flex items-center justify-center text-[1.2rem]">👤</span>
                      <span>AI Headshot</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-[#b8b8d1] no-underline p-[10px] rounded-[10px] transition-all duration-300 hover:bg-[rgba(102,126,234,0.1)] hover:text-white hover:translate-x-[5px]">
                      <span className="w-6 h-6 flex items-center justify-center text-[1.2rem]">📐</span>
                      <span>Background Remover</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-[#b8b8d1] no-underline p-[10px] rounded-[10px] transition-all duration-300 hover:bg-[rgba(102,126,234,0.1)] hover:text-white hover:translate-x-[5px]">
                      <span className="w-6 h-6 flex items-center justify-center text-[1.2rem]">📏</span>
                      <span>Image Resizer</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-[#b8b8d1] no-underline p-[10px] rounded-[10px] transition-all duration-300 hover:bg-[rgba(102,126,234,0.1)] hover:text-white hover:translate-x-[5px]">
                      <span className="w-6 h-6 flex items-center justify-center text-[1.2rem]">🔍</span>
                      <span>Image Upscaler</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <a href="#pricing" className="text-[#b8b8d1] no-underline font-medium transition-colors duration-300 hover:text-white">Pricing</a>
            <a href="#about" className="text-[#b8b8d1] no-underline font-medium transition-colors duration-300 hover:text-white">About Us</a>
            
            <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-none px-5 py-[10px] rounded-[25px] font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2 hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(102,126,234,0.3)]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.20456C17.64 8.56637 17.5827 7.95274 17.4764 7.36365H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8196H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20456Z" fill="white"/>
                <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="white"/>
                <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59319 3.68182 9.00001C3.68182 8.40683 3.78409 7.83001 3.96409 7.29001V4.95819H0.957273C0.347727 6.17319 0 7.54774 0 9.00001C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="white"/>
                <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="white"/>
              </svg>
              Sign In with Google
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="mt-[90px] p-5">
        {/* Tabs */}
        <div className="max-w-[1400px] mx-auto mb-[30px] flex gap-5 justify-center">
          <button 
            className={`px-[30px] py-3 rounded-[25px] font-semibold cursor-pointer transition-all duration-300 text-base border ${
              activeTab === 'converter' 
                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent translate-y-[-2px]'
                : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#b8b8d1] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white hover:border-transparent hover:translate-y-[-2px]'
            }`}
            onClick={() => setActiveTab('converter')}
          >
            File Converter
          </button>
          <button 
            className={`px-[30px] py-3 rounded-[25px] font-semibold cursor-pointer transition-all duration-300 text-base border ${
              activeTab === 'recent' 
                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent translate-y-[-2px]'
                : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#b8b8d1] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white hover:border-transparent hover:translate-y-[-2px]'
            }`}
            onClick={() => setActiveTab('recent')}
          >
            Recent Conversions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'converter' && <FileConverter />}
        {activeTab === 'recent' && <RecentConversions />}
      </div>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] border-t border-[rgba(255,255,255,0.1)] mt-20 p-[40px_20px_20px]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10 mb-[30px]">
          <div>
            <h3 className="text-white text-[1.2rem] mb-5 font-bold">About AIMandi</h3>
            <p className="text-[#b8b8d1] leading-[1.6]">
              Transform your files with AI-powered conversion technology. Fast, secure, and reliable file conversions at your fingertips.
            </p>
          </div>
          <div>
            <h3 className="text-white text-[1.2rem] mb-5 font-bold">Quick Links</h3>
            <div className="flex flex-col gap-3">
              <a href="#services" className="text-[#b8b8d1] no-underline transition-colors duration-300 hover:text-white">Services</a>
              <a href="#pricing" className="text-[#b8b8d1] no-underline transition-colors duration-300 hover:text-white">Pricing</a>
              <a href="#about" className="text-[#b8b8d1] no-underline transition-colors duration-300 hover:text-white">About Us</a>
              <a href="#contact" className="text-[#b8b8d1] no-underline transition-colors duration-300 hover:text-white">Contact</a>
            </div>
          </div>
          <div>
            <h3 className="text-white text-[1.2rem] mb-5 font-bold">Support</h3>
            <div className="flex flex-col gap-3">
              <a href="#help" className="text-[#b8b8d1] no-underline transition-colors duration-300 hover:text-white">Help Center</a>
              <a href="#faq" className="text-[#b8b8d1] no-underline transition-colors duration-300 hover:text-white">FAQ</a>
              <a href="#privacy" className="text-[#b8b8d1] no-underline transition-colors duration-300 hover:text-white">Privacy Policy</a>
              <a href="#terms" className="text-[#b8b8d1] no-underline transition-colors duration-300 hover:text-white">Terms of Service</a>
            </div>
          </div>
          <div>
            <h3 className="text-white text-[1.2rem] mb-5 font-bold">Connect</h3>
            <div className="flex flex-col gap-3">
              <a href="mailto:support@aimandi.in" className="text-[#b8b8d1] no-underline transition-colors duration-300 hover:text-white">support@aimandi.in</a>
              <a href="tel:+911234567890" className="text-[#b8b8d1] no-underline transition-colors duration-300 hover:text-white">+91 123 456 7890</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto pt-[30px] border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between flex-wrap gap-5">
          <div className="text-[#b8b8d1] text-[0.9rem]">
            © 2024 AIMandi. All rights reserved.
          </div>
          <div className="flex gap-[15px]">
            {[
              "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
              "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
              "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z",
              "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
            ].map((path, index) => (
              <a key={index} href="#" className="w-10 h-10 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full flex items-center justify-center text-[#b8b8d1] no-underline transition-all duration-300 hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white hover:border-transparent hover:translate-y-[-3px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d={path}/>
                </svg>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}