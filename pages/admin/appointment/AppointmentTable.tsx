import { Appointment, columns } from "./column";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";

function getData(): Promise<Appointment[]> {
  // Fetch data from your API here.
  return Promise.resolve([
    {
      id: "1",
      patientName: "Chinedu Okafor",
      doctorName: "Doc Adebayo",
      appointmentDate: "2025-03-09",
      appointmentTime: "10:00 AM",
      reasonForVisit: "Checkup",
      contactNumber: "0802745336",
      doctorContact: "0801234567",
      doctorField: "Cardiology",
      status: "Pending",
    },
    {
      id: "2",
      patientName: "Amina Yusuf",
      doctorName: "Doc Adebayo",
      appointmentDate: "2025-03-13",
      appointmentTime: "11:00 AM",
      reasonForVisit: "Consultation",
      contactNumber: "0802745337",
      doctorContact: "0801234568",
      doctorField: "Cardiology",
      status: "Pending",
    },
    {
      id: "3",
      patientName: "Bola Adigun",
      doctorName: "Doc Adebayo",
      appointmentDate: "2025-03-05",
      appointmentTime: "12:00 PM",
      reasonForVisit: "Follow-up",
      contactNumber: "0802745338",
      doctorContact: "0801234569",
      doctorField: "Cardiology",
      status: "Pending",
    },
    {
      id: "4",
      patientName: "Emeka Uche",
      doctorName: "Doc Adebayo",
      appointmentDate: "2025-03-11",
      appointmentTime: "01:00 PM",
      reasonForVisit: "Routine Checkup",
      contactNumber: "0802745339",
      doctorContact: "0801234570",
      doctorField: "Cardiology",
      status: "Pending",
    },
    {
      id: "5",
      patientName: "Kemi Balogun",
      doctorName: "Doc Adebayo",
      appointmentDate: "2025-03-14",
      appointmentTime: "02:00 PM",
      reasonForVisit: "Consultation",
      contactNumber: "0802745340",
      doctorContact: "0801234571",
      doctorField: "Cardiology",
      status: "Pending",
    },
    {
      id: "6",
      patientName: "Ibrahim Musa",
      doctorName: "Doc Adebayo",
      appointmentDate: "2025-03-10",
      appointmentTime: "03:00 PM",
      reasonForVisit: "Follow-up",
      contactNumber: "0802745341",
      doctorContact: "0801234572",
      doctorField: "Cardiology",
      status: "Pending",
    },
    {
      id: "7",
      patientName: "Chisom Nwankwo",
      doctorName: "Doc Musa",
      appointmentDate: "2025-03-09",
      appointmentTime: "04:00 PM",
      reasonForVisit: "Routine Checkup",
      contactNumber: "0802745342",
      doctorContact: "0801234573",
      doctorField: "Cardiology",
      status: "Pending",
    },
    {
      id: "8",
      patientName: "Tunde Adeyemi",
      doctorName: "Doc Okonkwo",
      appointmentDate: "2025-03-08",
      appointmentTime: "05:00 PM",
      reasonForVisit: "Consultation",
      contactNumber: "0802745343",
      doctorContact: "0801234574",
      doctorField: "Cardiology",
      status: "Pending",
    },
    {
      id: "9",
      patientName: "Fatima Abdullahi",
      doctorName: "Doc Olayemi",
      appointmentDate: "2023-03-09",
      appointmentTime: "06:00 PM",
      reasonForVisit: "Follow-up",
      contactNumber: "0802745344",
      doctorContact: "0801234575",
      doctorField: "Cardiology",
      status: "Pending",
    },
  ]);
}

export default function Appointments() {
  const [data, setData] = useState<Appointment[]>([]);

  useEffect(() => {
    getData().then((data) => setData(data));
  }, []);

  return (
    <div className="container mx-auto p-5">
      <DataTable columns={columns} data={data} />
    </div>
  );
}