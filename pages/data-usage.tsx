"use client"
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import LandingLayout from "../shared/layout/LandingLayout";
import Seo from "../shared/seo/seo";

const DataUsagePage = () => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <main
      className={`${
        resolvedTheme === "dark" ? "bg-background text-white" : "bg-white text-black"
      }`}>
        <Seo title="Data Usage Page"></Seo>
      <div className="w-full px-12 pt-[100px]">
        <h1 className="text-4xl font-bold mt-10 mb-14 text-center text-primary">Data Usage</h1>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <p className="text-base/7">
            Our patient management system is designed to collect and utilize data to enhance the
            quality of healthcare services provided to our patients. This page aims to give you a
            comprehensive understanding of how your data is collected, used, and protected within
            our system.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Types of Data Collected</h2>
          <ul className="list-disc list-inside text-base/7 ml-5 ">
            <li>
              Personal Information: This includes your name, address, contact details, and other
              personal identifiers.
            </li>
            <li>
              Medical History: We collect detailed information about your previous diagnoses,
              treatments, medications, and other relevant medical history.
            </li>
            <li>
              Appointment Records: Information about your appointments, including dates, times, and
              details of consultations.
            </li>
            <li>
              Billing Information: Details about your payment history, insurance information, and
              other billing-related data.
            </li>
            <li>
              Communication Logs: Records of messages and notifications sent to you, including
              appointment reminders and health updates.
            </li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Data Usage</h2>
          <p className="text-base/7">
            The data we collect is used for a variety of purposes aimed at improving your healthcare
            experience:
          </p>
          <ul className="list-disc list-inside text-base/7 ml-5">
            <li>
              Providing personalized healthcare services tailored to your specific needs and medical
              history.
            </li>
            <li>
              Scheduling and managing appointments efficiently to ensure timely consultations and
              follow-ups.
            </li>
            <li>
              Maintaining accurate and up-to-date medical records to facilitate better diagnosis and
              treatment.
            </li>
            <li>
              Processing billing and insurance claims accurately to avoid any discrepancies and
              ensure smooth transactions.
            </li>
            <li>
              Enhancing communication between you and your healthcare providers through secure
              messaging and notifications.
            </li>
            <li>
              Improving the overall efficiency of healthcare operations by leveraging data-driven
              insights and analytics.
            </li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Data Security</h2>
          <p className="text-base/7">
            We prioritize the security of your data and have implemented several measures to protect
            it:
          </p>
          <ul className="list-disc list-inside text-base/7 ml-5">
            <li>
              Encryption: All data is encrypted both in transit and at rest to prevent unauthorized
              access.
            </li>
            <li>
              Access Controls: Strict access controls are in place to ensure that only authorized
              personnel can access your data.
            </li>
            <li>
              Security Audits: Regular security audits and vulnerability assessments are conducted
              to identify and address potential risks.
            </li>
            <li>
              Compliance: We adhere to industry standards and regulations to ensure the highest
              level of data protection.
            </li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
          <p className="text-base/7">You have several rights regarding your data, including:</p>
          <ul className="list-disc list-inside text-base/7 ml-5">
            <li>
              Access: You can request access to your data at any time to review the information we
              have collected.
            </li>
            <li>
              Correction: If you find any inaccuracies in your data, you can request corrections to
              ensure it is accurate and up-to-date.
            </li>
            <li>
              Deletion: Under certain circumstances, you can request the deletion of your data from
              our system.
            </li>
            <li>
              Restriction: You can request restrictions on the processing of your data for specific
              purposes.
            </li>
            <li>
              Portability: You can request a copy of your data in a portable format to transfer it
              to another service provider.
            </li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p className="text-base/7">
            If you have any questions or concerns about your data usage, please feel free to contact
            us:
          </p>
          <p className="text-base/7">Email: support@carepulse.com</p>
          <p className="text-base/7">Phone: (123) 456-7890</p>
        </section>
      </div>
    </main>
  );
};

DataUsagePage.getLayout = (page: React.ReactElement) => {
  return <LandingLayout>{page}</LandingLayout>
}

export default DataUsagePage;
