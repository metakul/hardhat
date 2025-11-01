import React, { useState } from "react";

interface LoadingButtonWrapperProps {
  onClick?: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
  actionLabel?:String
}

const LoadingButtonWrapper: React.FC<LoadingButtonWrapperProps> = ({
  onClick,
  children,
  disabled = false,
  actionLabel
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      onClick && (await onClick());
      // Add random delay between 4-6 seconds after submitting trx onChain
      const delay = Math.floor(Math.random() * (6000 - 4000) + 4000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      style={{
        flex: 1,
        padding: "12px 16px",
        backgroundColor: isLoading || disabled ? "rgba(100, 116, 139, 0.6)" : "#3B82F6",
        color: "white",
        width: "100%",
        borderRadius: "8px",
        textTransform: "none",
        fontWeight: "medium",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        letterSpacing: "0.025em",
        transition: "all 0.2s ease-in-out",
      }}
      onClick={handleClick}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {actionLabel}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButtonWrapper;
