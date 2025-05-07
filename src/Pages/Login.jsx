import React, { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../utils/AuthService";
import supabase from "../utils/Supabase";
import { IoMdArrowRoundBack } from "react-icons/io";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const { user, error } = await signInWithGoogle();
    if (error) {
      alert("Login Failed!");
    } else {
      alert(`Welcome ${user.email}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!email || !password) {
      setError("Please fill all the fields");
      return
    }


    setIsLoading(true);
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

  
    if (error) {
     
      setError(error.message);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
     
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      navigate("/dashboard"); 
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // If user is already logged in, redirect to dashboard
        navigate("/dashboard");
      }
    };

    checkUserSession();
  }, [navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center md:p-4">
      <div
        className="absolute top-4 left-4 text-white flex items-center gap-2 cursor-pointer
      hover:scale-125 transition-all duration-300"
      >
        <Link to={"/"} className="text-xl bg-zinc-950 p-2 rounded-full">
          <IoMdArrowRoundBack />
        </Link>
      </div>

      <div className="w-full max-w-5xl bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className=" dark:bg-gray-800 md:rounded-lg p-6 shadow-lg flex items-center justify-center">
              {/* Spinner */}
              <div className="border-t-4 border-b-4 border-[var(--primary-color)] h-12 w-12 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Login Form Section */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-zinc-400">
              Please enter your details to sign in
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
                <input
                  onFocus={() => setError(null)}
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-700/50 border border-zinc-600 text-white rounded-lg py-3 px-12 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
                <input
                  onFocus={() => setError(null)}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-700/50 border border-zinc-600 text-white rounded-lg py-3 px-12 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                />
              </div>
              <span className="text-red-500 text-sm">{error}</span>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-zinc-600 text-[var(--primary-color)] focus:ring-[var(--primary-color)] bg-zinc-700/50"
                />
                <span className="text-zinc-400 text-sm">Remember me</span>
              </label>
              <Link
                to="/forget-password"
                className="text-sm text-[var(--primary-color)] hover:text-[var(--primary-color)]"
              >
                Forgot password?
              </Link>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className="w-full  bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)]  text-white rounded-lg py-3 font-medium flex items-center justify-center space-x-2  transition-colors"
              >
                <span>Sign in</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full bg-zinc-700/50 border border-zinc-600 text-white rounded-lg py-3 font-medium flex items-center justify-center space-x-2 hover:bg-zinc-700 transition-colors"
              >
                <Chrome className="h-5 w-5" />
                <span>Sign in with Google</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-zinc-400">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-[var(--primary-color)] hover:text-[var(--primary-color)]">
              Register here
            </Link>
          </p>
        </div>

        {/* Quote Section */}
        <div className="w-full md:w-2/5 bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)]  p-6 md:p-12 flex items-center">
          <div>
            <blockquote className="text-2xl font-light text-white italic mb-6">
              "Education is not preparation for life; education is life itself."
            </blockquote>
            {/* <p className="text-zinc-400">- John Dewey</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
