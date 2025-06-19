import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "../../../admin components/medical-record/data-table";
import { MedicalRecordData } from "../../../types/medical";
import { columns } from "../../../admin components/medical-record/column";

interface MedicalRecordApiResponse {
  success: boolean;
  message?: string;
  medicalRecords: {
    medicalRecord: {
      record_id: number;
      patient_id: number;
      visit_date: string;
      doctor: string;
      field: string;
      temperature: string;
      weight: string;
      heart_rate: number;
      blood_pressure: string;
      symptoms: string;
      allergies: string;
      diagnosis: string;
      lab_tests: string;
      lab_test_results: string;
      doctor_notes: string;
      first_name: string;
      last_name: string;
      date_of_birth: string;
      gender: string;
      primary_phone_number: string;
      hospital_number: number;
    };
    patientInfo: {
      name: string;
      dateOfBirth: string;
      gender: string;
      hospitalNumber: number;
      phoneNumber: string;
    };
    medications: {
      medicationId: number;
      name: string;
      dosage: string;
      frequency: string;
    }[];
  }[];
}

export default function MedicalRecordsTable() {
  const [data, setData] = useState<MedicalRecordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(localStorage);
    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get<MedicalRecordApiResponse>(
          "http://localhost/hospital_api/get_all_medical_record.php"
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch medical records");
        }

        // Transform the API response to match MedicalRecordData interface
        const transformedData = response.data.medicalRecords.map(
          (record): MedicalRecordData => ({
            id: record.medicalRecord.record_id.toString(),
            name: record.patientInfo.name,
            dateOfBirth: record.patientInfo.dateOfBirth,
            gender: record.patientInfo.gender,
            contactDetails: `${record.patientInfo.phoneNumber}, ${record.patientInfo.hospitalNumber}`,
            date: record.medicalRecord.visit_date,
            doctor: record.medicalRecord.doctor,
            field: record.medicalRecord.field,
            temperature: record.medicalRecord.temperature,
            weight: record.medicalRecord.weight,
            heartRate: record.medicalRecord.heart_rate.toString(),
            bloodPressure: record.medicalRecord.blood_pressure,
            symptoms: record.medicalRecord.symptoms,
            allergies: record.medicalRecord.allergies,
            diagnosis: record.medicalRecord.diagnosis,
            labTests: record.medicalRecord.lab_tests,
            labTestResults: record.medicalRecord.lab_test_results,
            medications: record.medications,
            doctorNotes: record.medicalRecord.doctor_notes,
            medicalRecord: {
              record_id: record.medicalRecord.record_id,
              patient_id: record.medicalRecord.patient_id,
              visit_date: record.medicalRecord.visit_date,
              doctor: record.medicalRecord.doctor,
              field: record.medicalRecord.field,
              temperature: record.medicalRecord.temperature,
              weight: record.medicalRecord.weight,
              heart_rate: record.medicalRecord.heart_rate,
              blood_pressure: record.medicalRecord.blood_pressure,
              symptoms: record.medicalRecord.symptoms,
              allergies: record.medicalRecord.allergies,
              diagnosis: record.medicalRecord.diagnosis,
              lab_tests: record.medicalRecord.lab_tests,
              lab_test_results: record.medicalRecord.lab_test_results,
              doctor_notes: record.medicalRecord.doctor_notes,
              first_name: record.medicalRecord.first_name,
              last_name: record.medicalRecord.last_name,
              date_of_birth: record.medicalRecord.date_of_birth,
              gender: record.medicalRecord.gender,
              primary_phone_number: record.medicalRecord.primary_phone_number,
              hospital_number: record.medicalRecord.hospital_number,
              created_at: "",
              updated_at: "",
            },
            patientInfo: {
              name: record.patientInfo.name,
              dateOfBirth: record.patientInfo.dateOfBirth,
              gender: record.patientInfo.gender,
              hospitalNumber: record.patientInfo.hospitalNumber,
              phoneNumber: record.patientInfo.phoneNumber,
            },
          })
        );

        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch medical records");
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  return (
    <div className="p-5">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading medical records...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
