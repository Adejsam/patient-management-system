import React, { useState, useEffect } from "react";
import PatientLayout from "../../shared/layout/PatientLayout";
import Header from "../../pages/components/headers/Header";
import Seo from "../../shared/seo/seo";
import DoctorCard from "./doctor/DoctorCard";
import DoctorFilter from "./doctor/DoctorFilter";
import { useTheme } from "next-themes";

const doctorsData = [
  {
    profilePicture: "/images/doctor1.jpg",
    name: "Dr. John Doe",
    field: "Cardiology",
    contact: "123-456-7890",
    yearsOfExperience: 10,
    about: "Experienced cardiologist with a passion for patient care.",
  },
  {
    profilePicture: "/images/doctor2.jpg",
    name: "Dr. Jane Smith",
    field: "Dermatology",
    contact: "987-654-3210",
    yearsOfExperience: 8,
    about: "Expert in skin care and dermatological treatments.",
  },
  {
    profilePicture: "/images/doctor3.jpg",
    name: "Dr. Emily Johnson",
    field: "Neurology",
    contact: "555-123-4567",
    yearsOfExperience: 12,
    about: "Specialist in neurological disorders with extensive research experience.",
  },
  {
    profilePicture: "/images/doctor4.jpg",
    name: "Dr. Michael Brown",
    field: "Pediatrics",
    contact: "555-987-6543",
    yearsOfExperience: 15,
    about: "Dedicated pediatrician with a focus on child development and health.",
  },
  {
    profilePicture: "/images/doctor5.jpg",
    name: "Dr. Sarah Davis",
    field: "Psychiatry",
    contact: "555-654-3210",
    yearsOfExperience: 9,
    about: "Experienced psychiatrist with a compassionate approach to mental health.",
  },
  {
    profilePicture: "/images/doctor6.jpg",
    name: "Dr. William Martinez",
    field: "Orthopedics",
    contact: "555-321-0987",
    yearsOfExperience: 20,
    about: "Expert in orthopedic surgery with a focus on sports injuries.",
  },
  {
    profilePicture: "/images/doctor7.jpg",
    name: "Dr. Linda Wilson",
    field: "Dermatology",
    contact: "555-789-0123",
    yearsOfExperience: 7,
    about: "Skilled dermatologist with a passion for skincare and cosmetic treatments.",
  },
  {
    profilePicture: "/images/doctor8.jpg",
    name: "Dr. James Anderson",
    field: "Cardiology",
    contact: "555-456-7890",
    yearsOfExperience: 18,
    about: "Renowned cardiologist with a focus on preventive cardiology.",
  },
  {
    profilePicture: "/images/doctor9.jpg",
    name: "Dr. Patricia Thomas",
    field: "Endocrinology",
    contact: "555-654-7890",
    yearsOfExperience: 14,
    about: "Expert in hormonal disorders with a patient-centered approach.",
  },
  {
    profilePicture: "/images/doctor10.jpg",
    name: "Dr. Robert Garcia",
    field: "Gastroenterology",
    contact: "555-321-4567",
    yearsOfExperience: 11,
    about: "Specialist in digestive health with a focus on minimally invasive procedures.",
  },
  // Add more doctor data as needed
];

const ViewDoctors: React.FC = () => {
  useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [filterField, setFilterField] = useState("all");
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setFilteredDoctors(
      doctorsData.filter((doctor) => filterField === "all" || doctor.field === filterField)
    );
  }, [filterField]);

  if (!isMounted) {
    return null;
  }

  return (
    <PatientLayout>
      <Seo title="View Doctors" />
      <Header title="View Doctors" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="h-auto rounded-xl bg-muted/50 relative w-[97%] mx-auto">
        <h1 className="text-3xl/9 font-bold pt-7 mb-2 pl-4">
          View all <span className="text-primary"> Doctors</span>
        </h1>
        <h2 className="text-lg placeholder-opacity-80 pl-4 tracking-tight ">
          Find Your Perfect Doctor
        </h2>

        <div className="p-4 my-5 w-full">
          <DoctorFilter filterField={filterField} onFieldChange={setFilterField} />
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 pt-4 pb-8">
            {filteredDoctors.map((doctor, index) => (
              <DoctorCard key={index} {...doctor} />
            ))}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default ViewDoctors;
