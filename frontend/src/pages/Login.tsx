import React, { useState, type ChangeEvent, type FormEvent } from 'react';
interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Login Request:", formData);
    // Backend JWT Login API (axios.post('/api/auth/login', formData))
  };

  return (
    <div className="min-h-screen bg-[#0B132B] flex items-center justify-center p-4 font-sans">
      <div className="bg-[#1C2541] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#2A365B]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            TalentFlow <span className="text-[#00E5FF]">AI</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. user@nsbm.ac.lk"
              className="w-full px-4 py-3 rounded-lg bg-[#0B132B] text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-[#0B132B] text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none transition"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-400 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded bg-[#0B132B] border-[#2A365B] text-[#00E5FF]" />
              Remember me
            </label>
            <a href="/forgot-password" className="text-[#00E5FF] hover:underline font-medium">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#00C896] to-[#00E5FF] text-black font-bold rounded-lg hover:opacity-90 transition shadow-lg shadow-[#00E5FF]/20"
          >
            Sign In
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account? <a href="/register" className="text-[#00E5FF] hover:underline font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;