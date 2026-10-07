import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-[#0e0e0e] light:bg-neutral-100 border-t-2 border-[#e50914] text-neutral-400 light:text-neutral-600 text-xs py-14 px-4 md:px-12 select-none transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2.5">
            <a href="#audio" onClick={(e) => e.preventDefault()} className="block hover:underline hover:text-white light:hover:text-black transition-colors">
              Audio Description
            </a>
            <a href="#help" onClick={(e) => e.preventDefault()} className="block hover:underline hover:text-white light:hover:text-black transition-colors">
              Help Centre
            </a>
            <a href="#gift" onClick={(e) => e.preventDefault()} className="block hover:underline hover:text-white light:hover:text-black transition-colors">
              Gift Cards
            </a>
          </div>

          <div className="space-y-2.5">
            <a href="#media" onClick={(e) => e.preventDefault()} className="block hover:underline hover:text-white light:hover:text-black transition-colors">
              Media Centre
            </a>
            <a href="#investor" onClick={(e) => e.preventDefault()} className="block hover:underline hover:text-white light:hover:text-black transition-colors">
              Investor Relations
            </a>
            <a href="#jobs" onClick={(e) => e.preventDefault()} className="block hover:underline hover:text-white light:hover:text-black transition-colors">
              Jobs
            </a>
          </div>

          <div className="space-y-2.5">
            <a href="#terms" onClick={(e) => e.preventDefault()} className="block hover:underline hover:text-white light:hover:text-black transition-colors">
              Terms of Use
            </a>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="block hover:underline hover:text-white light:hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="#legal" onClick={(e) => e.preventDefault()} className="block hover:underline hover:text-white light:hover:text-black transition-colors">
              Legal Notices
            </a>
          </div>

          <div className="space-y-2.5">
            <a href="#cookies" onClick={(e) => e.preventDefault()} className="block hover:underline hover:text-white light:hover:text-black transition-colors">
              Cookie Preferences
            </a>
            <a href="#corporate" onClick={(e) => e.preventDefault()} className="block hover:underline hover:text-white light:hover:text-black transition-colors">
              Corporate Information
            </a>
            <a href="#contact" onClick={(e) => e.preventDefault()} className="block hover:underline hover:text-white light:hover:text-black transition-colors">
              Contact Us
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800 light:border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <span>&copy; 2026 Streamly Entertainment Inc. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Service Status: All streaming CDN servers operational</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
