import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Activity, 
  Droplet, 
  Calendar, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Loader2,
  Check,
  X,
  UserCircle
} from 'lucide-react';
import { 
  loginWithEmail, 
  registerWithEmail, 
  signInWithGoogle, 
  isUsernameAvailable 
} from '../../services/authService';
import { useNavigate } from 'react-router-dom';

// --- Validation Schemas ---

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
  age: z.number().min(1, 'Age is required').max(120, 'Invalid age'),
  gender: z.enum(['Male', 'Female', 'Other']),
  bp: z.string().regex(/^\d{2,3}\/\d{2,3}$/, 'Format must be Systolic/Diastolic (e.g. 120/80)').optional().or(z.literal('')),
  sugar: z.string().regex(/^\d+$/, 'Must be a numeric value').optional().or(z.literal('')),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  initialMode?: 'login' | 'register';
}

export default function AuthForm({ initialMode = 'login' }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  
  const navigate = useNavigate();

  // --- Forms ---

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      age: 25,
      gender: 'Male',
      bp: '',
      sugar: ''
    }
  });

  const username = registerForm.watch('username');

  // --- Effects ---

  // Debounced username check
  useEffect(() => {
    if (!isLogin && username && username.length >= 3) {
      setUsernameStatus('checking');
      const timer = setTimeout(async () => {
        const available = await isUsernameAvailable(username);
        setUsernameStatus(available ? 'available' : 'taken');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUsernameStatus('idle');
    }
  }, [username, isLogin]);

  // --- Handlers ---

  const onLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await loginWithEmail(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    if (usernameStatus === 'taken') {
      setError('Username is already taken');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { email, password, ...profileData } = data;
      await registerWithEmail(email, password, {
        ...profileData,
        age: Number(profileData.age)
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const { isNewUser } = await signInWithGoogle();
      if (isNewUser) {
        // Optionally redirect to profile completion if needed
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6">
      <motion.div 
        layout
        className="glass-card rounded-[2rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        {/* Decorative Background Blob */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full" />

        <div className="text-center space-y-2 mb-8 relative">
          <h2 className="text-3xl font-extrabold heading-font text-white italic">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-400 text-sm">
            {isLogin 
              ? 'Access your health insights' 
              : 'Join SymptoSense for personalized analysis'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Tab Toggle */}
        <div className="flex bg-slate-800/50 p-1 rounded-xl mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              !isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            >
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    {...loginForm.register('email')}
                    type="email"
                    placeholder="name@company.com"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-base"
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-[10px] text-red-400 ml-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">

                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-medium text-slate-500">Password</label>
                  <a href="#" className="text-[10px] text-blue-400 hover:underline">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    {...loginForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-[10px] text-red-400 ml-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Sign In <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            >
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 ml-1">Full Name</label>
                <div className="relative group">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    {...registerForm.register('fullName')}
                    placeholder="John Doe"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-base"
                  />
                </div>
                {registerForm.formState.errors.fullName && (
                  <p className="text-[10px] text-red-400 ml-1">{registerForm.formState.errors.fullName.message}</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    {...registerForm.register('username')}
                    placeholder="johndoe123"
                    className={`w-full bg-slate-900/50 border rounded-xl py-3.5 pl-12 pr-10 text-white focus:outline-none transition-all text-base ${
                      usernameStatus === 'available' ? 'border-green-500/50' : 
                      usernameStatus === 'taken' ? 'border-red-500/50' : 'border-slate-800'
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {usernameStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                    {usernameStatus === 'available' && <Check className="w-4 h-4 text-green-400" />}
                    {usernameStatus === 'taken' && <X className="w-4 h-4 text-red-400" />}
                  </div>
                </div>
                {registerForm.formState.errors.username && (
                  <p className="text-[10px] text-red-400 ml-1">{registerForm.formState.errors.username.message}</p>
                )}
                {usernameStatus === 'taken' && !registerForm.formState.errors.username && (
                  <p className="text-[10px] text-red-400 ml-1">This username is already taken</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    {...registerForm.register('email')}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-base"
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-[10px] text-red-400 ml-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    {...registerForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                  />
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-[10px] text-red-400 ml-1 leading-tight">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              {/* Age & Gender Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 ml-1">Age</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      {...registerForm.register('age', { valueAsNumber: true })}
                      type="number"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-base"
                    />
                  </div>
                  {registerForm.formState.errors.age && (
                    <p className="text-[10px] text-red-400 ml-1">{registerForm.formState.errors.age.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 ml-1">Gender</label>
                  <select
                    {...registerForm.register('gender')}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-base appearance-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Health Metrics Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 ml-1">BP (Opt)</label>
                  <div className="relative group">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      {...registerForm.register('bp')}
                      placeholder="120/80"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-base"
                    />
                  </div>
                  {registerForm.formState.errors.bp && (
                    <p className="text-[10px] text-red-400 ml-1">{registerForm.formState.errors.bp.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 ml-1">Sugar (Opt)</label>
                  <div className="relative group">
                    <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      {...registerForm.register('sugar')}
                      placeholder="mg/dL"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-base"
                    />
                  </div>

                  {registerForm.formState.errors.sugar && (
                    <p className="text-[10px] text-red-400 ml-1">{registerForm.formState.errors.sugar.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || usernameStatus === 'checking'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 group mt-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Sign Up <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="my-8 flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-slate-800" />
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Or continue with</span>
          <div className="h-[1px] flex-1 bg-slate-800" />
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-3 px-4 glass-card rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-3 hover:bg-slate-800/80 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google Account
        </button>

        <p className="text-center mt-8 text-xs text-slate-500">
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and{' '}
          <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>.
        </p>
      </motion.div>
      
      {/* Styles for the custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}
