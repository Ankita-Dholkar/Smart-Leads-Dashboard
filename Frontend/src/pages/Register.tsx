import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BarChart3, Loader2, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { register as registerApi } from '../services/auth.api';
import type { RegisterFormData, UserRole } from '../types/auth.types';
import axios from 'axios';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/common/ThemeToggle';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Sales User');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ defaultValues: { role: 'Sales User' } });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await registerApi(data);
      login(res.token, res.user);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? 'Registration failed. Please try again.');
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
            Join the smarter way to manage your leads
          </h1>
          <p className="text-emerald-100 text-lg leading-relaxed">
            Create your account and start turning prospects into customers with our intelligent pipeline tools.
          </p>
          <div className="mt-8 space-y-3">
            {['Unlimited lead tracking', 'Role-based team access', 'CSV export & analytics', 'Real-time collaboration'].map((f) => (
              <div key={f} className="flex items-center gap-3 text-emerald-100">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-emerald-200 text-sm">© 2025 SmartLeads. All rights reserved.</p>
      </div>

      {/* Right Register Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">SmartLeads</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Get started with SmartLeads today</p>
          </div>

          {/* Role Selector */}
          <div className="mb-5">
            <label className="form-label">I am registering as</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="role-sales"
                onClick={() => handleRoleSelect('Sales User')}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selectedRole === 'Sales User'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <User className={`w-5 h-5 ${selectedRole === 'Sales User' ? 'text-emerald-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className={`text-sm font-medium ${selectedRole === 'Sales User' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>Sales User</div>
                  <div className="text-xs text-gray-500">Manage leads</div>
                </div>
              </button>
              <button
                type="button"
                id="role-admin"
                onClick={() => handleRoleSelect('Admin')}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selectedRole === 'Admin'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <ShieldCheck className={`w-5 h-5 ${selectedRole === 'Admin' ? 'text-emerald-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className={`text-sm font-medium ${selectedRole === 'Admin' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>Admin</div>
                  <div className="text-xs text-gray-500">Full access</div>
                </div>
              </button>
            </div>
            <input type="hidden" {...register('role')} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="register-form">
            <div>
              <label htmlFor="reg-name" className="form-label">Full Name</label>
              <input
                id="reg-name"
                type="text"
                placeholder="John Doe"
                className="form-input"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="form-label">Email address</label>
              <input
                id="reg-email"
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
              <label htmlFor="reg-password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters with uppercase & number"
                  className="form-input pr-10"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Must include uppercase, lowercase, and a number',
                    },
                  })}
                />
                <button
                  type="button"
                  id="toggle-reg-password"
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
              id="register-submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-2.5 text-base"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
