"use client";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

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

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      hospitalNumber: string;
      name: string;
    };
  };
}

export default function PatientForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospitalNumber: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/patient/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.data) {
        // Store authentication token
        localStorage.setItem('token', data.data.token);
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        toast.success("Login successful!");
        router.push('/patient/portal/home');
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="hospitalNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hospital Number</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g 2934039221" 
                  disabled={isLoading}
                  autoComplete="username"
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
                  <FormLabel>Password</FormLabel>
                  <Link 
                    href="/forgot-password" 
                    className="text-green-500 hover:text-green-600 text-sm"
                    tabIndex={-1}
                  >
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
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <div className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{" "}
          <Link 
            href="/register" 
            className="text-green-500 hover:text-green-600"
          >
            Register here
          </Link>
        </div>
      </form>
    </Form>
  );
}