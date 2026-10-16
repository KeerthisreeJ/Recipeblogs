import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  PlusCircle, 
  User, 
  Bookmark, 
  LogOut, 
  Menu, 
  X, 
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully. See you soon!');
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-brand-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <span className="text-xl">🍓</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-brand-800 transition-colors">
                  Kittyeats<span className="text-brand-800">.</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-400 -mt-1">
                  Culinary Journal
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/' && !location.search
                    ? 'text-brand-800 font-semibold'
                    : 'text-stone-600 hover:text-brand-800'
                }`}
              >
                Discover
              </Link>
              <Link
                to="/?category=Dessert"
                className="text-sm font-medium text-stone-600 hover:text-brand-800 transition-colors"
              >
                Desserts
              </Link>
              <Link
                to="/?category=Pasta"
                className="text-sm font-medium text-stone-600 hover:text-brand-800 transition-colors"
              >
                Pasta
              </Link>
              <Link
                to="/?category=Breakfast"
                className="text-sm font-medium text-stone-600 hover:text-brand-800 transition-colors"
              >
                Brunch
              </Link>
            </nav>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center relative max-w-xs w-full"
          >
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search recipes, ingredients..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full bg-[#FAF7F2] text-sm text-stone-800 placeholder-stone-400 pl-10 pr-4 py-2 rounded-full border border-stone-200/80 focus:outline-none focus:border-brand-800 focus:bg-white transition-all shadow-inner"
            />
          </form>

          <div className="flex items-center gap-3">
            <Link
              to="/create"
              className="hidden sm:inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-200 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share Recipe</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-stone-200 hover:border-brand-300 transition-colors focus:outline-none ring-2 ring-transparent focus:ring-brand-100"
                  aria-expanded={dropdownOpen}
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={user?.name || 'User'}
                    className="w-9 h-9 rounded-full object-cover border border-white shadow-sm"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-card border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="text-sm font-semibold text-stone-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-stone-500 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-blush-50 hover:text-brand-800 transition-colors"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        <span>My Profile & Recipes</span>
                      </Link>

                      <Link
                        to="/profile?tab=saved"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-blush-50 hover:text-brand-800 transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-stone-400" />
                        <span>Saved Bookmarks</span>
                      </Link>

                      <Link
                        to="/create"
                        onClick={() => setDropdownOpen(false)}
                        className="flex sm:hidden items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-blush-50 hover:text-brand-800 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4 text-stone-400" />
                        <span>Share New Recipe</span>
                      </Link>
                    </div>

                    <div className="border-t border-stone-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 hover:bg-red-50 hover:text-brand-800 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-stone-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-stone-700 hover:text-brand-800 font-medium text-sm px-3.5 py-2 rounded-full hover:bg-stone-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-stone-900 hover:bg-brand-800 text-white font-medium text-sm px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  Join
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 animate-in slide-in-from-top-3">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full bg-[#FAF7F2] text-sm pl-9 pr-4 py-2 rounded-full border border-stone-200"
              />
            </div>
          </form>

          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              className="px-3 py-2 text-stone-800 font-medium hover:bg-blush-50 hover:text-brand-800 rounded-lg"
            >
              Discover All Recipes
            </Link>
            <Link
              to="/?category=Breakfast"
              className="px-3 py-2 text-stone-600 hover:bg-blush-50 hover:text-brand-800 rounded-lg"
            >
              Brunch & Breakfast
            </Link>
            <Link
              to="/?category=Pasta"
              className="px-3 py-2 text-stone-600 hover:bg-blush-50 hover:text-brand-800 rounded-lg"
            >
              Artisanal Pasta
            </Link>
            <Link
              to="/?category=Dessert"
              className="px-3 py-2 text-stone-600 hover:bg-blush-50 hover:text-brand-800 rounded-lg"
            >
              Pastries & Desserts
            </Link>
            <Link
              to="/?category=Dinner"
              className="px-3 py-2 text-stone-600 hover:bg-blush-50 hover:text-brand-800 rounded-lg"
            >
              Dinner Escapes
            </Link>

            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              <Link
                to="/create"
                className="flex items-center justify-center gap-2 bg-brand-800 text-white py-2.5 rounded-full font-medium text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Share a Recipe</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
