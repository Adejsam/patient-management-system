import React, { useState, useEffect } from "react";
import PatientLayout from "../../shared/layout/PatientLayout";
import Header from "../../pages/components/headers/Header";
import Seo from "../../shared/seo/seo";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import Textarea from "../components/ui/Textarea";
import jsPDF from "jspdf";
import LightLogo from "../../public/assets/icons/logo-full-light.png";
import DarkLogo from "../../public/assets/icons/logo-full.svg";
import Image from "next/image";

const medicalRecordsData = [
  {
    name: "John Doe",
    dateOfBirth: "1980-05-15",
    gender: "Male",
    contactDetails: "john.doe@example.com",
    date: "2025-01-15",
    doctor: "Dr. John Doe",
    field: "Cardiology",
    diagnosis: "Hypertension",
    labTests: "Blood pressure test",
    labTestResults: "140/90 mmHg",
    medications: [{ name: "Lisinopril", dosage: "10mg", frequency: "Once daily" }],
    symptoms: "Headache, dizziness",
    allergies: "None",
    doctorNotes: "Patient advised to reduce salt intake and exercise regularly.",
    nursingNotes: "Patient monitored for blood pressure daily.",
  },
  {
    name: "Jane Smith",
    dateOfBirth: "1990-07-20",
    gender: "Female",
    contactDetails: "jane.smith@example.com",
    date: "2024-12-10",
    doctor: "Dr. Jane Smith",
    field: "Dermatology",
    diagnosis: "Eczema",
    labTests: "Skin biopsy",
    labTestResults: "Eczema confirmed",
    medications: [
      { name: "Hydrocortisone cream", dosage: "Apply twice daily", frequency: "Twice daily" },
    ],
    symptoms: "Itchy skin, redness",
    allergies: "None",
    doctorNotes: "Patient advised to avoid harsh soaps and keep skin moisturized.",
    nursingNotes: "Patient's skin condition monitored daily.",
  },
  // Add more medical records as needed
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

  interface MedicalRecord {
    name: string;
    dateOfBirth: string;
    gender: string;
    contactDetails: string;
    date: string;
    doctor: string;
    field: string;
    diagnosis: string;
    labTests: string;
    labTestResults: string;
    medications: { name: string; dosage: string; frequency: string }[];
    symptoms: string;
    allergies: string;
    doctorNotes: string;
    nursingNotes: string;
  }

  const exportToPDF = async (record: MedicalRecord) => {
    const doc = new jsPDF();
    const imgSrc = resolvedTheme === "dark" ? DarkLogo.src : LightLogo.src;

    const loadImage = (src: string) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = document.createElement("img");
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };

    try {
      const img = await loadImage(imgSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 5, 65, 20);
      }

      doc.setFontSize(18);
      doc.setFont("helvetica");
      doc.text("Medical Record", 105, 40, { align: "center" });

      doc.setFontSize(14);
      doc.text(`Name: ${record.name}`, 10, 50);
      doc.text(`Date of Birth: ${record.dateOfBirth}`, 10, 60);
      doc.text(`Gender: ${record.gender}`, 10, 70);
      doc.text(`Contact Details: ${record.contactDetails}`, 10, 80);

      doc.setFontSize(14);
      doc.text(`Date: ${record.date}`, 10, 90);
      doc.text(`Doctor: ${record.doctor}`, 10, 100);
      doc.text(`Field: ${record.field}`, 10, 110);
      doc.text(`Symptoms: ${record.symptoms}`, 10, 120);
      doc.text(`Allergies: ${record.allergies}`, 10, 130);
      doc.text(`Diagnosis: ${record.diagnosis}`, 10, 140);
      doc.text(`Lab Tests: ${record.labTests}`, 10, 150);
      doc.text(`Lab Test Results: ${record.labTestResults}`, 10, 160);

      doc.setFontSize(14);
      doc.text(`Doctor Notes:`, 10, 180);
      doc.text(record.doctorNotes, 10, 190, { maxWidth: 190 });

      doc.text(`Nursing Notes:`, 10, 210);
      doc.text(record.nursingNotes, 10, 220, { maxWidth: 190 });

      doc.setFontSize(14);
      doc.text("Medications", 10, 240);

      doc.setFontSize(14);
      record.medications.forEach(
        (med: { name: string; dosage: string; frequency: string }, index: number) => {
          doc.text(`${med.name} - ${med.dosage} (${med.frequency})`, 10, 250 + index * 10);
        }
      );

      doc.save(`Medical_Record_${record.date}.pdf`);
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  if (!isMounted) {
    return null;
  }

  const logosrc = resolvedTheme === "dark" ? LightLogo : DarkLogo;

  return (
    <PatientLayout>
      <Seo title="View Medical Records" />
      <Header title="View Medical Records" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="min-h-[100vh] rounded-xl bg-muted/50 relative w-[97%] mx-auto mb-5">
        <h1 className="text-3xl/9 font-bold pt-7 mb-2 pl-4">
          View Your <span className="text-primary">Medical Records</span>
        </h1>
        <h2 className="text-lg placeholder-opacity-80 pl-4 tracking-tight ">Your Health History</h2>

        <div className="p-4 my-5 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 pt-4 pb-8">
            {medicalRecordsData.map((record, index) => (
              <Card key={index} className="w-[400px] py-5 mb-5 md:w-full">
                <CardHeader>
                  <Image src={logosrc} alt="logo" height={200} width={200} className="pb-3" />
                  <CardTitle className="text-xl font-bold">{record.date}</CardTitle>
                  <CardDescription>
                    {record.doctor} - {record.field}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <label>
                      <strong>Symptoms:</strong>
                    </label>
                    <Input type="text" value={record.symptoms} disabled className="w-full mb-2" />
                  </div>
                  <div>
                    <label>
                      <strong>Allergies:</strong>
                    </label>
                    <Input type="text" value={record.allergies} disabled className="w-full mb-2" />
                  </div>
                  {expandedRecords.includes(index) && (
                    <>
                      <div>
                        <label>
                          <strong>Diagnosis:</strong>
                        </label>
                        <Input
                          type="text"
                          value={record.diagnosis}
                          disabled
                          className="w-full mb-2"
                        />
                      </div>
                      <div>
                        <label>
                          <strong>Lab Tests:</strong>
                        </label>
                        <Input
                          type="text"
                          value={record.labTests}
                          disabled
                          className="w-full mb-2"
                        />
                      </div>
                      <div>
                        <label>
                          <strong>Lab Test Results:</strong>
                        </label>
                        <Input
                          type="text"
                          value={record.labTestResults}
                          disabled
                          className="w-full mb-2"
                        />
                      </div>
                    
                      <div>
                        <label>
                          <strong>Medications:</strong>
                        </label>
                        <Textarea
                          value={record.medications
                            .map((med) => `${med.name} - ${med.dosage} (${med.frequency})`)
                            .join("\n")}
                          disabled
                          className="w-full mb-2"
                        />
                      </div>
                      
                      <div>
                        <label>
                          <strong>Doctor Notes:</strong>
                        </label>
                        <Textarea value={record.doctorNotes} disabled className="w-full mb-2" />
                      </div>
                      <div>
                        <label>
                          <strong>Nursing Notes:</strong>
                        </label>
                        <Textarea value={record.nursingNotes} disabled className="w-full mb-2" />
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <button
                      onClick={() => toggleExpand(index)}
                      className="mt-2 p-2 text-blue-600 rounded ">
                      {expandedRecords.includes(index) ? "Read Less" : "Read More"}
                    </button>
                    <button
                      onClick={() => exportToPDF(record)}
                      className="mt-2 p-2 bg-green-600 text-white rounded ">
                      Export as PDF
                    </button>
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
