
import React from 'react';

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
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-foreground">
        {getTimeBasedGreeting()}, {userName}!
      </h2>
      <p className="text-muted-foreground">
        Welcome to your {role} dashboard. Here's what's happening with your orders today.
      </p>
    </div>
  );
};

export default WelcomeMessage;
