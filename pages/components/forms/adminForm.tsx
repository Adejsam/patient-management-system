"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});

type FormData = z.infer<typeof FormSchema>;

const AdminLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSucccessMessage] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("http://localhost/hospital_api/staff_login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.message === "Login successful") {
        // Store user data and role
        localStorage.setItem("user", JSON.stringify(data.user_id));
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userData", JSON.stringify(data.user_data));
        // Set cookies with appropriate options
        document.cookie = `user=${data.user_id}; path=/`;
        document.cookie = `userRole=${data.role}; path=/`;

        setSucccessMessage(true);
        setTimeout(() => {
          router.push(`/admin/dashboard/`);
        }, 1000);
      } else {
        const errorMessage =
          data.message || "Login failed. Please check your credentials and try again.";
        setError(errorMessage);
      }
    } catch (error) {
      toast.error("An error occurred during login");
      setError("An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  console.log(localStorage);
  return (
    <Form {...form}>
      {error && (
        <div className="text-red-900 p-2 bg-red-300 rounded-md text-sm mb-4 text-center">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="text-green-900 p-2 bg-green-300 rounded-md text-sm mb-4 text-center">
          Login successful! Redirecting to dashboard...
        </div>
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        aria-label="admin Login Form">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="admin@example.com"
                  type="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />

                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 text-white relative"
          aria-disabled={isLoading}
          role="button">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
          {!isLoading && "Sign in"}
        </Button>
      </form>
    </Form>
  );
};

export default AdminLoginForm;
