import React, { useState, useEffect } from "react";
import PatientLayout from "../../shared/layout/PatientLayout";
import Header from "../../pages/components/headers/Header";
import Seo from "../../shared/seo/seo";
import DoctorCard from "./doctor/DoctorCard";
import DoctorFilter from "./doctor/DoctorFilter";
import { useTheme } from "next-themes";
import Doctor1 from "../../public/assets/images/doctor 1.jpg";
import Doctor2 from "../../public/assets/images/doctor 2.jpg";
import Doctor3 from "../../public/assets/images/doctor 3.jpg";
import Doctor4 from "../../public/assets/images/doctor 4.jpg";
import Doctor5 from "../../public/assets/images/doctor 5.jpg";
import Doctor6 from "../../public/assets/images/doctor 6.jpg";
import Doctor7 from "../../public/assets/images/doctor 7.jpg";
import Doctor9 from "../../public/assets/images/doctor 9.jpg";
import Doctor10 from "../../public/assets/images/doctor 10.jpg";
import Doctor8 from "../../public/assets/images/doctor 8.jpg";
// import { StaticImageData } from "next/image";

const doctorsData = [
  {
    profilePicture: Doctor4,
    name: "Doc. Chukwuma Okeke",
    field: "Cardiology",
    contact: "+234-803-456-7890",
    yearsOfExperience: 10,
    about: "Experienced cardiologist with a passion for patient care.",
  },
  {
    profilePicture: Doctor1,
    name: "Doc. Aisha Bello",
    field: "Dermatology",
    contact: "+234-802-654-3210",
    yearsOfExperience: 8,
    about: "Expert in skin care and dermatological treatments.",
  },
  {
    profilePicture: Doctor3,
    name: "Doc. Emeka Uche",
    field: "Neurology",
    contact: "+234-701-123-4567",
    yearsOfExperience: 12,
    about: "Specialist in neurological disorders with extensive research experience.",
  },
  {
    profilePicture: Doctor2,
    name: "Doc. Olufemi Adebayo",
    field: "Family Doctor",
    contact: "+234-705-987-6543",
    yearsOfExperience: 15,
    about: "Dedicated pediatrician with a focus on child development and health.",
  },
  {
    profilePicture: Doctor9,
    name: "Doc. Chioma Nwankwo",
    field: "Family Doctor",
    contact: "+234-806-654-3210",
    yearsOfExperience: 9,
    about: "Experienced psychiatrist with a compassionate approach to mental health.",
  },
  {
    profilePicture: Doctor6,
    name: "Doc. Ibrahim Musa",
    field: "Family Doctor",
    contact: "+234-809-321-0987",
    yearsOfExperience: 20,
    about: "Expert in orthopedic surgery with a focus on sports injuries.",
  },
  {
    profilePicture: Doctor7,
    name: "Doc. Kemi Balogun",
    field: "Dermatology",
    contact: "+234-803-789-0123",
    yearsOfExperience: 7,
    about: "Skilled dermatologist with a passion for skincare and cosmetic treatments.",
  },
  {
    profilePicture: Doctor8,
    name: "Doc. Samuel Eze",
    field: "Cardiology",
    contact: "+234-805-456-7890",
    yearsOfExperience: 18,
    about: "Renowned cardiologist with a focus on preventive cardiology.",
  },
  {
    profilePicture: Doctor10,
    name: "Doc. Hauwa Abdullahi",
    field: "Endocrinology",
    contact: "+234-807-654-7890",
    yearsOfExperience: 14,
    about: "Expert in hormonal disorders with a patient-centered approach.",
  },
  {
    profilePicture: Doctor5,
    name: "Doc. Tunde Onifade",
    field: "Gastroenterology",
    contact: "+234-810-321-4567",
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
