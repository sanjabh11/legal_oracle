import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Scale, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Outcome Prediction', href: '/outcome-prediction' },
    { name: 'CaseLaw AI', href: '/caselaw-demo' }, // NEW BUTTON
    { name: 'Strategy Optimization', href: '/strategy-optimization' },
    { name: 'Regulatory Forecasting', href: '/regulatory-forecasting' },
    { name: 'Arbitrage Alerts', href: '/arbitrage-alerts' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (location.pathname === '/' && !isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-800" />
              <span className="font-bold text-xl text-gray-900">LEGAL ORACLE</span>
            </Link>
          </div>

          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-blue-800 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700 hidden sm:block">
                      {user?.isGuest ? `Guest (${user.role})` : user?.email}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="inline-block h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="inline-block h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {isAuthenticated && (
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                )}
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-900 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {isOpen && isAuthenticated && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-blue-800 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {/* Quick CaseLaw Search on mobile */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const input = form.querySelector('input[name="quick-caselaw-search"]') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    navigate(`/caselaw-demo?query=${encodeURIComponent(input.value.trim())}`);
                    setIsOpen(false);
                  }
                }}
                className="flex items-center px-3 py-2"
              >
                <input
                  name="quick-caselaw-search"
                  type="text"
                  placeholder="Quick CaseLaw Search"
                  className="flex-1 rounded-l px-2 py-1 border border-gray-300 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-r px-3 py-1 bg-blue-700 text-white text-sm"
                >
                  Go
                </button>
              </form>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-800 hover:bg-blue-50"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-800 hover:bg-blue-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}