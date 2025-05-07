"use client";;
import React, { useEffect, useRef } from 'react';

const defaultProps = {
  title: 'Ship 10x <br /> Faster with NS',
  subtitle: 'Highly customizable components for building modern websites and applications that look and feel the way you mean it.',
  primaryButtonText: 'Start Building',
  secondaryButtonText: 'Request a demo',
  imageSrc: 'https://i.ibb.co.com/gbG9BjTV/1-removebg-preview.png',
  waveColor1: 'rgba(100, 100, 255, 0.1)',
  waveColor2: 'rgba(100, 100, 255, 0.13)',
  waveColor3: 'rgba(100, 100, 255, 0.16)',
  waveColor4: 'rgba(100, 100, 255, 0.19)',
  waveColor5: 'rgba(100, 100, 255, 0.22)',
  waveColor6: 'rgba(100, 100, 255, 0.25)',
  waveColor7: 'rgba(100, 100, 255, 0.28)',
  waveColor8: 'rgba(100, 100, 255, 0.31)',
  waveOpacityBase: 0.1,
  waveOpacityIncrement: 0.03,
  waveAmplitude: 40,
  waveSpeedMultiplier: 0.005,
};

const CustomButton = ({
  variant,
  onClick,
  children
}) => {
  const solidStyles = 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300';
  const defaultStyles = 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300';
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-150';
  const paddingStyles = 'px-4 py-2';

  const className = `${baseStyles} ${paddingStyles} ${variant === 'solid' ? solidStyles : defaultStyles}`;

  return (
    (<button onClick={onClick} className={className}>
      {children}
    </button>)
  );
};

export const HeroHeader = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonAction,
  secondaryButtonText,
  secondaryButtonAction,
  imageSrc,
  waveColor1,
  waveColor2,
  waveColor3,
  waveColor4,
  waveColor5,
  waveColor6,
  waveColor7,
  waveColor8,
  waveOpacityBase,
  waveOpacityIncrement,
  waveAmplitude,
  waveSpeedMultiplier
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let time = 0;

    function drawBackground() {
      ctx.clearRect(0, 0, width, height);

      // dark base
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, width, height);

      // flowing waves
      const waveColors = [
        waveColor1,
        waveColor2,
        waveColor3,
        waveColor4,
        waveColor5,
        waveColor6,
        waveColor7,
        waveColor8,
      ];
      for (let i = 0; i < 8; i++) {
        const opacity = waveOpacityBase + i * waveOpacityIncrement;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin((x + time + i * 100) * waveSpeedMultiplier) * waveAmplitude + i * 20;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = waveColors[i] || `rgba(100, 100, 255, ${opacity})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      time += 1.5;
      requestAnimationFrame(drawBackground);
    }

    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    window.addEventListener('resize', onResize);
    drawBackground();

    return () => window.removeEventListener('resize', onResize);
  }, [
    waveColor1,
    waveColor2,
    waveColor3,
    waveColor4,
    waveColor5,
    waveColor6,
    waveColor7,
    waveColor8,
    waveOpacityBase,
    waveOpacityIncrement,
    waveAmplitude,
    waveSpeedMultiplier,
  ]);

  return (
    (<div className="relative w-full h-screen overflow-hidden bg-black text-white">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div
        className="relative z-10 flex items-center justify-between max-w-7xl mx-auto px-6 h-full">
        <div className="max-w-xl">
          <h1
            className="text-5xl font-bold leading-tight bg-gradient-to-r from-white via-blue-400 to-white text-transparent bg-clip-text animate-fade-in-up"
            dangerouslySetInnerHTML={{ __html: title }} />
          <p className="mt-6 text-lg text-gray-300 animate-fade-in-up delay-200">
            {subtitle}
          </p>
          <div className="mt-8 flex gap-4 animate-fade-in-up delay-300">
            {primaryButtonText && (
              <CustomButton variant="solid" onClick={primaryButtonAction}>
                {primaryButtonText}
              </CustomButton>
            )}
            {secondaryButtonText && (
              <CustomButton variant="default" onClick={secondaryButtonAction}>
                {secondaryButtonText}
              </CustomButton>
            )}
          </div>
        </div>

        <div className="hidden md:block max-w-sm">
          <div
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-4 transform-gpu transition-transform duration-500 -rotate-x-8 -skew-x-12">
            <img
              src={imageSrc}
              alt="Hero Visual"
              className="w-full h-auto object-contain rounded-2xl" />
          </div>
        </div>
      </div>
    </div>)
  );
};

HeroHeader.defaultProps = defaultProps;