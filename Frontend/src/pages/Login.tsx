import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BarChart3, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { login as loginApi } from '../services/auth.api';
import type { LoginFormData } from '../types/auth.types';
import axios from 'axios';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/common/ThemeToggle';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginApi(data);
      login(res.token, res.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? 'Login failed. Please try again.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-emerald-700 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">SmartLeads</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Close Deals Quicker With Predictive CRM Tools
          </h1>
          <p className="text-emerald-100 text-lg leading-relaxed">
            Get intelligent deal forecasting, real-time updates, and smart alerts to increase win rates and pipeline health.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[{ label: 'Active Leads', value: '2.4K+' }, { label: 'Win Rate', value: '68%' }, { label: 'Team Members', value: '50+' }].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-emerald-200 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-emerald-200 text-sm">© 2025 SmartLeads. All rights reserved.</p>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">SmartLeads</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="login-form">
            <div>
              <label htmlFor="login-email" className="form-label">Email address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@company.com"
                className="form-input"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
                })}
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="login-password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="form-input pr-10"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  id="toggle-password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-2.5 text-base"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
