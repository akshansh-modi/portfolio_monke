// import React, { useState } from 'react';
// import { motion } from 'framer-motion';

// interface NameComponentProps {
//   names: { firstName: string; lastName: string }[];
// }

// const ScrambleText: React.FC<{ text: string }> = ({ text }) => {
//   const [displayText, setDisplayText] = useState(text);

//   const scrambleText = (text: string) => {
//     const scrambled = text.split('');
//     for (let i = scrambled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
//     }
//     return scrambled.join('');
//   };

//   const handleClick = () => {
//     let iterations = 0;
//     const maxIterations = 10;

//     const interval = setInterval(() => {
//       if (iterations < maxIterations) {
//         setDisplayText(scrambleText(text));
//         iterations++;
//       } else {
//         clearInterval(interval);
//         setDisplayText(text);
//       }
//     }, 100); // Adjust speed of shuffling here
//   };

//   return (
//     <motion.p
//       onClick={handleClick}
//       initial={{ opacity: 0, scale: 0.8 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{
//         duration: 0.5,
//         type: 'spring',
//         stiffness: 100,
//       }}
//       className="prevent-select"
//     >
//       {displayText}
//     </motion.p>
//   );
// };

// const NameComponent: React.FC<NameComponentProps> = ({ names }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handleNameChange = () => {
//     const nextIndex = (currentIndex + 1) % names.length;
//     setCurrentIndex(nextIndex);
//   };

//   return (
//     <div id="name_component" className="flex-1 text-center" onClick={handleNameChange}>
//       <ScrambleText 
//         text={names[currentIndex].firstName} 
//         className="md:text-[200px] text-9xl font-karantina text-gray-800"
//       />
//       <ScrambleText 
//         text={names[currentIndex].lastName} 
//         className="md:text-[180px] text-8xl font-karantina text-gray-800"
//       />
//     </div>
//   );
// };

