"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import LightfullLogo from "../public/assets/icons/logo-full-light.png";
import DarkfullLogo from "../public/assets/icons/logo-full.svg";
import { useTheme } from "next-themes";
import Link from "next/link";
import resetImage from "../public/assets/images/forgot password.svg";
import ForgotPasswordForm from "../pages/components/forms/forgot-password";
import AuthLayout from "../shared/layout/AuthenticationLayout";


const ForgotPassPage = () => {
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
    <div className="grid grid-cols-12 authentication mx-0 text-defaulttextcolor text-defaultsize">
      <div className="lg:col-span-6">
        <Image
          src={resetImage}
          alt="reset password image"
          width={500}
          height={500}
          priority={true}
          className="h-screen w-full object-contain"
        />
      </div>
      <div className="col-span-6 flex justify-center items-center relative">
        <div className="w-full max-w-md p-5 ">
          <Image
            alt="Your Company"
            src={logoSrc}
            width={50}
            height={50}
            className="h-14 w-auto m-5 p-1 absolute top-0 left-0"
          />
          <div className="flex w-full justify-center">
            <div className="w-full">
              <p className="text-3xl font-semibold mb-2 text-center">Forgot Password</p>
              <p className="mb-6">No worries. We will be sending you a set of instructions</p>
              <ForgotPasswordForm />
              <div className="text-center mt-4">
                <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                  <Link href="/" className="text-primary hover:text-primary/80">
                    Back to Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ForgotPassPage.getLayout = (page: React.ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>
}
export default ForgotPassPage;