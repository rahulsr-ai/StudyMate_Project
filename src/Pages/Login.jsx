import React, { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../utils/AuthService";
import supabase from "../utils/Supabase";
import { IoMdArrowRoundBack } from "react-icons/io";


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
                <svg width="24px" height="24px" viewBox="-0.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </g></svg>
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
