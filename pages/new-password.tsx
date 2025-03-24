"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AuthLayout from "../shared/layout/AuthenticationLayout";
import Seo from "../shared/seo/seo";
import { z } from "zod";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { useSearchParams } from "next/navigation";

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    "Passwords do not match"
  );

const PasswordChangePage = () => {
  useTheme();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!resetToken) {
      setError("Invalid reset token");
      setLoading(false);
      return;
    }

    try {
      passwordSchema.parse(formData);

      const response = await fetch(process.env.NEXT_PUBLIC_PASSWORD_RESET_API || "http://localhost/hospital_api/new_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reset_token: resetToken,
          new_password: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          window.location.href = "/patient/login";
        }, 3000);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Seo title="Change Password"></Seo>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl flex justify-center items-center px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-left">
                  <h1 className={`text-3xl font-bold text-primary mb-2 text-center`}>
                    Change Password
                  </h1>
                  <p className={`text-foreground`}>
                    Enter your new password to update your account.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="newPassword"
                      className={`block text-sm font-medium text-foreground mb-2`}>
                      New Password
                    </Label>
                    <Input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-foreground mb-2">
                      Confirm New Password
                    </Label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 rounded-md text-red-600 dark:bg-red-900 dark:text-red-200">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mt-4 p-4 bg-green-50 rounded-md text-green-600 dark:bg-green-900 dark:text-green-200">
                      {success}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => (window.location.href = "/patient/login")}>
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={loading}>
                    {loading ? "Resetting Password..." : "Change Password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

PasswordChangePage.getLayout = (page: React.ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default PasswordChangePage;