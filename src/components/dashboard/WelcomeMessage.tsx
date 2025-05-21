
import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeMessageProps {
  userName: string;
  role: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ userName, role }) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl md:text-2xl font-bold text-foreground">
        {getTimeBasedGreeting()}, {userName}!
      </h2>
      <p className="text-sm md:text-base text-muted-foreground">
        Welcome to your {role} dashboard. Here's what's happening with your orders today.
      </p>
    </motion.div>
  );
};

export default WelcomeMessage;
