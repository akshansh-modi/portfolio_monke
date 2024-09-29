import { useState, useEffect } from "react";
import ParticleImage, { forces, ParticleOptions } from "react-particle-image";
import monke from "../../assets/monke.svg";
import "./frontpage.css";
import NameComponent from "../../components/name_component";


const particleOptions: ParticleOptions = {
  filter: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    return pixel.a > 0; // Only include pixels with alpha > 0
  },
  color: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    return `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a / 255})`; // Preserve original RGB color
  },
  radius: () => Math.random() * (window.innerWidth >= 768 ? 4 : 6) + 0.5, // Radius of each particle
  mass: () => 40,
  friction: () => 0.15,
};

const motionForce = (x: number, y: number) => {
  return forces.disturbance(x, y, 40); // Increase disturbance for stronger repulsion
};
const touchForce = (x: number, y: number) => {
  return forces.disturbance(x, y, 20);
};

const FP2 = () => {
  const [isLaptopScreen, setIsLaptopScreen] = useState(
    window.innerWidth >= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLaptopScreen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [isLaptopScreen]);

  const names = [
    { firstName: "Akshansh", lastName: "Modi", language: "English" }, // English
    { firstName: "अक्षांश", lastName: "मोदी", language: "Hindi" }, // Hindi/Marathi
    { firstName: "Акшанш", lastName: "Моди", language: "Russian" }, // Russian
    { firstName: "أكشانش", lastName: "مودي", language: "Arabic" }, // Arabic
    { firstName: "악샨시", lastName: "모디", language: "Korean" }, // Korean
    { firstName: "อักชานช์", lastName: "โมดี", language: "Thai" } // Thai
  ];
  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100">
      <div id="monke_svg" className="flex-1 flex justify-center items-center">
        <ParticleImage
          src={monke}
          scale={1}
          entropy={20}
          maxParticles={isLaptopScreen ? 4000 : 3000}
          particleOptions={particleOptions}
          mouseMoveForce={motionForce}
          touchMoveForce={touchForce}
          backgroundColor=""
        />
      </div>
    
   <NameComponent names={names} />
      
    </div>
  );
};

export default FP2;
