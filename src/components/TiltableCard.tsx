import React, { ReactNode } from 'react';
import { motion, useMotionValue, useTransform, MotionValue } from 'framer-motion';

type TiltableCardProps = {
  children: ReactNode;
  className?: string;
  tiltFactor?: number;
  perspective?: number;
  glareEnabled?: boolean;
  glareMaxOpacity?: number;
  glareColor?: string;
  glarePosition?: string;
  borderRadius?: number;
  cardStyle?: React.CSSProperties;
  shadowEnabled?: boolean;
  shadowColor?: string;
  onClick?: () => void;
};

const TiltableCard: React.FC<TiltableCardProps> = ({
  children,
  className = '',
  tiltFactor = 10,
  perspective = 1000,
  glareEnabled = false,
  glareMaxOpacity = 0.5,
  glareColor = 'rgba(255, 255, 255, 0.4)',
  glarePosition = '50%',
  borderRadius = 10,
  cardStyle = {},
  shadowEnabled = true,
  shadowColor = 'rgba(0, 0, 0, 0.2)',
  onClick,
}) => {
  // Motion values for tracking mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform x/y mouse position to rotation values
  const rotateX = useTransform(y, [-300, 300], [tiltFactor, -tiltFactor]);
  const rotateY = useTransform(x, [-300, 300], [-tiltFactor, tiltFactor]);

  // For the glare effect
  const glareX = useTransform(x, [-300, 300], ['-20%', '120%']);
  const glareY = useTransform(y, [-300, 300], ['-20%', '120%']);
  const glareOpacity = useTransform(
    // Calculate distance from center to determine opacity
    x, 
    [-300, 0, 300], 
    [glareMaxOpacity, glareMaxOpacity / 2, glareMaxOpacity]
  );

  // Handle mouse move
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Distance from center
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    // Update motion values
    x.set(mouseX);
    y.set(mouseY);
  };

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`tiltable-card relative overflow-hidden ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: perspective,
        borderRadius: borderRadius,
        willChange: 'transform',
        transition: 'box-shadow 0.3s ease',
        boxShadow: shadowEnabled ? `0 10px 30px -15px ${shadowColor}` : 'none',
        ...cardStyle,
      }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="card-content relative z-10"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>

      {/* Glare effect */}
      {glareEnabled && (
        <motion.div
          className="glare absolute inset-0 z-20 pointer-events-none"
          style={{
            background: `linear-gradient(
              ${glarePosition}, 
              transparent, 
              ${glareColor}, 
              transparent
            )`,
            top: glareY,
            left: glareX,
            opacity: glareOpacity,
            borderRadius: `${borderRadius}px`,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </motion.div>
  );
};

export default TiltableCard; 