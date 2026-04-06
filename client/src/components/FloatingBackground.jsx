/**
 * FloatingBackground Component
 * UPDATED: Converted from police/crime system to college complaint system
 * UPDATED: Changed icons to reflect complaint management themes
 * UPDATED: Updated colors to match complaint system (purple/indigo theme)
 * UPDATED: Added complaint-specific icons (Ticket, Clipboard, Wrench, etc.)
 * UPDATED: Improved animation with different delays and durations
 * UPDATED: Added responsive positioning for different screen sizes
 * UPDATED: Reduced opacity for better readability of content
 * 
 * @description Animated floating background component for complaint management system
 * @version 2.0.0 (Complete rewrite for complaint system)
 */

import React from 'react';
import { 
  FaTicketAlt, 
  FaClipboardList, 
  FaWrench, 
  FaPlug, 
  FaTrashAlt, 
  FaPaintRoller,
  FaBroom,
  FaTint,
  FaTools,
  FaDesktop,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaUserCheck,
  FaShieldAlt
} from 'react-icons/fa';

const FloatingBackground = () => {
  // Complaint management specific icons
  const icons = [
    { Component: FaTicketAlt, style: 'top-[5%] left-[5%]', size: 'text-5xl', delay: 0, duration: 20, color: 'text-purple-400' },
    { Component: FaClipboardList, style: 'top-[15%] right-[8%]', size: 'text-4xl', delay: 2, duration: 25, color: 'text-indigo-400' },
    { Component: FaWrench, style: 'top-[25%] left-[15%]', size: 'text-3xl', delay: 4, duration: 18, color: 'text-blue-400' },
    { Component: FaPlug, style: 'top-[35%] right-[15%]', size: 'text-5xl', delay: 1, duration: 22, color: 'text-yellow-400' },
    { Component: FaTrashAlt, style: 'bottom-[30%] left-[8%]', size: 'text-4xl', delay: 3, duration: 20, color: 'text-red-400' },
    { Component: FaPaintRoller, style: 'bottom-[20%] right-[12%]', size: 'text-3xl', delay: 5, duration: 24, color: 'text-pink-400' },
    { Component: FaBroom, style: 'bottom-[40%] left-[20%]', size: 'text-5xl', delay: 2, duration: 19, color: 'text-green-400' },
    { Component: FaTint, style: 'bottom-[10%] right-[25%]', size: 'text-4xl', delay: 4, duration: 23, color: 'text-cyan-400' },
    { Component: FaTools, style: 'top-[45%] left-[25%]', size: 'text-3xl', delay: 1, duration: 21, color: 'text-orange-400' },
    { Component: FaDesktop, style: 'top-[55%] right-[20%]', size: 'text-5xl', delay: 3, duration: 26, color: 'text-teal-400' },
    { Component: FaExclamationTriangle, style: 'bottom-[15%] left-[35%]', size: 'text-4xl', delay: 0, duration: 17, color: 'text-yellow-500' },
    { Component: FaCheckCircle, style: 'top-[70%] left-[45%]', size: 'text-3xl', delay: 5, duration: 22, color: 'text-green-500' },
    { Component: FaClock, style: 'bottom-[50%] right-[5%]', size: 'text-4xl', delay: 2, duration: 20, color: 'text-gray-400' },
    { Component: FaUserCheck, style: 'top-[85%] right-[35%]', size: 'text-3xl', delay: 4, duration: 24, color: 'text-blue-500' },
    { Component: FaShieldAlt, style: 'top-[10%] right-[40%]', size: 'text-5xl', delay: 1, duration: 28, color: 'text-purple-500' }
  ];

  // Generate random positions for additional floating elements
  const getRandomPosition = () => {
    return {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`
    };
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Pre-defined Icons with animation */}
      {icons.map(({ Component, style, size, delay, duration, color }, i) => (
        <div
          key={i}
          className={`absolute ${style} animate-float-slow`}
          style={{
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
          }}
        >
          <Component className={`${size} ${color} opacity-20 hover:opacity-30 transition-opacity duration-1000`} />
        </div>
      ))}

      {/* Additional floating particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-purple-300 rounded-full animate-pulse-slow"
          style={{
            ...getRandomPosition(),
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${3 + Math.random() * 5}s`,
            opacity: 0.1 + Math.random() * 0.2
          }}
        />
      ))}
    </div>
  );
};

// Add this CSS to your global stylesheet or create a style tag
const styles = `
@keyframes float-slow {
  0% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) translateX(10px) rotate(5deg);
  }
  50% {
    transform: translateY(10px) translateX(-10px) rotate(-5deg);
  }
  75% {
    transform: translateY(-10px) translateX(5px) rotate(3deg);
  }
  100% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(2);
  }
}

.animate-float-slow {
  animation: float-slow ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow ease-in-out infinite;
}

/* Responsive adjustments for floating icons */
@media (max-width: 768px) {
  .animate-float-slow {
    transform: scale(0.7);
  }
}

@media (max-width: 640px) {
  .animate-float-slow {
    transform: scale(0.5);
  }
}
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  if (!document.head.querySelector('#floating-bg-styles')) {
    styleSheet.id = 'floating-bg-styles';
    document.head.appendChild(styleSheet);
  }
}

export default FloatingBackground;