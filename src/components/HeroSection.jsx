"use client";
import React from "react";
import { HeroHeader } from "./wavey-hero-header"; // Adjust path if needed
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  const handlePrimaryButtonClick = () => {

    navigate("/login");
  };

  const handleSecondaryButtonClick = () => {
     navigate("/about");
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <HeroHeader
        title="Next Level Innovation <br/> with Our Platform"
        subtitle="Unlock your potential with our cutting-edge features and seamless integration."
        primaryButtonText="Get Started"
        primaryButtonAction={handlePrimaryButtonClick}
        secondaryButtonText="About Us"
        secondaryButtonAction={handleSecondaryButtonClick}
        imageSrc="https://i.ibb.co.com/gbG9BjTV/1-removebg-preview.png" // Example image
        waveColor1="rgba(150, 80, 200, 0.2)"
        waveColor2="rgba(150, 80, 200, 0.23)"
        waveAmplitude={30}
        waveSpeedMultiplier={0.005}
        mouseRotationIntensity={7}
      />
    </div>
  );
};
