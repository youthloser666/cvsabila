import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "secondary",
  size = "md",
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-apple-blue-focus/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 rounded-sm gap-1.5",
    md: "text-sm px-3.5 py-2 rounded-md gap-2",
    lg: "text-base px-5 py-2.5 rounded-lg gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-apple-blue hover:bg-apple-blue-focus text-white shadow-sm border border-transparent",
    secondary:
      "bg-white hover:bg-apple-parchment text-apple-ink border border-apple-hairline shadow-sm",
    danger:
      "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
    ghost:
      "bg-transparent hover:bg-black/5 text-apple-ink border border-transparent",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
