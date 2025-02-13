"use client";

import Image from "next/image";
import RegisterForm from "@/components/forms/RegisterForm";
import LightFulIcon from "../../../../public/assets/icons/logo-full-light.png";
import DarkFullIcon from "../../../../public/assets/icons/logo-full.svg";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import RegisterImage from "../../../../public/assets/images/register-img.jpg";

const Register = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const LogoSrc = resolvedTheme === "dark" ? DarkFullIcon : LightFulIcon;

  return (
    <div className="flex h-screen max-h-screen w-full md:flex-col">
      <div className="remove-scrollbar container px-12 w-[65%] md:w-full ">
        <div className="sub-container max-w-[860px] flex-1 flex-col mt-10">
          <Image
            src={LogoSrc}
            height={100}
            width={100}
            priority={true}
            alt="patient"
            className="mb-8 h-10 w-fit"
          />

          <RegisterForm />

          <p className="copyright py-10">© 2025 CarePluse</p>
        </div>
      </div>

      <div className="w-[35%] md:w-full sm:hidden">
        <Image
          src={RegisterImage}
          height={1000}
          width={1000}
          alt="patient"
          className="side-img w-[35%] fixed right-0 h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;
