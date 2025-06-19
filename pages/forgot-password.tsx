import React, { useEffect, useState } from "react";
import Image from "next/image";
import LightfullLogo from "../public/assets/icons/logo-full-light.png";
import DarkfullLogo from "../public/assets/icons/logo-full.svg";
import { useTheme } from "next-themes";
import Link from "next/link";
import resetImage from "../public/assets/images/forgot password.svg";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "../shared/layout/AuthenticationLayout";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const schema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
});

const ForgotPassPage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const logoSrc = resolvedTheme === "dark" ? DarkfullLogo : LightfullLogo;

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost/hospital_api/forget_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reset email");
      }

      const successData = await response.json();
      setSuccess(successData.message);
      setTimeout(() => setSuccess(""), 5000);
      reset();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send reset email. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="w-full max-w-md p-5">
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                {error && (
                  <div className="p-2 bg-red-50 rounded-md text-red-600 mb-4">
                    {error}
                    <button
                      type="button"
                      onClick={() => setError("")}
                      className="ml-2 text-red-500 hover:text-red-700">
                      ×
                    </button>
                  </div>
                )}
                {success && (
                  <div className="p-2 bg-green-50 rounded-md text-green-600 mb-4">
                    {success}
                    <button
                      type="button"
                      onClick={() => setSuccess("")}
                      className="ml-2 text-green-500 hover:text-green-700">
                      ×
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/80 disabled:bg-gray-400">
                  {loading ? "Sending..." : "Reset Password"}
                </button>
              </form>
              <div className="text-center mt-4">
                <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                  <Link href="/patient/login" className="text-primary hover:text-primary/80">
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
  return <AuthLayout>{page}</AuthLayout>;
};

export default ForgotPassPage;
