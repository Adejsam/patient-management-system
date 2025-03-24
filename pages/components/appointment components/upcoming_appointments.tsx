import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";

interface Appointment {
  appointment_id: string;
  appointment_datetime: string;
  doctor_name: string;
}

export const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const patientId = localStorage.getItem("patientId") || "";
        const response = await fetch(
          `http://localhost/hospital_api/upcoming_appointment.php?patient_id=${patientId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (data.success) {
          setAppointments(data.appointments);
        } else {
          console.error("API Error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchAppointments();
    }
  }, [mounted]);

  if (loading) {
    return (
      <Card className="md:w-full">
        <CardContent className="flex items-center space-x-4 p-4">
          <Calendar className="w-10 h-10 text-blue-500" />
          <div>
            <h2 className="text-lg font-semibold">Loading Appointments...</h2>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className="md:w-full">
        <CardContent className="flex items-center space-x-4 p-4">
          <Calendar className="w-10 h-10 text-blue-500" />
          <div>
            <h2 className="text-lg font-semibold">No Upcoming Appointments</h2>
            <p className="text-gray-500">No confirmed appointments found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {appointments.map((appointment, index) => (
        <Card key={index} className="md:w-full">
          <CardContent className="flex items-center space-x-4 p-4">
            <Calendar className="w-10 h-10 text-blue-500" />
            <div>
              <h2 className="text-lg font-semibold">Upcoming Appointment</h2>
              <p>
                {new Date(appointment.appointment_datetime).toLocaleDateString()} at{" "}
                {new Date(appointment.appointment_datetime).toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-500">Dr. {appointment.doctor_name}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
