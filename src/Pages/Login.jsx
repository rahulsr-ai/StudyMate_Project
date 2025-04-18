import React, { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../utils/AuthService";
import supabase from "../utils/Supabase";
import { IoMdArrowRoundBack } from "react-icons/io";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function getUser() {
    const { data, error } = await supabase.auth.getUser();
    console.log(data.user.id);
    
    navigate("/dashboard");
    if (data.user.id) {
      console.error("Error fetching user:", error.message);
    
      return;
    }

  }

  

  const handleGoogleLogin = async () => {
    const { user, error } = await signInWithGoogle();
    if (error) {
      alert("Login Failed!");
    } else {
      alert(`Welcome ${user.email}`);
    }
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      navigate("/dashboard"); // Redirect to dashboard
    }
  };


  useEffect(() => { 
      getUser();
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4">
      <div className="absolute top-4 left-4 text-white flex items-center gap-2 cursor-pointer
      hover:scale-125 transition-all duration-300">
        <Link to={"/"} className="text-xl bg-zinc-950 p-2 rounded-full">
          <IoMdArrowRoundBack />
        </Link>
      </div>

      <div className="w-full max-w-5xl bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
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
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-700/50 border border-zinc-600 text-white rounded-lg py-3 px-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-700/50 border border-zinc-600 text-white rounded-lg py-3 px-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-zinc-600 text-blue-500 focus:ring-blue-500 bg-zinc-700/50"
                />
                <span className="text-zinc-400 text-sm">Remember me</span>
              </label>
              <Link
                to="/forget-password"
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg py-3 font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-colors"
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
            <Link to="/sign-up" className="text-blue-500 hover:text-blue-400">
              Register here
            </Link>
          </p>
        </div>

        {/* Quote Section */}
        <div className="w-full md:w-2/5 bg-gradient-to-r from-blue-500 to-blue-700 p-6 md:p-12 flex items-center">
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
