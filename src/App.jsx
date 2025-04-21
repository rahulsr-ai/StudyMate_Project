import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoutes";
import ForgotPassword from "./Pages/ForgotPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import { FloatingNav } from "./components/ui/floating-navbar";
import { BookOpen } from "lucide-react";
import Study from "./Pages/Study";
import { LandingHero } from "./components/Hero";
import { Feature } from "./components/ui/Container";
import { MdDashboard } from "react-icons/md";
import { AboutUs } from "./Pages/About";
import supabase from "./utils/Supabase";
import NotFound from "./Pages/NotFound";

const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Study ",
      link: "/study",
      icon: <BookOpen className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: (
        <MdDashboard className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];

  // Routes where navbar should *always* be hidden
  const hideNavbarRoutes = [
    "/",
    "/login",
    "/sign-up",
    "/forget-password",
    "/update-password",
    "/about",
  ];

  // Get user on load
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        console.log("user is logged in", session?.user);
        setUser(session); // store user in state
        return;
      } else { 
        setUser(null);
        console.log('user is not logged in');
        return;
      }
    };

    fetchUser();
  }, [navigate]);

  // Check if current path matches any route where navbar should be hidden
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <main>
      <header>
        {shouldShowNavbar && <FloatingNav navItems={navItems} user={user} />}
      </header>

      <Routes>
        <Route index element={<LandingHero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUs user={user} />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/forget-password"
          element={<ForgotPassword user={user} />}
        />
        <Route
          path="/update-password"
          element={<UpdatePassword user={user} />}
        />
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study/container" element={<Feature />} />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
