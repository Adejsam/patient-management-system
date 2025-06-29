"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LightfullLogo from "../../public/assets/icons/logo-full-light.png";
import DarkfullLogo from "../../public/assets/icons/logo-full.svg";
import { useTheme } from "next-themes";
import AdminForm from "../components/forms/adminForm";
import AuthLayout from "../../shared/layout/AuthenticationLayout";

const LoginPage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const logoSrc = resolvedTheme === "dark" ? DarkfullLogo : LightfullLogo;

  return (
    <main className="h-auto w-full bg-dark-300 flex md:flex-col sm:h-[100vh]">
      <div className="w-1/2 my-10 px-12 bg-dark-300 md:w-full sm:px-5 sm:my-auto sm:w-full">
        <div className="w-full ">
          <Image
            alt="Your Company"
            src={logoSrc}
            width={100}
            height={100}
            className=" h-14 w-auto pb-2"
          />
          <h1 className="text-3xl/9 font-bold mt-5 mb-2">Hi there 👋</h1>
          <h2 className="text-lg placeholder-opacity-80 tracking-tight ">
            Welcome back, Sign in to your account
          </h2>
        </div>

        <div className="w-full pt-10 ">
          <AdminForm />

          <p className="mt-7 text-center text-sm/6 text-gray-500">
            <Link href="/patient/login" className="text-green-500 hover:text-green-600 text-md">
              Back to Patient Login
            </Link>
          </p>

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="text-dark-600 justify-items-end xl:text-left">© 2025 CarePluse</p>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-auto md:w-full sm:hidden">
        <Image
          src="/assets/images/onboarding-img.png"
          height={1000}
          width={1000}
          alt="patient"
          className="side-img w-full h-full object-cover"
        />
      </div>
    </main>
  );
};
LoginPage.getLayout = (page: React.ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};
export default LoginPage;
