import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <nav>
        {["login", "sign-up"].map((item, i) => (
          <Link key={i} to={item}>
            {item}{" "}
          </Link>
        ))}
      </nav>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
