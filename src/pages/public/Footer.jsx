import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Footer = ({className}) => {
  return (
    <footer className={`bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-6 md:px-12 ${className}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Column */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <span>Escrow</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Secure peer-to-peer escrow platform built for reliable USD transactions. We hold funds safely until both parties fulfill their commitments.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Navigation</h4>
          <Link to="/" className="text-xs hover:text-emerald-400 transition-colors">Home</Link>
          <Link to="/login" className="text-xs hover:text-emerald-400 transition-colors">Sign In</Link>
          <Link to="/register" className="text-xs hover:text-emerald-400 transition-colors">Get Started</Link>
        </div>

        {/* Security & Trust */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Security & Trust</h4>
          <span className="text-xs text-slate-500">Buyer & Seller Protection</span>
          <span className="text-xs text-slate-500">Admin Dispute Policy</span>
          <span className="text-xs text-slate-500">Virtual Pool Audits</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>&copy; {new Date().getFullYear()} Escrow. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Escrow Node Operational</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;