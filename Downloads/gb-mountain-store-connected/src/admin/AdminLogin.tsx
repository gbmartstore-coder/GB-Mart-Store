import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Mountain, AlertCircle, ArrowLeft, UserCheck } from 'lucide-react';
import { useAuth, ADMIN_EMAILS } from '../admin-system/AuthContext';

interface AdminLoginProps {
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToStore }) => {
  const { user, profile, isAdmin, signInWithGoogle, signInWithEmail, makeAdmin, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bootstrapSuccess, setBootstrapSuccess] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
    } catch (err: any) {
      console.error('Admin email login error:', err);
      setErrorMsg(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Admin google login error:', err);
      setErrorMsg(err?.message || 'Google sign-in was cancelled.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimAdmin = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await makeAdmin(user.uid);
      setBootstrapSuccess('Admin role activated successfully! Refreshing dashboard...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setErrorMsg('Failed to set admin role: ' + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Mountain Ambient Glow */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-600 rounded-full blur-[140px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden shadow-xl shadow-emerald-900/30">
            <img src="/assets/logo.png" alt="Brand logo" className="w-full h-full object-cover" />
          </div>
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Admin Portal Authentication
        </h2>
        <p className="mt-2 text-center text-xs text-stone-400">
          GB Mountain Store • Central Management & Operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-stone-800/10 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {bootstrapSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>{bootstrapSuccess}</span>
            </div>
          )}

          {user && !isAdmin ? (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                <p className="font-bold">You are signed in as:</p>
                <p className="font-mono mt-0.5 text-stone-800">{user.email}</p>
                <p className="mt-2">
                  Your current account role in Firestore is{' '}
                  <span className="font-bold text-amber-800">"customer"</span>.
                </p>
              </div>

              {user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()) ? (
                <>
                  <p className="text-xs text-stone-500">
                    To access the protected admin panel, your Firestore account must have the{' '}
                    <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">admin</code> role.
                  </p>

                  <button
                    id="admin-bootstrap-claim-btn"
                    onClick={handleClaimAdmin}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Initialize & Activate Store Admin Access</span>
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs text-red-700 font-semibold">
                    This account does not have admin access. Please contact the store owner if you believe this is a mistake.
                  </p>
                  <button
                    onClick={() => logout()}
                    className="w-full py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 font-bold text-xs text-stone-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Google Sign-In */}
              <button
                id="admin-google-login-btn"
                type="button"
                disabled={loading}
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 font-semibold text-xs text-stone-800 flex items-center justify-center gap-3 transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.87c2.26-2.09 3.675-5.17 3.675-9.14z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.13C3.25 21.31 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.62H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.38l4.01-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.69 1.26 6.62l4.01 3.13c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
                <span>Sign in with Google (Admin)</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400 absolute">
                  Or Email / Password
                </span>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@gbmountainstore.pk"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin-password-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <button
                  id="admin-submit-login-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Authenticating...' : 'Enter Admin Panel'}</span>
                </button>
              </form>
            </>
          )}

          <div className="pt-4 border-t border-stone-100 text-center">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Website</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
