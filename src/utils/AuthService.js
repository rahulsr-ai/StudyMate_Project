import supabase from "../utils/Supabase.js"


// sign in with Google
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://studymatenow.netlify.app/dashboard",
      // redirectTo: "http://localhost:5173//dashboard",
      scopes: "openid email",
      includeGrantedScopes: true,
      queryParams: {
        prompt: "select_account", // ✅ Har baar email select karne ka option dega
        hl: "en",
      },
    },
  });

  if (error) {
    console.error("Google Login Error:", error.message);
  }
};



// 🔹 Sign Up Function
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

// 🔹 Login Function
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

// 🔹 Logout Function
export const signOut = async () => {
  await supabase.auth.signOut();
};

// 🔹 Get Current User
export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};



export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout Failed:", error.message);
  } else {
    alert("Logged Out Successfully!");
    window.location.href = "/login"; // Redirect to login page
  }
};


export const sendResetPasswordLink = async (email) => {
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://studymatenow.netlify.app/update-password",  // ✅ Yahan password reset ka frontend hoga
    
  
  });

  if (error) {
    console.error("❌ Error sending reset link:", error.message);
    return false
  } else {
    console.log("✅ Password reset link sent!");
    return true 
  }
};
