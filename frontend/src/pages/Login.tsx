import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Login Request:", formData);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B132B] flex items-center justify-center p-4 font-sans">
      {/* Login Card Container */}
      <div className="bg-[#1C2541] p-6 rounded-xl shadow-2xl w-full max-w-sm border border-[#2A365B]">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            TalentFlow <span className="text-[#00E5FF]">AI</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Welcome back! Please enter your details.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. user@nsbm.ac.lk"
              className="w-full px-3 py-2 rounded-md bg-[#0B132B] text-xs text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-md bg-[#0B132B] text-xs text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center text-gray-400 cursor-pointer select-none">
              <input type="checkbox" className="mr-1.5 rounded bg-[#0B132B] border-[#2A365B] text-[#00E5FF] focus:ring-0" />
              Remember me
            </label>
            <a href="/forgot-password" className="text-[#00E5FF] hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-[#00C896] to-[#00E5FF] text-black font-semibold text-xs rounded-md hover:opacity-90 transition-opacity shadow-md shadow-[#00E5FF]/10"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Don't have an account? <a href="/register" className="text-[#00E5FF] hover:underline font-medium">Sign up</a>
        </p>

      </div>
    </div>
  );
};

export default Login;