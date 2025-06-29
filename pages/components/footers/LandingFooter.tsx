"use client";

import React, { useEffect, useState } from "react";

const LandingFooter = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <footer
      className="bg-background py-3 w-full footer mt-auto xl:ps-[15rem shadow-[0_0_0.4rem_rgba(0,0,0,0.1)] text-center">
        <p className="text-md">&copy; CarePulse 2025. All rights reserved.</p>

    </footer>
  );
};

export default LandingFooter;
