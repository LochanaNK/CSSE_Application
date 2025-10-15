import React from "react";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 13l-6 6m0 0l-6-6m6 6V7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-3">EcoTrack</h1>
          <p className="text-gray-500 text-sm">Smart Waste Management</p>
        </div>

        {/* Form */}
        <h2 className="text-xl font-semibold text-center mb-6">Welcome Back</h2>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-green-500" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-green-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Sign In
          </button>

          <p className="text-center text-sm mt-4">
            Don’t have an account?
            <a href="#" className="text-green-500 font-medium hover:underline ml-1">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
