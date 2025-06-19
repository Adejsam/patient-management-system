"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../ui/form";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";

const formSchema = z.object({
  hospitalNumber: z
    .string()
    .min(10, "Hospital number must be 10 digits")
    .max(10, "Hospital number must be 10 digits")
    .regex(/^\d+$/, "Hospital number must contain only numbers"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});

type FormData = z.infer<typeof formSchema>;

export default function PatientForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospitalNumber: "",
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

      // Transform form values to match backend API expectations
      const apiValues = {
        hospital_number: values.hospitalNumber,
        password: values.password,
      };

      const response = await fetch("http://localhost/hospital_api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiValues),
      });

      const data = await response.json();

      if (data.message === "Login successful") {
        // Store user data and role
        localStorage.setItem("user", JSON.stringify(data.user_id));
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("email", data.email);
        localStorage.setItem("hospitalNumber", data.hospitalNumber);
        localStorage.setItem("patientInfo", JSON.stringify(data.patient));
        localStorage.setItem("patientId", data.patientId);

        // Set cookies with appropriate options
        document.cookie = `user=${data.user_id}; path=/`;
        document.cookie = `userRole=${data.role}; path=/`;

        setShowSuccessMessage(true);
        setTimeout(() => {
          router.push(`/patient/dashboard/`);
        }, 1000);
      } else {
        const errorMessage =
          data.message || "Login failed. Please check your credentials and try again.";
        setError(errorMessage);
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      {error && (
        <div className="text-red-900 p-2 bg-red-300 rounded-md text-sm mb-4 text-center">
          {error}
        </div>
      )}
      {showSuccessMessage && (
        <div className="text-green-900 p-2 bg-green-300 rounded-md text-sm mb-4 text-center">
          Login successful! Redirecting to dashboard...
        </div>
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label="Patient Login Form">
        <FormField
          control={form.control}
          name="hospitalNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Hospital Number
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g 2934039221"
                  disabled={isLoading}
                  autoComplete="username"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2 pb-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>
                    Password <span className="text-red-500 ml-1">*</span>
                  </FormLabel>

                  <Link
                    href="/forgot-password"
                    className="text-green-500 hover:text-green-600 text-sm"
                    tabIndex={-1}>
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    placeholder="**********"
                    disabled={isLoading}
                    autoComplete="current-password"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
}
