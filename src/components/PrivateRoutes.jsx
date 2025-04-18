import { useEffect, useState } from "react";
import supabase from "../utils/Supabase"
import { Outlet, useNavigate } from "react-router-dom";
import ReDirecting from "./Redirect";

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setOk(true);
      } else {
        setOk(false);
        navigate("/login"); // Redirect agar user nahi hai
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <div className="text-center text-white">Checking Authentication...</div>;

  return ok ? <Outlet /> : <ReDirecting path="login" />;
};

export default PrivateRoute;
