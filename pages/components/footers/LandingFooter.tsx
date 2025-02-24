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
      className={`${resolvedTheme === "dark" ? "bg-background text-white" : "text-black"} py-3 footer mt-auto xl:ps-[15rem shadow-[0_0_0.4rem_rgba(0,0,0,0.1)] text-center`}>
      <div className="container ">
        <p className="text-md">&copy; CarePulse 2025. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
