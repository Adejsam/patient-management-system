"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  hospitalNumber: z.string().min(10).max(10),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});

export default function PatientForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospitalNumber: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

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
                <Input {...field} placeholder="e.g 2934039221" />
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
                  <Link href="/forgot-password" className="text-green-500 hover:text-green-600 text-sm">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" {...field} placeholder="**********" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-green-500 px-4 py-2 text-md text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 hover:bg-green-600">
            Sign in
          </button>
        </div>
      </form>
    </Form>
  );
}