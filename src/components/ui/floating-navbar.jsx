"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import supabase from "@/utils/Supabase";

export const FloatingNav = ({ navItems, user }) => {
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  // const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const logOut = async () => {
    localStorage.removeItem("sb-jtxvaqctajkhgkjekams-auth-token");
    
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/login'); // redirect after logout
    } else {
      alert('Error logging out: ' + error.message);
    }
  };


  
  useEffect(() => {


    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile if width < 768px
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  



  useEffect(() => {
    if (isMobile) return; // Don't hide on mobile

    const handleScroll = () => {
      setVisible(window.scrollY <= 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className={`fixed ${
            isMobile
              ? "bottom-0 left-1/2 -translate-x-1/2  py-1 w-full"
              : "top-2 inset-x-0 mx-auto max-w-fit rounded-full p-2 border border-neutral-300 dark:border-white/[0.2]"
          } 
            dark:bg-black bg-black shadow-lg z-[5000] 
            flex items-center justify-center space-x-4  px-4`}
        >
          {navItems.map((navItem, idx) => (
            <Link
              key={`link-${idx}`}
              to={navItem.link}
              className="relative dark:text-neutral-50 flex items-center space-x-1 
                 dark:hover:text-neutral-300 hover:text-neutral-300 px-4 py-2
                text-white"
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </Link>
          ))}

          {user === null ? (
            <Link
              to={"/login"}
              className="border text-sm font-medium relative border-neutral-200 
      dark:border-white/[0.2] text-white dark:text-white px-4 py-2 rounded-md
      hover:scale-95 transition-all duration-300"
            >
              <span>Login</span>
              <span
                className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r 
        from-transparent via-blue-500 to-transparent h-px"
              />
            </Link>
          ) : (
            <Link
              onClick={() => logOut()}
              to={"/login"}
              className="border text-sm font-medium relative border-neutral-200 
     dark:border-white/[0.2] text-white dark:text-white px-4 py-2 rounded-md
     hover:scale-95 transition-all duration-300"
            >
              <span>Logout</span>
              <span
                className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r 
       from-transparent via-blue-500 to-transparent h-px"
              />
            </Link>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
