import React, { useState } from "react";
import { motion } from "framer-motion";

interface NameComponentProps {
  names: { firstName: string; lastName: string; language: string }[];
}

const ScrambleText: React.FC<{
  text: string;
  className?: string;
  language: string;
}> = ({ text, className, language }) => {
  // Define language-specific animation effects
  const scaleEffect = language === "Hindi" ? 0.7 : 0.9; // Adjusted scale for Hindi
    const initialScale = language === "Hindi" ? 0.6 : 0.8; // Adjusted initial scale for Hindi
  return (
    <motion.p
      initial={{ opacity: 0, scale: initialScale }}
      animate={{ opacity: 1, scale: scaleEffect }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      }}
      className={`prevent-select ${className}`}
    >
      {text}
    </motion.p>
  );
};

const NameComponent: React.FC<NameComponentProps> = ({ names }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstName, setFirstName] = useState(names[currentIndex].firstName);
  const [lastName, setLastName] = useState(names[currentIndex].lastName);

  const scrambleText = (text: string) => {
    const scrambled = text.split("");
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    return scrambled.join("");
  };

  const handleClick = () => {
    const nextIndex = (currentIndex + 1) % names.length;

    let iterations = 0;
    const maxIterations = 10;

    const interval = setInterval(() => {
      if (iterations < maxIterations) {
        setFirstName(scrambleText(names[nextIndex].firstName));
        setLastName(scrambleText(names[nextIndex].lastName));
        iterations++;
      } else {
        clearInterval(interval);
        setFirstName(names[nextIndex].firstName);
        setLastName(names[nextIndex].lastName);
        setCurrentIndex(nextIndex);
      }
    }, 100); // Adjust speed of shuffling here
  };

  return (
    <div
      id="name_component"
      className="flex-1 text-center"
      onClick={handleClick}
    >
      <ScrambleText
        text={firstName}
        className="md:text-[200px] text-9xl font-karantina text-gray-800"
        language={names[currentIndex].language}
      />
      <ScrambleText
        text={lastName}
        className="md:text-[180px] text-8xl font-karantina text-gray-800"
        language={names[currentIndex].language}
      />
    </div>
  );
};

export default NameComponent;