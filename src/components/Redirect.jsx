import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReDirecting = ({ path = "login" }) => {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    if (count === 0) {
      navigate(`/${path}`);
    }

    return () => clearInterval(interval);
  }, [count, navigate, path]);

  return (
    <div className="flex h-screen justify-center items-center text-xl text-white">
      Redirecting in {count}...
    </div>
  );
};

export default ReDirecting;
