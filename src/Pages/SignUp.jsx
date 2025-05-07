import React, { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../utils/Supabase";
import { signUp } from "../utils/AuthService";
import { IoMdArrowRoundBack } from "react-icons/io";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 🔍 Check if email already exists
      const { data, error } = await supabase
        .from("users") // 🔹 Supabase users table
        .select("email")
        .eq("email", email)
        .single(); // here it will return the first user with email

      if (data) {
        alert(
          "This email is already registered. Please use 'Login with Google'."
        );
        return;
      }

      // 📝 Register user (Only if email doesn't exist)
      await signUp(email, password);
      alert("Sign-up Successful! Check your email for verification.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  // 🔥 Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        navigate("/dashboard"); // Redirect if already logged in
      }
    };
    checkUser();
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

      <div className="w-full md:max-w-5xl bg-zinc-950 md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-zinc-400">Join us and start your journey</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-700/50 border border-zinc-600 text-white rounded-lg py-3 px-12 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
                <input
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
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-700/50 border border-zinc-600 text-white rounded-lg py-3 px-12 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)]  text-white rounded-lg py-3 font-medium flex items-center justify-center space-x-2  transition-colors"
              >
                <span>Create Account</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-zinc-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--primary-color)] hover:text-[var(--primary-color)]">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Quote Section */}
        <div className="w-full md:w-2/5 bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)]  p-6 md:p-12 flex items-center">
          <div>
            <blockquote className="text-2xl font-light text-white italic mb-6">
              "The journey of a thousand miles begins with a single step."
            </blockquote>
            {/* <p className="text-zinc-400">- Lao Tzu</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
