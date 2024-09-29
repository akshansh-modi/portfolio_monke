import { useState, useEffect } from "react";
import ParticleImage, { forces, ParticleOptions } from "react-particle-image";
import monke from "../../assets/monke.svg";

const particleOptions: ParticleOptions = {
  filter: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    return pixel.a > 0; // Only include pixels with alpha > 0
  },
  color: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    return `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a / 255})`; // Preserve original RGB color
  },
  radius: () => Math.random() * ((window.innerWidth >= 768)?3:7) + 0.5, // Radius of each particle
  mass: () => 40,
  friction: () => 0.15,
};

const motionForce = (x: number, y: number) => {
  return forces.disturbance(x, y, 20); // Increase disturbance for stronger repulsion
};

const FP2 = () => {
  const [isLaptopScreen, setIsLaptopScreen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsLaptopScreen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100">
      <div id="monke_svg" className="flex-1 flex justify-center items-center">
        <ParticleImage
          src={monke}
          scale={1}
          entropy={20}
          maxParticles={isLaptopScreen ? 4000 : 2000}
          particleOptions={particleOptions}
          mouseMoveForce={motionForce}
          touchMoveForce={motionForce}
          backgroundColor=""
        />
      </div>
      <div id="name_component" className="flex-1 text-center">
        <p className="md:text-[200px] text-9xl font-karantina text-gray-800">
          AKSHANSH
        </p>
        <p className="md:text-[180px] text-8xl font-karantina text-gray-800">
          MODI
        </p>
      </div>
    </div>
  );
};

export default FP2;