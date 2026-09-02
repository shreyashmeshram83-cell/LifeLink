import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Heart, Mail, Phone, User, Lock, LogIn } from 'lucide-react';

export function LoginPage() {
  const { login, requestLocation } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'hospital' | 'donor' | 'admin'>('donor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Admin login - only needs email and password
      if (selectedRole === 'admin') {
        if (!email.trim() || !password.trim()) {
          setError('Please fill in all fields');
          setIsLoading(false);
          return;
        }

        const adminEmail = 'admin@lifelink.com';
        const adminPassword = 'admin123';

        if (email.toLowerCase() !== adminEmail || password !== adminPassword) {
          setError('Invalid admin credentials');
          setIsLoading(false);
          return;
        }

        // For admin, use email as name
        login(email, email, 'admin', selectedRole);
      } else {
        // Other roles - need name, email, phone
        // Request location permission
        await requestLocation();
        
        if (!name.trim() || !email.trim() || !phone.trim()) {
          setError('Please fill in all fields');
          setIsLoading(false);
          return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError('Please enter a valid email');
          setIsLoading(false);
          return;
        }

        // Login user
        login(name, email, phone, selectedRole);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="font-display text-2xl font-bold text-ink-900">LifeLink</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-900 mb-2">Welcome Back</h1>
          <p className="text-ink-500">Sign in to continue saving lives</p>
        </div>

        {/* Login Card */}
        <div className="card p-8 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {selectedRole !== 'admin' && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-ink-900 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-ink-900 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91-9876543210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-ink-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'admin@lifelink.com' : 'you@example.com'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-ink-900 mb-3">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'patient', label: 'Patient', emoji: '🏥' },
                  { value: 'hospital', label: 'Hospital', emoji: '🏨' },
                  { value: 'donor', label: 'Donor', emoji: '💉' },
                  { value: 'admin', label: 'Admin', emoji: '⚙️' },
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value as any)}
                    disabled={isLoading}
                    className={`p-3 rounded-lg border-2 transition-all font-medium ${
                      selectedRole === role.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-ink-200 bg-white text-ink-600 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{role.emoji}</div>
                    <div className="text-xs">{role.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location Permission Notice */}
            {selectedRole !== 'admin' && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-700">
                  📍 We'll request your location to find nearby hospitals and donors
                </p>
              </div>
            )}

            {/* Admin Password Field */}
            {selectedRole === 'admin' && (
              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-2">Admin Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-semibold"
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>


          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-ink-500 mt-6">
          <p>By signing in, you agree to our</p>
          <p className="text-primary-600 font-medium cursor-pointer hover:underline">
            Terms of Service & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
