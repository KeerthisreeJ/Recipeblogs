import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-stone-200 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-100">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-brand-800 text-white flex items-center justify-center shadow-md">
                <span className="text-lg">🍓</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
                Kittyeats<span className="text-brand-800">.</span>
              </span>
            </Link>
            <p className="mt-4 text-stone-600 text-sm leading-relaxed max-w-md font-sans">
              A serene culinary journal where passionate home chefs and pastry artists gather to share slow-crafted recipes, seasonal feasts, and everyday gourmet rituals.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush-100 text-brand-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> High-End Food Journal
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-stone-900 font-bold text-base mb-4 tracking-wide">
              Culinary Chapters
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li>
                <Link to="/?category=Breakfast" className="hover:text-brand-800 transition-colors">
                  Morning Brunches & Tartines
                </Link>
              </li>
              <li>
                <Link to="/?category=Pasta" className="hover:text-brand-800 transition-colors">
                  Handcrafted Italian Pasta
                </Link>
              </li>
              <li>
                <Link to="/?category=Dessert" className="hover:text-brand-800 transition-colors">
                  Patisserie & Sweet Bites
                </Link>
              </li>
              <li>
                <Link to="/?category=Dinner" className="hover:text-brand-800 transition-colors">
                  Candlelit Dinners
                </Link>
              </li>
              <li>
                <Link to="/?category=Drinks" className="hover:text-brand-800 transition-colors">
                  Botanical Aperitivos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-stone-900 font-bold text-base mb-4 tracking-wide">
              The Sunday Gazette
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed mb-3">
              Receive 3 hand-curated seasonal recipes and styling tips delivered every Sunday morning.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Kittyeats Gazette!'); }} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your.email@kitchen.com"
                required
                className="bg-[#FAF7F2] text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-brand-800"
              />
              <button
                type="submit"
                className="bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Join the Table
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Kittyeats. Crafted with passion & culinary aesthetics.</p>
          <p className="flex items-center gap-1.5 text-stone-500">
            White & Deep Red Design System <span className="text-brand-700">●</span> Built for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
