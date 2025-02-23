"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "./components/ui/checkbox";
import LandingLayout from "../shared/layout/LandingLayout";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import Textarea from "./components/ui/Textarea";
import { Button } from "./components/ui/button";
import Seo from "../shared/seo/seo";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  message: z.string().min(1, "Message is required"),
  consentForDataUsage: z.boolean().refine((val) => val === true, {
    message: "You must agree to the data usage policy",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactUs() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const bgColor = resolvedTheme === "dark" ? "bg-background" : "bg-white";
  const textColor = resolvedTheme === "dark" ? "text-white" : "text-black";

  return (
    <div className={`isolate ${bgColor} px-6 py-24 sm:py-32 lg:px-8`}>
      <Seo title="Contact Us"></Seo>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"></div>
      <div className="mx-auto max-w-2xl mt-10 text-center">
        <h2
          className={`text-4xl text-green-500 font-semibold tracking-tight text-balance sm:text-5xl`}>
          Contact Form
        </h2>
        <p className={`mt-2 text-lg/8 ${textColor}`}>
        Please complete the form below, and our team will respond to your inquiry as soon as possible.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto mt-12 max-w-xl sm:mt-20">
          <div className="flex flex-col gap-7">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="123-456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="message"
              control={form.control}
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Message" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consentForDataUsage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>
                    {" "}
                    Consent for{" "}
                    <Link href="/data-usage" className="text-green-500 hover:text-green-700">
                      Data Usage
                    </Link>
                  </FormLabel>
                  <br />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-10">
            <Button type="submit" className="block w-full rounded-md px-3.5 py-2.5 ">
              Let&apos;s talk
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

ContactUs.getLayout = (page: React.ReactElement) => {
  return <LandingLayout>{page}</LandingLayout>;
};
