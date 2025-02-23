"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import HeroImage from "../public/assets/images/hero-image.png";
import Link from "next/link";
import {
  CalendarIcon,
  ClipboardIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { ChevronsRight } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./components/ui/button";
import AppointmentImage from "../public/assets/images/Appointment image.png";
import BillImage from "../public/assets/images/bill handling image.png";
import RecordsImage from "../public/assets/images/patient record image.png";
import LandingLayout from "../shared/layout/LandingLayout";
import Seo from "../shared/seo/seo";

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

export default function HomePage() {
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
      <Seo title="Patient Management System"></Seo>
      <section className="flex gap-2 md:flex-col w-full h-screen">
        <div className="flex flex-col justify-center items-left sm:items-center mt-7 h-full w-1/2 pl-10 md:px-10 md:w-full sm:pt-[100px]">
          <h1
            className={`text-5xl md:text-center font-bold mb-4 ${
              resolvedTheme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Welcome 👋 to <span className="text-primary">Your Patient Management System</span>
          </h1>
          <p
            className={`text-lg mb-4 md:text-center ${
              resolvedTheme === "dark" ? "text-white" : "text-black"
            }`}
          >
            CarePulse is designed to streamline your healthcare operations, making it easier to
            manage patient records, appointments, bills and communication. Join us today and
            experience the future of healthcare management.
          </p>
          <button className="mr-auto md:mx-auto px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/80 rounded-md ">
            <Link href="/patient/login" className="flex items-center">
              Join us today
              <ChevronsRight className="w-6 h-6 ml-2" />
            </Link>
          </button>
        </div>
        <div className="w-1/2 h-full px-10  md:w-full">
          <Image
            src={HeroImage}
            alt="Hero Image"
            width={1000}
            height={1000}
            priority={true}
            className="object-cover h-full md:w-full"
          />
        </div>
      </section>
      <section className={` ${resolvedTheme === "dark" ? "bg-background" : "bg-white"}`}>
        <div className="py-10 sm:py-32">
          <div className="mx-auto max-w-7xl pb-6 lg:px-8">
            <div
              className={`mx-auto max-w-[70%] lg:text-center md:max-w-full md:px-10 ${
                resolvedTheme === "dark" ? "text-white" : "text-black"
              }`}
            >
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-primary sm:text-5xl lg:text-balance">
                Everything you need to manage your patients
              </p>
              <p
                className={`mt-6 text-lg/8 ${
                  resolvedTheme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Our system provides all the tools you need to efficiently manage patient care, from
                scheduling appointments to maintaining secure patient records.
              </p>
            </div>
            <div className="mx-auto mt-14 max-w-[100%] sm:mt-20 md:px-10 mb-[100px]">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16 md:mx-auto">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt
                      className={`text-lg/6 font-semibold ${
                        resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-primary">
                        <feature.icon aria-hidden="true" className="size-6 text-white" />
                      </div>
                      {feature.name}
                    </dt>
                    <dd
                      className={`mt-2 text-base/7 ${
                        resolvedTheme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* second feature Section */}
      <section className=" px-12 mb-[100px]">
        <h1 className="text-4xl text-center font-semibold tracking-tight text-pretty text-primary sm:text-5xl lg:text-balance md:mb-[50px]">
          Discover What We Offer
        </h1>
        <div className="flex gap-5 w-full md:flex-col ">
          <div className="w-1/2 flex flex-col justify-center h-[auto] md:w-full">
            <h2
              className={`text-2xl font-bold md:text-center ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Appointment Scheduling
            </h2>
            <p
              className={`my-5 w-[85%] md:w-full text-base/7 md:text-center ${
                resolvedTheme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Easily schedule and manage patient appointments with our intuitive calendar interface.
              Set reminders, manage cancellations, and reschedule effortlessly.
            </p>
            <div className="w-[20%] md:mx-auto">
              <Button variant={"default"}>
                <Link href="/patient/login" className="flex items-center gap-1">
                  Book Appointment
                  <ChevronsRight className="h-6 w-6 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-1/2 h-[auto] md:w-full">
            <Image
              src={AppointmentImage}
              alt="Image for appointment"
              width={200}
              height={200}
              className="object-cover h-full w-full"
            />
          </div>
        </div>
        <div className="my-[50px] flex gap-5 w-full md:flex-col md:mb-[150px]">
          <div className="w-1/2 h-[auto] md:w-full">
            <Image
              src={RecordsImage}
              alt="Image for patient records"
              width={200}
              height={200}
              className="object-cover h-full w-full"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-center h-[auto] md:w-full">
            <h2
              className={`text-2xl font-bold md:text-center ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Easy Access to Patient Records
            </h2>
            <p
              className={`my-5 w-[85%] md:w-full text-base/7 md:text-center ${
                resolvedTheme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Securely store and access patient records, including medical history and treatments.
              Ensure all patient information is easily retrievable and up-to-date.
            </p>
            <div className="w-[20%] md:mx-auto">
              <Button variant={"default"}>
                <Link href="/patient/login" className="flex items-center gap-1">
                  View Records
                  <ChevronsRight className="h-6 w-6 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex gap-5 w-full md:flex-col ">
          <div className="w-1/2 flex flex-col justify-center h-[auto] md:w-full">
            <h2
              className={`text-2xl font-bold md:text-center ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Bill Handling
            </h2>
            <p
              className={`my-5 w-[85%] md:w-full text-base/7 md:text-center ${
                resolvedTheme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Effectively handle patient billing with our all-inclusive billing system. Create
              invoices and oversee payments to avoid future claim discrepancies.
            </p>
            <div className="w-[20%] md:mx-auto">
              <Button variant={"default"}>
                <Link href="/patient/login" className="flex items-center gap-1">
                  Manage Bills
                  <ChevronsRight className="h-6 w-6 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-1/2 h-[auto] md:w-full">
            <Image
              src={BillImage}
              alt="Image for billing"
              width={200}
              height={200}
              className="object-cover h-full w-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

HomePage.getLayout = (page: React.ReactElement) => {
  return <LandingLayout>{page}</LandingLayout>;
};