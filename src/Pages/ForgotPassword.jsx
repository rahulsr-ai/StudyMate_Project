import React, { useEffect, useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { sendResetPasswordLink } from "../utils/AuthService";
import toast from "react-hot-toast";

function ForgotPassword({ user }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email) {
      toast.error("Please enter your email address");
      setIsLoading(false);
      return;
    }

    const res = await sendResetPasswordLink(email);
   console.log(res);
   
    if (!res) {
      setIsLoading(false);
      toast.error("Failed to send reset link");
     
    } else {
      setIsLoading(false);
      toast.success("Reset link sent successfully!");
      setEmail(""); // clear input
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className=" dark:bg-gray-800 rounded-lg p-6 shadow-lg flex items-center justify-center">
              {/* Spinner */}
              <div className="border-t-4 border-b-4 border-blue-900 h-12 w-12 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Reset Password
            </h2>
            <p className="text-zinc-400">
              Enter your email to receive reset instructions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 ">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-700/50 border border-zinc-600 text-white rounded-lg py-3 px-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg py-3 font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-colors"
            >
              <span>Send Reset Link</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-400">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-400">
              Back to login
            </Link>
          </p>
        </div>

        {/* Quote Section */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-blue-500/10 to-transparent p-8 md:p-12 flex items-center">
          <div>
            <blockquote className="text-2xl font-light text-white italic mb-6">
              "Success is not final, failure is not fatal: it is the courage to
              continue that counts."
            </blockquote>
            <p className="text-zinc-400">- Winston Churchill</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
