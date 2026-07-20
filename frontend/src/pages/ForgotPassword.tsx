import React, { useState, type ChangeEvent, type FormEvent } from 'react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Reset Password Link Sent to:", email);
  };

  return (
    <div className="min-h-screen bg-[#0B132B] flex items-center justify-center p-4 font-sans">
      <div className="bg-[#1C2541] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#2A365B]">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white tracking-wide">Reset Your Password</h1>
          <p className="text-gray-400 text-sm mt-2">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#00C896]/10 border border-[#00C896] text-[#00C896] p-4 rounded-lg text-center text-sm">
            If an account exists with <b>{email}</b>, a reset link has been sent. Check your inbox!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="user@nsbm.ac.lk"
                className="w-full px-4 py-3 rounded-lg bg-[#0B132B] text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#00C896] to-[#00E5FF] text-black font-bold rounded-lg hover:opacity-90 transition shadow-lg shadow-[#00E5FF]/20"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-gray-400 hover:text-white transition">← Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;