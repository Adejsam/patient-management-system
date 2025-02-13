"use client";
import { useEffect, useState } from "react";
import LandingHeader from "@/components/headers/landingHeader";
import Image from "next/image";
import HeroImage from "../../public/assets/images/hero-image.png";
import Link from "next/link";
import {
  CalendarIcon,
  ClipboardIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import LandingFooter from "@/components/footers/LandingFooter";
import { Button } from "@/components/ui/button";

const features = [
  {
    name: "Appointment Scheduling",
    description:
      "Easily schedule and manage patient appointments with our intuitive calendar interface. Set reminders, manage cancellations, and reschedule effortlessly.",
    icon: CalendarIcon,
  },
  {
    name: "Patient Records",
    description:
      "Securely store and access patient records, including medical history and treatments. Ensure all patient information is easily retrievable and up-to-date.",
    icon: ClipboardIcon,
  },
  {
    name: "Patient Communication",
    description:
      "Enhance communication with patients through secure messaging and notifications. Send appointment reminders, follow-up messages, and important health updates.",
    icon: UserGroupIcon,
  },
  {
    name: "Data Security",
    description:
      "Ensure the safety and privacy of patient data with advanced security measures. Comply with industry standards and regulations to protect against unauthorized access.",
    icon: ShieldCheckIcon,
  },
];

export default function Page() {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <main>
        <LandingHeader />
      <section className="flex gap-5 md:flex-col w-full h-screen mt-[-20px]">
        <div className="flex flex-col justify-center items-center w-1/2 pl-10 ">
          <h1 className={`text-5xl font-bold mb-4 ${resolvedTheme === "dark" ? "text-white" : "text-black"}`}>
            Welcome 👋 to <span className="text-primary">Your Patient Management System</span>
          </h1>
          <p className={`text-lg mb-2 ${resolvedTheme === "dark" ? "text-white" : "text-black"}`}>
            Our patient management system is designed to streamline your healthcare operations,
            making it easier to manage patient records, appointments, bills and communication.
          </p>
          <p className={`text-lg mb-2 ${resolvedTheme === "dark" ? "text-white" : "text-black"}`}>
            Join us today and experience the future of healthcare management.
          </p>
          <button className="mr-auto px-4 py-2 bg-primary text-white hover:bg-primary/80 rounded-md ">
            <Link href="/patient/login" className="flex">
              Join us today
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevrons-right">
                <path d="m6 17 5-5-5-5" />
                <path d="m13 17 5-5-5-5" />
              </svg>
            </Link>
          </button>
        </div>
        <div className="w-1/2 h-full pr-12 sm:hidden">
          <Image
            src={HeroImage}
            alt="Hero Image"
            width={1000}
            height={1000}
            priority={true}
            className="object-cover h-full"
          />
        </div>
      </section>
      <section className={`${resolvedTheme === "dark"? "bg-background": "bg-white"}`}>
        <div className="py-10 sm:py-32">
          <div className="mx-auto max-w-7xl pb-6 lg:px-8">
            <div className={`mx-auto max-w-[70%] lg:text-center ${resolvedTheme === "dark" ? "text-white" : "text-black"}`}>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-primary sm:text-5xl lg:text-balance">
                Everything you need to manage your patients
              </p>
              <p className={`mt-6 text-lg/8 ${resolvedTheme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Our system provides all the tools you need to efficiently manage patient care, from scheduling appointments to maintaining secure patient records.
              </p>
            </div>
            <div className="mx-auto mt-14 max-w-[100%] sm:mt-20 ">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className={`text-lg/6 font-semibold ${resolvedTheme === "dark" ? "text-white" : "text-gray-900"}`}>
                      <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-primary">
                        <feature.icon aria-hidden="true" className="size-6 text-white" />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className={`mt-2 text-base/7 ${resolvedTheme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
      <section className="my-[50px] px-10">
        <div className="mb-[50px] flex gap-5 w-full">
                <div className="w-1/2">
                    <h2></h2>
                    <p></p>
                    <Button></Button>
                </div>
                <div className="w-1/2">
                    <Image  src="" alt="" width={500} height={500}/>
                </div>
        </div>
        <div className="mb-[50px] flex gap-5 w-full">
                <div className="w-1/2">
                    <Image  src="" alt="" width={500} height={500}/>
                </div>
                <div className="w-1/2">
                    <h2></h2>
                    <p></p>
                    <Button></Button>
                </div>
        </div>
        <div className="flex gap-5 w-full">
                <div className="w-1/2">
                    <h1></h1>
                    <p></p>
                    <Button></Button>
                </div>
                <div className="w-1/2">
                <Image  src="" alt="" width={500} height={500}/>
                </div>
        </div>
      </section>
      <LandingFooter/>
    </main>
  );
}