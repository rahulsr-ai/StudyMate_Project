import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import toast from "react-hot-toast";
import supabase from "../utils/Supabase";

const UpdatePassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ⛔ Block access if not in recovery mode
  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("type=recovery")) {
      sessionStorage.setItem("isRecoveryMode", "true");
    }

    const isRecovery = sessionStorage.getItem("isRecoveryMode") === "true";
    if (!isRecovery) {
      toast.error("Unauthorized access to password reset page.");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter a new password");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message || "Failed to update password.");
      console.error(error);
    } else {
      toast.success("Password updated successfully!");
      sessionStorage.removeItem("isRecoveryMode");
      setPassword("");
      await supabase.auth.signOut();
      navigate("/login");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Update Password</h2>
            <p className="text-zinc-400">Enter your new password to update</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-700/50 border border-zinc-600 text-white rounded-lg py-3 px-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg py-3 font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-colors disabled:opacity-50"
            >
              <span>{loading ? "Updating..." : "Update Password"}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-400">
            Remember your password?{" "}
            <Link to="/login" className="text-[var(--primary-color)] hover:text-[var(--primary-color)]">
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
};

export default UpdatePassword;
