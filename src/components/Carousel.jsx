import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { carouselItems } from "../Data";

const Carousel = () => {
  const carouselRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    const handleMouseDown = (e) => {
      isDown = true;
      carousel.classList.add("cursor-grabbing");
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    };

    const handleMouseUp = () => {
      isDown = false;
      carousel.classList.remove("cursor-grabbing");
    };

    const handleMouseLeave = () => {
      isDown = false;
      carousel.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    };

    carousel.addEventListener("mousedown", handleMouseDown);
    carousel.addEventListener("mouseleave", handleMouseLeave);
    carousel.addEventListener("mouseup", handleMouseUp);
    carousel.addEventListener("mousemove", handleMouseMove);

    return () => {
      carousel.removeEventListener("mousedown", handleMouseDown);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
      carousel.removeEventListener("mouseup", handleMouseUp);
      carousel.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden px-4 py-8">
      <motion.div
        ref={carouselRef}
        className="flex gap-4 cursor-grab overflow-x-scroll
        hide-scrollbar 
        scroll-smooth touch-pan-x"
        style={{ x }}
        drag="x"
        dragConstraints={{ right: 0, left: -1000 }}
      >
        {carouselItems?.map((item) => (
          <motion.div
            key={item.id}
            className="flex-shrink-0 relative rounded-2xl "
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-48 h-40 relative 
             overflow-hidden border-2">
              <div
                // src={item.image}
                // alt={item.title}
                className="w-full h-full object-cover rounded
                border-2 border-white"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-semibold">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Carousel;
