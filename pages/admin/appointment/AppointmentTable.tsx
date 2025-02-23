import { Appointment, columns } from "./column";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";

function getData(): Promise<Appointment[]> {
  // Fetch data from your API here.
  return Promise.resolve([
    {
      id: "1",
      patientName: "John Doe",
      doctorName: "Dr. Smith",
      appointmentDate: "2023-10-01",
      appointmentTime: "10:00 AM",
      reasonForVisit: "Checkup",
      contactNumber: "0802745336",
      doctorContact: "0801234567",
    },
    {
      id: "2",
      patientName: "Jane Doe",
      doctorName: "Dr. Smith",
      appointmentDate: "2023-10-02",
      appointmentTime: "11:00 AM",
      reasonForVisit: "Consultation",
      contactNumber: "0802745337",
      doctorContact: "0801234568",
    },
    {
      id: "3",
      patientName: "Alice Smith",
      appointmentDate: "2023-10-03",
      appointmentTime: "12:00 PM",
      reasonForVisit: "Follow-up",
      contactNumber: "0802745338",
      doctorContact: "0801234569",
    },
    {
      id: "4",
      patientName: "Bob Jones",
      appointmentDate: "2023-10-04",
      appointmentTime: "01:00 PM",
      reasonForVisit: "Routine Checkup",
      contactNumber: "0802745339",
      doctorContact: "0801234570",
    },
    {
      id: "5",
      patientName: "Carol White",
      doctorName: "Dr. Smith",
      appointmentDate: "2023-10-05",
      appointmentTime: "02:00 PM",
      reasonForVisit: "Consultation",
      contactNumber: "0802745340",
      doctorContact: "0801234571",
    },
    {
      id: "6",
      patientName: "David Brown",
      appointmentDate: "2023-10-06",
      appointmentTime: "03:00 PM",
      reasonForVisit: "Follow-up",
      contactNumber: "0802745341",
      doctorContact: "0801234572",
    },
    {
      id: "7",
      patientName: "Emily Davis",
      doctorName: "Dr. Martinez",
      appointmentDate: "2023-10-07",
      appointmentTime: "04:00 PM",
      reasonForVisit: "Routine Checkup",
      contactNumber: "0802745342",
      doctorContact: "0801234573",
    },
    {
      id: "8",
      patientName: "Frank Thomas",
      doctorName: "Dr. Clark",
      appointmentDate: "2023-10-08",
      appointmentTime: "05:00 PM",
      reasonForVisit: "Consultation",
      contactNumber: "0802745343",
      doctorContact: "0801234574",
    },
    {
      id: "9",
      patientName: "Grace Lee",
      doctorName: "Dr. Lewis",
      appointmentDate: "2023-10-09",
      appointmentTime: "06:00 PM",
      reasonForVisit: "Follow-up",
      contactNumber: "0802745344",
      doctorContact: "0801234575",
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