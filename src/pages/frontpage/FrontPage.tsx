import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Circle } from "react-konva";
import useImage from "use-image";
import monke from "../../assets/monke.svg";

const Particle = ({ x, y, color }) => {
  return <Circle x={x} y={y} radius={2} fill={color} />;
};

const FrontPage = () => {
  const [particles, setParticles] = useState([]);
  const [originalPositions, setOriginalPositions] = useState([]);
  const stageRef = useRef(null);
  const [image] = useImage(monke);

  // Initialize particles based on the image
  useEffect(() => {
    if (!image) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    const particleArray = [];
    const spacing = 4; // Distance between particles

    for (let y = 0; y < image.height; y += spacing) {
      for (let x = 0; x < image.width; x += spacing) {
        const pixelData = context.getImageData(x, y, 1, 1).data;
        if (pixelData[3] > 0) {
          // Only consider non-transparent pixels
          particleArray.push({
            x,
            y,
            vx: 0,
            vy: 0,
            color: `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${
              pixelData[3] / 255
            })`,
          });
        }
      }
    }

    setParticles(particleArray);
    setOriginalPositions(particleArray.map((p) => ({ ...p }))); // Store original positions
  }, [image]);

  // Update particles on mouse move
  const handleMouseMove = (e) => {
    const stage = stageRef.current;
    const mousePos = stage.getPointerPosition();

    if (!mousePos) return;

    setParticles((prevParticles) =>
      prevParticles.map((particle, i) => {
        const dx = particle.x - mousePos.x;
        const dy = particle.y - mousePos.y;
        const distanceSquared = dx * dx + dy * dy;
        const repulsionRadiusSquared = 10000; // Repulsion zone threshold squared

        if (distanceSquared < repulsionRadiusSquared) {
          const distance = Math.sqrt(distanceSquared);
          const repulsionStrength = 5 / distance;

          particle.vx += (dx / distance) * repulsionStrength;
          particle.vy += (dy / distance) * repulsionStrength;
        }

        // Apply velocity
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Dampen velocity for smooth motion
        particle.vx *= 0.9;
        particle.vy *= 0.9;

        // Return to original position with easing
        const origX = originalPositions[i].x;
        const origY = originalPositions[i].y;

        particle.x += (origX - particle.x) * 0.02;
        particle.y += (origY - particle.y) * 0.02;

        return particle;
      })
    );
  };

  return (
    <div>
      <div id="monke_svg">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseMove={handleMouseMove}
          ref={stageRef}
        >
          <Layer>
            {particles.map((particle, index) => (
              <Particle
                key={index}
                x={particle.x}
                y={particle.y}
                color={particle.color}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <div id="name_component">{/* Additional content can go here */}</div>
    </div>
  );
};

export default FrontPage;
