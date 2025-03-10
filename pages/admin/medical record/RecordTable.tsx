import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { MedicalRecordData } from "../../../types/medical";
import { columns } from "./column";

export default function MedicalRecordsTable() {
  const [data, setData] = useState<MedicalRecordData[]>([]);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        // Simulated API call - replace with actual API
        const mockData = [
          {
            id: "1",
            name: "Adebayo Oluwaseun",
            dateOfBirth: "1985-05-12",
            gender: "Male",
            contactDetails: "adebayo.seun@example.com, +2348061234567",
            date: "2023-10-01",
            doctor: "Dr. Okafor",
            field: "Cardiology",
            temperature: "37°C",
            weight: "75kg",
            heartRate: "72 bpm",
            bloodPressure: "120/80 mmHg",
            symptoms: "Chest pain, dizziness",
            allergies: "None",
            diagnosis: "Stable angina",
            labTests: "ECG",
            labTestResults: "Normal sinus rhythm",
            medications: [
              {
                name: "Atenolol",
                dosage: "50mg",
                frequency: "once daily",
              },
            ],
            doctorNotes: "Continue current medication regimen",
            nursingNotes: "Patient educated on heart-healthy lifestyle",
          },
          {
            id: "2",
            name: "Chioma Eze",
            dateOfBirth: "1978-09-22",
            gender: "Female",
            contactDetails: "chioma.eze@example.com, +2348023456789",
            date: "2023-10-02",
            doctor: "Dr. Adeyemi",
            field: "Dermatology",
            temperature: "36.8°C",
            weight: "68kg",
            heartRate: "68 bpm",
            bloodPressure: "118/76 mmHg",
            symptoms: "Rash, itching",
            allergies: "Pollen",
            diagnosis: "Eczema",
            labTests: "Allergy Test",
            labTestResults: "Positive for dust mites",
            medications: [
              {
                name: "Hydrocortisone Cream",
                dosage: "as directed",
                frequency: "twice daily",
              },
            ],
            doctorNotes: "Apply cream as directed, follow up in 1 month",
            nursingNotes: "Patient instructed on proper skin care routine",
          },
          {
            id: "3",
            name: "Emeka Nwosu",
            dateOfBirth: "1975-03-10",
            gender: "Male",
            contactDetails: "emeka.nwosu@example.com, +2348134567890",
            date: "2023-10-05",
            doctor: "Dr. Yusuf",
            field: "Urology",
            temperature: "36.7°C",
            weight: "80kg",
            heartRate: "69 bpm",
            bloodPressure: "122/78 mmHg",
            symptoms: "Frequent urination, lower back pain",
            allergies: "Penicillin",
            diagnosis: "Kidney Stones",
            labTests: "CT Scan",
            labTestResults: "Calcium oxalate stones detected",
            medications: [
              {
                name: "Tamsulosin",
                dosage: "0.4mg",
                frequency: "once daily",
              },
            ],
            doctorNotes: "Increase fluid intake, follow up in 4 weeks",
            nursingNotes: "Patient advised on dietary changes",
          },
          {
            id: "4",
            name: "Folake Adebisi",
            dateOfBirth: "1992-07-08",
            gender: "Female",
            contactDetails: "folake.adebisi@example.com, +2349012345678",
            date: "2023-10-04",
            doctor: "Dr. Balogun",
            field: "Gynecology",
            temperature: "37.1°C",
            weight: "62kg",
            heartRate: "65 bpm",
            bloodPressure: "116/74 mmHg",
            symptoms: "Abdominal pain, irregular periods",
            allergies: "None",
            diagnosis: "Endometriosis",
            labTests: "Ultrasound",
            labTestResults: "Presence of endometrial tissue outside uterus",
            medications: [
              {
                name: "Naproxen",
                dosage: "500mg",
                frequency: "twice daily",
              },
            ],
            doctorNotes: "Start medication, follow up in 3 months",
            nursingNotes: "Patient educated on condition and treatment options",
          },
          {
            id: "5",
            name: "Oluwasegun Adewale",
            dateOfBirth: "1980-11-15",
            gender: "Male",
            contactDetails: "oluwasegun.adewale@example.com, +2349098765432",
            date: "2023-10-03",
            doctor: "Dr. Olayemi",
            field: "Orthopedics",
            temperature: "36.9°C",
            weight: "85kg",
            heartRate: "70 bpm",
            bloodPressure: "125/82 mmHg",
            symptoms: "Knee pain, swelling",
            allergies: "Sulfa drugs",
            diagnosis: "Meniscus Tear",
            labTests: "MRI Scan",
            labTestResults: "Tear in medial meniscus",
            medications: [
              {
                name: "Ibuprofen",
                dosage: "400mg",
                frequency: "every 6 hours",
              },
            ],
            doctorNotes: "Rest, ice, and elevation. Follow up in 2 weeks",
            nursingNotes: "Patient instructed on RICE protocol",
          },
          {
            id: "6",
            name: "Chioma Eze",
            dateOfBirth: "1978-09-22",
            gender: "Female",
            contactDetails: "chioma.eze@example.com, +2348023456789",
            date: "2023-10-02",
            doctor: "Dr. Adeyemi",
            field: "Dermatology",
            temperature: "36.8°C",
            weight: "68kg",
            heartRate: "68 bpm",
            bloodPressure: "118/76 mmHg",
            symptoms: "Rash, itching",
            allergies: "Pollen",
            diagnosis: "Eczema",
            labTests: "Allergy Test",
            labTestResults: "Positive for dust mites",
            medications: [
              {
                name: "Hydrocortisone Cream",
                dosage: "as directed",
                frequency: "twice daily",
              },
            ],
            doctorNotes: "Apply cream as directed, follow up in 1 month",
            nursingNotes: "Patient instructed on proper skin care routine",
          },
          {
            id: "7",
            name: "Adebayo Oluwaseun",
            dateOfBirth: "1985-05-12",
            gender: "Male",
            contactDetails: "adebayo.seun@example.com, +2348061234567",
            date: "2023-10-01",
            doctor: "Dr. Okafor",
            field: "Cardiology",
            temperature: "37°C",
            weight: "75kg",
            heartRate: "72 bpm",
            bloodPressure: "120/80 mmHg",
            symptoms: "Chest pain, dizziness",
            allergies: "None",
            diagnosis: "Hypertension",
            labTests: "Lipid Profile",
            labTestResults: "Cholesterol: 200 mg/dL",
            medications: [
              {
                name: "Lisinopril",
                dosage: "10mg",
                frequency: "once daily",
              },
            ],
            doctorNotes: "Monitor BP, follow up in 2 weeks",
            nursingNotes: "Patient advised on low sodium diet",
          },
        ];
        return mockData;
      } catch (error) {
        console.error("Error fetching medical records:", error);
        return [];
      }
    };

    fetchMedicalRecords().then((records) => setData(records));
  }, []);

  return (
    <div className="p-5">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
