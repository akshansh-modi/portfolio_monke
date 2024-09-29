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
  radius: () => Math.random() * 3 + 0.5, // Radius of each particle
  mass: () => 40,
  friction: () => 0.15,
};

const motionForce = (x: number, y: number) => {
  return forces.disturbance(x, y, 20); // Increase disturbance for stronger repulsion
};

const FP2 = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen ">
      <div id="monke_svg" className="flex-1 flex justify-center items-center">
        <ParticleImage
          src={monke}
          scale={1}
          entropy={20}
          maxParticles={8000}
          particleOptions={particleOptions}
          mouseMoveForce={motionForce}
          touchMoveForce={motionForce}
          backgroundColor="white"
        />
      </div>

      <div id="name_component" className="flex-1 text-center">
        <p className="text-4xl font-bold text-gray-800">AKSHANSH</p>
        <p className="text-4xl font-bold text-gray-800">MODI</p>
      </div>
    </div>
  );
};

export default FP2;
