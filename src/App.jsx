import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import { SiLinuxcontainers } from "react-icons/si";
import { AboutUs } from "./Pages/About";
import ExampleUsage from "./components/AiChat";
import GptAi from "./components/GptAi";
import supabase from "./utils/Supabase";

const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  const navItems = [
    // {
    //   name: "About",
    //   link: "/about",
    //   icon: (
    //     <SiLinuxcontainers className="h-4 w-4 text-neutral-500 dark:text-white" />
    //   ),
    // },
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
  const hideNavbarRoutes = ["/", "/login", "/sign-up", "/forget-password"];

  // Get user on load
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user); // store user in state
    };

    fetchUser();
  }, []);

  // Logic for showing the navbar
  const shouldShowNavbar =
    (user && location.pathname === "/about") ||
    (!hideNavbarRoutes.includes(location.pathname) && user);

  return (
    <>
      <header>
        {shouldShowNavbar && <FloatingNav navItems={navItems} />}
      </header>

      <Routes>
        <Route index element={<LandingHero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ai" element={<ExampleUsage />} />
        <Route path="/gpt" element={<GptAi />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        <Route path="/" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study/container" element={<Feature />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
