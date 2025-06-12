'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, profile, statistics, loading, signInWithGoogle, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.style.background = 'linear-gradient(to right, #ff5757, #ff8a80)';
      notification.textContent = '❌ Sign in failed. Please try again.';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = '✅ Successfully signed out';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
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
          
          {/* Authentication Area */}
          {loading ? (
            <div className="w-8 h-8 border-2 border-[#667eea] border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] px-4 py-2 rounded-[25px] font-semibold cursor-pointer transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:translate-y-[-2px]"
              >
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center text-sm font-bold">
                    {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <span className="hidden sm:block">
                  {profile?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
                <span className="text-[0.7rem] transition-transform duration-300">▼</span>
              </button>

              {/* User Menu */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 bg-[#1a1a2e] border border-[rgba(255,255,255,0.1)] rounded-[15px] py-2 w-64 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] z-50">
                  <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.1)]">
                    <div className="font-semibold text-white">
                      {profile?.full_name || 'User'}
                    </div>
                    <div className="text-[0.85rem] text-[#b8b8d1]">
                      {user.email}
                    </div>
                    {statistics && (
                      <div className="text-[0.75rem] text-[#b8b8d1] mt-1">
                        {statistics.total_conversions} conversions completed
                      </div>
                    )}
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Add profile management functionality here
                      }}
                      className="w-full text-left px-4 py-2 text-[#b8b8d1] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-200"
                    >
                      👤 Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Add billing functionality here
                      }}
                      className="w-full text-left px-4 py-2 text-[#b8b8d1] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-200"
                    >
                      💳 Billing
                    </button>
                    <div className="border-t border-[rgba(255,255,255,0.1)] my-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-[#ff5757] hover:bg-[rgba(255,87,87,0.1)] transition-colors duration-200"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={handleSignIn}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-none px-5 py-[10px] rounded-[25px] font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2 hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(102,126,234,0.3)]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.20456C17.64 8.56637 17.5827 7.95274 17.4764 7.36365H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8196H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20456Z" fill="white"/>
                <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="white"/>
                <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59319 3.68182 9.00001C3.68182 8.40683 3.78409 7.83001 3.96409 7.29001V4.95819H0.957273C0.347727 6.17319 0 7.54774 0 9.00001C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="white"/>
                <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="white"/>
              </svg>
              Sign In with Google
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </header>
  );
}