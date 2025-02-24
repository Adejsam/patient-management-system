import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isMounted) {
    return null;
  }

  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}>
      <div
        className={`rounded-lg shadow-lg w-full max-w-md ${
          theme === "dark" ? "bg-background" : "bg-background"
        }`}>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const ModalHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div className={`border-b p-4 ${theme === "dark" ? "border-border" : "border-border"}`}>
      <h2
        className={`text-lg font-semibold ${
          theme === "dark" ? "text-foreground" : "text-foreground"
        }`}>
        {children}
      </h2>
    </div>
  );
};

export const ModalBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div className={`p-4 ${theme === "dark" ? "text-foreground" : "text-foreground"}`}>
      {children}
    </div>
  );
};

export const ModalFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`border-t p-4 flex justify-end space-x-2 ${
        theme === "dark" ? "border-gray-700" : "border-gray-200"
      }`}>
      {children}
    </div>
  );
};
