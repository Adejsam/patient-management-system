import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";

interface ModalProps {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  children,
  className,
}) => {
  useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  }, [onOpenChange]);

  const handleOutsideClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      handleOpenChange(false);
    }
  }, [onClose, handleOpenChange]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 w-full bg-opacity-50 ${className || ""}`}
      onClick={handleOutsideClick}>
      <div
        className={` w-[40%] rounded-xl border bg-card text-card-foreground shadow `}>
        {children}
      </div>
    </div>
  );
};

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalContent: React.FC<ModalContentProps> = React.memo(({ children, className = "" }) => {
  return <div className={`flex-1 overflow-y-auto p-4 ${className}`}>{children}</div>;
});

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = React.memo(({ children, className = "" }) => {
  const { theme } = useTheme();
  return (
    <div className={`p-4 border-b ${className}`}>
      <h2
        className={`text-lg font-semibold ${
          theme === "dark" ? "text-foreground" : "text-foreground"
        }`}>
        {children}
      </h2>
    </div>
  );
});

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = React.memo(({ children, className = "" }) => {
  const { theme } = useTheme();
  return (
    <div className={`p-4 border-t ${className}`}>
      <div className={`${theme === "dark" ? "text-foreground" : "text-foreground"}`}>
        {children}
      </div>
    </div>
  );
});

// Adding display names for better debugging and performance tracking
Modal.displayName = "Modal";
ModalContent.displayName = "ModalContent";
ModalHeader.displayName = "ModalHeader";
ModalFooter.displayName = "ModalFooter";