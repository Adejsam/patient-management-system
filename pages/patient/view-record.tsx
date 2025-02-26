import React, { useState, useEffect } from "react";
import PatientLayout from "../../shared/layout/PatientLayout";
import Header from "../../pages/components/headers/Header";
import Seo from "../../shared/seo/seo";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { generateMedicalRecordPDF } from "../../services/PDFMedicalGenerator";
import LightLogo from "../../public/assets/icons/logo-full-light.png";
import DarkLogo from "../../public/assets/icons/logo-full.svg";
import Image from "next/image";
import { MedicalRecordData } from "../../types/medical";

// Sample medical records data
const medicalRecordsData: MedicalRecordData[] = [
  {
    name: "John Doe",
    dateOfBirth: "1990-01-01",
    gender: "Male",
    contactDetails: "john.doe@email.com",
    date: "2024-01-15",
    doctor: "Dr. Smith",
    field: "Cardiology",
    symptoms: "Chest pain, shortness of breath",
    allergies: "None",
    diagnosis: "Mild hypertension",
    labTests: "Blood pressure, ECG",
    labTestResults: "BP: 140/90, ECG: Normal sinus rhythm",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily"
      }
    ],
    doctorNotes: "Patient presents with elevated blood pressure. Recommended lifestyle changes and medication.",
    nursingNotes: "Patient education provided regarding medication and diet."
  }
  // Add more records as needed
];

const ViewRecord: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [expandedRecords, setExpandedRecords] = useState<number[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedRecords((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const exportToPDF = async (record: MedicalRecordData) => {
    try {
      const logoSrc = resolvedTheme === "dark" ? DarkLogo.src : LightLogo.src;
      await generateMedicalRecordPDF(record, logoSrc);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  if (!isMounted) return null;

  const logoSrc = resolvedTheme === "dark" ? LightLogo : DarkLogo;

  return (
    <PatientLayout>
      <Seo title="View Medical Records" />
      <Header title="View Medical Records" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="min-h-[100vh] rounded-xl bg-muted/50 relative w-[97%] mx-auto mb-5">
        <h1 className="text-3xl/9 font-bold pt-7 mb-2 pl-4">
          View Your <span className="text-primary">Medical Records</span>
        </h1>
        <h2 className="text-lg placeholder-opacity-80 pl-4 tracking-tight">Your Health History</h2>

        <div className="p-4 my-5 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 pt-4 pb-8">
            {medicalRecordsData.map((record, index) => (
              <Card key={index} className="w-[400px] py-5 mb-5 md:w-full hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <Image src={logoSrc} alt="logo" height={200} width={200} className="pb-3" />
                  <CardTitle className="text-xl font-bold">{record.date}</CardTitle>
                  <CardDescription>
                    {record.doctor} - {record.field}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong className="block text-sm font-medium mb-1">Patient Name:</strong>
                        <p className="p-2 rounded-md bg-muted/50">{record.name}</p>
                      </div>
                      <div>
                        <strong className="block text-sm font-medium mb-1">Date of Birth:</strong>
                        <p className="p-2 rounded-md bg-muted/50">{record.dateOfBirth}</p>
                      </div>
                    </div>

                    <div>
                      <strong className="block text-sm font-medium mb-1">Symptoms:</strong>
                      <p className="p-2 rounded-md bg-muted/50">{record.symptoms}</p>
                    </div>

                    <div>
                      <strong className="block text-sm font-medium mb-1">Allergies:</strong>
                      <p className="p-2 rounded-md bg-muted/50">{record.allergies}</p>
                    </div>

                    {expandedRecords.includes(index) && (
                      <>
                        <div>
                          <strong className="block text-sm font-medium mb-1">Diagnosis:</strong>
                          <p className="p-2 rounded-md bg-muted/50">{record.diagnosis}</p>
                        </div>

                        <div>
                          <strong className="block text-sm font-medium mb-1">Lab Tests:</strong>
                          <p className="p-2 rounded-md bg-muted/50">{record.labTests}</p>
                        </div>

                        <div>
                          <strong className="block text-sm font-medium mb-1">Lab Test Results:</strong>
                          <p className="p-2 rounded-md bg-muted/50">{record.labTestResults}</p>
                        </div>

                        <div>
                          <strong className="block text-sm font-medium mb-1">Medications:</strong>
                          <div className="p-2 rounded-md bg-muted/50">
                            {record.medications.map((med, idx) => (
                              <p key={idx} className="mb-1 last:mb-0">
                                {med.name} - {med.dosage} ({med.frequency})
                              </p>
                            ))}
                          </div>
                        </div>

                        <div>
                          <strong className="block text-sm font-medium mb-1">Doctor Notes:</strong>
                          <p className="p-2 rounded-md bg-muted/50 whitespace-pre-wrap">
                            {record.doctorNotes}
                          </p>
                        </div>

                        <div>
                          <strong className="block text-sm font-medium mb-1">Nursing Notes:</strong>
                          <p className="p-2 rounded-md bg-muted/50 whitespace-pre-wrap">
                            {record.nursingNotes}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => toggleExpand(index)}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:text-blue-800 rounded-md transition-all duration-200"
                      >
                        {expandedRecords.includes(index) ? "Read Less" : "Read More"}
                      </button>
                      <button
                        onClick={() => exportToPDF(record)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Export as PDF
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default ViewRecord;