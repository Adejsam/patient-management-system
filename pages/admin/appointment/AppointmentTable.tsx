import { columns } from "../../../admin components/appointments/column";
import { DataTable } from "../../../admin components/appointments/data-table";
import { useEffect, useState } from "react";

interface Appointment {
  appointment_id: string;
  appointment_datetime: Date;
  reason_for_visit: string;
  contact_email: string;
  status: string;
  patient_id: string;
  patient_name: string;
  patient_contact: string;
  doctor_id: string;
  doctor_name: string;
  doctor_specialization: string;
}

function getData(): Promise<Appointment[]> {
  return fetch("http://localhost/hospital_api/get_all_appointments.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (!data.success) {
        throw new Error(data.message);
      }
      // Convert datetime string to Date object
      return data.appointments.map((appointment: Appointment) => ({
        ...appointment,
        appointment_datetime: new Date(appointment.appointment_datetime),
      }));
    });
}

export default function Appointments() {
  const [data, setData] = useState<Appointment[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getData()
      .then((appointments) => {
        setData(appointments);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setErrorMessage("Failed to fetch appointments. Please try again later.");
      });
  }, []);

  if (errorMessage) {
    return (
      <div className="container mx-auto p-5">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
