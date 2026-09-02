import { useApp } from '@/context/AppContext';
import { Droplet, Menu, X, Activity, MapPin, Package, Heart, Shield, Bot, LayoutDashboard, Home, LogOut, User, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { view, setView, role, setRole, isLoggedIn, user, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAdmin = role === 'admin' || user?.role === 'admin';

  const navItems = [
    { label: 'Home', view: 'landing' as const, icon: Home },
    { label: 'Nearby', view: 'nearby-emergency' as const, icon: AlertCircle },
    { label: 'Request Blood', view: 'request-form' as const, icon: Droplet },
    { label: 'AI Assistant', view: 'ai-assistant' as const, icon: Bot },
    { label: 'Hospital', view: 'hospital-dashboard' as const, icon: LayoutDashboard },
    { label: 'Donor', view: 'donor-dashboard' as const, icon: Heart },
    { label: 'Inventory', view: 'inventory' as const, icon: Package },
    ...(isAdmin ? [{ label: 'Admin', view: 'admin-dashboard' as const, icon: Shield }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setView('landing')} className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-soft">
                <Droplet className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-lg text-ink-900">LifeLink</span>
            </button>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    view === item.view
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-ink-600 hover:bg-ink-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {isLoggedIn && user && (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs font-medium text-ink-600">
                    {user.name} • {user.role}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="p-2 rounded-lg hover:bg-ink-100 transition-colors"
                    >
                      <User className="w-5 h-5 text-primary-600" />
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-ink-100 animate-fade-in-fast">
                        <div className="p-3 border-b border-ink-100">
                          <p className="text-sm font-semibold text-ink-900">{user.name}</p>
                          <p className="text-xs text-ink-500">{user.email}</p>
                          <p className="text-xs text-ink-500 font-medium mt-1">{user.phone}</p>
                        </div>
                        <div className="p-2 space-y-1">
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium text-sm transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-ink-100"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-ink-100 bg-white animate-fade-in-fast">
            <div className="px-4 py-3 space-y-1">
              {isLoggedIn && user && (
                <div className="p-3 mb-3 rounded-lg bg-primary-50 border border-primary-200">
                  <p className="text-sm font-semibold text-ink-900">{user.name}</p>
                  <p className="text-xs text-ink-600">{user.email}</p>
                  <p className="text-xs text-primary-600 font-medium mt-1">{user.role}</p>
                </div>
              )}
              
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.view}
                    onClick={() => {
                      setView(item.view);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      view === item.view
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-ink-600 hover:bg-ink-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
              
              {isLoggedIn && (
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
              
              {role && (
                <button
                  onClick={() => {
                    setRole(null);
                    setView('landing');
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-500 hover:bg-ink-100"
                >
                  <Activity className="w-4 h-4" />
                  Exit session
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export function BottomNav() {
  const { view, setView, isLoggedIn, role, user } = useApp();

  // Hide bottom nav on login page
  if (!isLoggedIn) {
    return null;
  }

  const isAdmin = isLoggedIn && (role === 'admin' || user?.role === 'admin');

  const items = [
    { label: 'Home', view: 'landing' as const, icon: Home },
    { label: 'Nearby', view: 'nearby-emergency' as const, icon: AlertCircle },
    { label: 'Request', view: 'request-form' as const, icon: Droplet },
    { label: 'Hospital', view: 'hospital-dashboard' as const, icon: LayoutDashboard },
    ...(isAdmin ? [{ label: 'Admin', view: 'admin-dashboard' as const, icon: Shield }] : []),
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-ink-100 safe-area">
      <div className="flex items-center justify-around px-2 py-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${
                active ? 'text-primary-600' : 'text-ink-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
