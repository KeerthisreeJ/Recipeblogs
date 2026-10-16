import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import CreateEditRecipe from './pages/CreateEditRecipe';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
    <span className="text-6xl mb-4">🥐</span>
    <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2">404 — Page Not Found</h1>
    <p className="text-stone-600 max-w-sm mb-6 text-sm">
      Looks like this culinary page has been eaten or doesn't exist anymore!
    </p>
    <Link
      to="/"
      className="bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-full transition-colors shadow-sm"
    >
      Return to Journal
    </Link>
  </div>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-stone-800 selection:bg-brand-100 selection:text-brand-900">
            <Navbar />
            <div className="flex-1 pb-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />

                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreateEditRecipe />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <ProtectedRoute>
                      <CreateEditRecipe />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/profile/:id" element={<Profile />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;

