import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth";
import { FiUser, FiMail, FiLock, FiArrowRight, FiLogIn } from "react-icons/fi";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await register(username, email, password);
      navigate("/", { state: { registrationSuccess: true } });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-400">
              NoteSphere
            </span>
          </h1>
          <p className="text-gray-600">Create your digital notebook account</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-indigo-100 p-3 rounded-full">
                <FiUser className="h-8 w-8 text-indigo-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Join NoteSphere
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength="3"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="8"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Use 8 or more characters with a mix of letters, numbers &
                  symbols
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-white ${
                  isLoading
                    ? "bg-indigo-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-gray-50 px-8 py-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/"
                className="flex items-center justify-center gap-1 font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in <FiLogIn className="w-4 h-4" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
