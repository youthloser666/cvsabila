import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-apple-ink-muted mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-white border border-apple-hairline rounded-sm px-3 py-1.5 text-sm text-apple-ink transition-colors placeholder:text-apple-ink-muted/50 focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue ${
          error ? "border-red-400 focus:border-red-500 focus:ring-red-400" : ""
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-apple-ink-muted">{helperText}</p>
      ) : null}
    </div>
  );
};
