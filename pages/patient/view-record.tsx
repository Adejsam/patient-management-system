import React, { useState, useEffect } from "react";
import PatientLayout from "../../shared/layout/PatientLayout";
import Header from "../../pages/components/headers/Header";
import Seo from "../../shared/seo/seo";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { generateMedicalRecordPDF } from "../../services/PDFMedicalGenerator";
import LightfullLogo from "../../public/assets/icons/logo-full-light.png";
import DarkfullLogo from "../../public/assets/icons/logo-full.svg";
import Image from "next/image";
import { MedicalRecordData } from "../../types/medical";

const ViewRecord: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [expandedRecords, setExpandedRecords] = useState<number[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const patientId = localStorage.getItem('patientId') || "";
    
    if (patientId) {
      fetchMedicalRecords(patientId);
    } else {
      // Handle case where patientId is not found in local storage
      setError("Patient ID not found. Please log in again.");
    }
  }, []);

  const fetchMedicalRecords = async (patientId: string) => {
    try {
      const response = await fetch(`http://localhost/hospital_api/get_medical_records.php?patientId=${patientId}`);
      const data = await response.json();

      if (data.success) {
        setMedicalRecords(data.medicalRecords);
      } else {
        setError(data.message || "Failed to fetch medical records");
      }
    } catch (err) {
      setError("An error occurred while fetching your medical records");
      console.error("Error fetching medical records:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedRecords((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const exportToPDF = async (record: MedicalRecordData) => {
    try {
      const logoSrc = resolvedTheme === "dark" ? DarkfullLogo.src : LightfullLogo.src;
      await generateMedicalRecordPDF(record, logoSrc);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  if (!isMounted) return null;

  const logoSrc = resolvedTheme === 'dark' ? DarkfullLogo : LightfullLogo;

  return (
    <PatientLayout>
      <Seo title="View Medical Records" />
      <Header title="View Medical Records" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="min-h-[100vh] rounded-xl bg-muted/50 relative w-[97%] mx-auto mb-5">
        <h1 className="text-3xl/9 font-bold pt-7 mb-2 pl-4">
          View Your <span className="text-primary">Medical Records</span>
        </h1>
        <h2 className="text-lg placeholder-opacity-80 pl-4 tracking-tight">Your Health History</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : (
          <div className="p-4 my-5 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 pt-4 pb-8">
              {medicalRecords.map((record, index) => (
                <Card
                  key={index}
                  className="w-[400px] py-5 mb-5 md:w-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <Image src={logoSrc} alt="logo" height={200} width={200} className="pb-3" />
                    <CardTitle className="text-xl font-bold">{record.medicalRecord.visit_date}</CardTitle>
                    <CardDescription>
                    {`Doc  ${record.medicalRecord.doctor} - ${record.medicalRecord.field}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <strong className="block text-sm font-medium mb-1">Patient Name:</strong>
                          <p className="p-2 rounded-md bg-muted/50">{record.patientInfo.name}</p>
                        </div>
                        <div>
                          <strong className="block text-sm font-medium mb-1">Date of Birth:</strong>
                          <p className="p-2 rounded-md bg-muted/50">{record.patientInfo.dateOfBirth}</p>
                        </div>
                        <div>
                          <strong className="block text-sm font-medium mb-1">Gender:</strong>
                          <p className="p-2 rounded-md bg-muted/50">{record.patientInfo.gender}</p>
                        </div>
                        <div>
                          <strong className="block text-sm font-medium mb-1">Contact:</strong>
                          <p className="p-2 rounded-md bg-muted/50">{record.patientInfo.phoneNumber}</p>
                        </div>
                      </div>

                      {!expandedRecords.includes(index) && (
                        <div className="flex justify-between mt-4">
                          <button
                            onClick={() => toggleExpand(index)}
                            className="px-4 py-2 text-blue-600 hover:text-blue-800 rounded-md transition-all duration-200">
                            View Details
                          </button>
                          <button
                            onClick={() => exportToPDF(record)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                            Export as PDF
                          </button>
                        </div>
                      )}

                      {expandedRecords.includes(index) && (
                        <div className="space-y-4">
                          <div>
                            <strong className="block text-sm font-medium mb-1">Vital Signs:</strong>
                            <div className="p-2 rounded-md bg-muted/50">
                              <p className="mb-1">Temperature: {record.medicalRecord.temperature}</p>
                              <p className="mb-1">Weight: {record.medicalRecord.weight}</p>
                              <p className="mb-1">Heart Rate: {record.medicalRecord.heart_rate}</p>
                              <p className="mb-1">Blood Pressure: {record.medicalRecord.blood_pressure}</p>
                            </div>
                          </div>

                          <div>
                            <strong className="block text-sm font-medium mb-1">Symptoms:</strong>
                            <p className="p-2 rounded-md bg-muted/50">{record.medicalRecord.symptoms}</p>
                          </div>

                          <div>
                            <strong className="block text-sm font-medium mb-1">Allergies:</strong>
                            <p className="p-2 rounded-md bg-muted/50">{record.medicalRecord.allergies}</p>
                          </div>

                          <div>
                            <strong className="block text-sm font-medium mb-1">Diagnosis:</strong>
                            <p className="p-2 rounded-md bg-muted/50">{record.medicalRecord.diagnosis}</p>
                          </div>

                          <div>
                            <strong className="block text-sm font-medium mb-1">Lab Tests:</strong>
                            <p className="p-2 rounded-md bg-muted/50">{record.medicalRecord.lab_tests}</p>
                          </div>

                          <div>
                            <strong className="block text-sm font-medium mb-1">
                              Lab Test Results:
                            </strong>
                            <p className="p-2 rounded-md bg-muted/50">{record.medicalRecord.lab_test_results}</p>
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
                              {record.medicalRecord.doctor_notes}
                            </p>
                          </div>

                          <div className="flex justify-between mt-4">
                            <button
                              onClick={() => toggleExpand(index)}
                              className="px-4 py-2 text-blue-600 hover:text-blue-800 rounded-md transition-all duration-200">
                              Hide Details
                            </button>
                            <button
                              onClick={() => exportToPDF(record)}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                              Export as PDF
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default ViewRecord;