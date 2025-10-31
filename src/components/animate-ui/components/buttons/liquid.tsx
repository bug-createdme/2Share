import React from 'react';

export interface LiquidButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const LiquidButton: React.FC<LiquidButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  onClick,
  disabled,
  type = 'button',
}) => {
  const baseClasses = "relative overflow-hidden rounded-[10px] transition-all duration-300 ease-in-out flex items-center font-['League_Spartan'] font-bold";

  const variantClasses = {
    primary: "bg-[#1B1111] text-white hover:bg-[#2a1a1a] justify-center",
    secondary: "bg-[#F0F0F0] text-black hover:bg-[#e8e8e8]",
  };

  const sizeClasses = {
    md: "h-[59px] px-[21px] text-[20px]",
    lg: "h-[59px] px-[21px] text-[24px]",
    icon: "h-[59px] w-[59px] p-0 justify-center",
  };

  const liquidEffect = "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${liquidEffect} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export { LiquidButton };
