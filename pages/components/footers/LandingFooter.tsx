"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const LandingFooter = () => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <footer
      className={`${resolvedTheme === "dark" ? "bg-background text-white" : "text-black"} py-3 `}>
      <div className="container mx-auto text-center">
        <p className="text-md">&copy; CarePulse 2025. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
