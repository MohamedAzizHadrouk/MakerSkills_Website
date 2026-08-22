import React from 'react';
import { motion } from 'framer-motion';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = 'primary',
  className = ''
}) => {
  const gradients = {
    primary: 'bg-gradient-to-br from-orange-500 via-blue-600 to-purple-700',
    secondary: 'bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500',
    accent: 'bg-gradient-to-br from-purple-600 via-orange-500 to-blue-600'
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className={`absolute inset-0 ${gradients[variant]} opacity-10`}
        animate={{
          background: [
            'linear-gradient(45deg, #f97316, #2563eb, #7c3aed)',
            'linear-gradient(90deg, #2563eb, #7c3aed, #f97316)',
            'linear-gradient(135deg, #7c3aed, #f97316, #2563eb)',
            'linear-gradient(45deg, #f97316, #2563eb, #7c3aed)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GradientBackground;