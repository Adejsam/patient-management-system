import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminLayout from "../../shared/layout/AdminLayout";
import Header from "../../pages/components/headers/Header";
import Seo from "../../shared/seo/seo";
import { useTheme } from "next-themes";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Textarea from "../components/ui/Textarea";
import { z } from "zod";

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
});

const formSchema = z.object({
  date: z.string().min(1, { message: "Visit date is required" }),
  doctor: z.string().min(2, { message: "Doctor name is required" }),
  field: z.string().min(1, { message: "Medical field is required" }),
  temperature: z.string().min(1, { message: "Temperature is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  heartRate: z.string().optional(),
  bloodPressure: z.string().optional(),
  symptoms: z.string().min(1, { message: "Symptoms are required" }),
  allergies: z.string().min(1, { message: "Allergies required input none if no allergies" }),
  diagnosis: z.string().min(1, { message: "Diagnosis required input none if no diagnosis" }),
  labTests: z.string().min(1, { message: "Lab Test required input none if no lab test was done" }),
  labTestResults: z.string().min(1, { message: "Lab Result required input none if no lab result" }),
  medications: z.array(medicationSchema).optional().default([]),
  doctorNotes: z.string().min(1, { message: "Doctor notes are required" }),
  hospitalNumber: z.string().min(10, { message: "correct Hospital Number Required" }),
});

type FormValues = z.infer<typeof formSchema>;
export default function AddMedicalRecord() {
  useTheme();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      doctor: "",
      field: "",
      temperature: "",
      weight: "",
      heartRate: "",
      bloodPressure: "",
      symptoms: "",
      allergies: "",
      diagnosis: "",
      labTests: "",
      labTestResults: "",
      medications: [],
      doctorNotes: "",
      hospitalNumber: "", // Add hospital number field
    },
  });

  // Helper function to type-safe medication field names
  const getMedicationFieldName = (index: number, field: keyof z.infer<typeof medicationSchema>) => {
    return `medications.${index}.${field}` as const;
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole === "doctor") {
      setIsMounted(true);
    } else {
      // Redirect to unauthorized page if not a doctor
      window.location.href = "/admin/unauthorized";
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  const onSubmit = async (data: FormValues) => {
    if (!data.hospitalNumber || isNaN(parseInt(data.hospitalNumber))) {
      alert("Please enter a valid hospital number.");
      return;
    }
    const formattedDate = new Date(data.date).toISOString().split('T')[0];
    try {
      const response = await fetch("http://localhost/hospital_api/add_medical_records.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          visitDate: formattedDate,
          hospitalNumber: parseInt(data.hospitalNumber),
          temperature: parseFloat(data.temperature),
          weight: parseFloat(data.weight),
          heartRate: Number(data.heartRate || 0),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTimeout(() => {
          setSuccess("Medical record added successfully!");
        }, 2000);
        setError(null);
          form.reset()
      } else {
        setError(result.message || "Error adding medical record");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }finally{
    }
  };

  return (
    <AdminLayout>
      <Seo title="Add Medical Record" />
      <Header
        title="Add New Medical Record"
        breadcrumbLinkText="Dashboard"
        breadcrumbLinkHref="/"
      />
      <div className="min-h-[100vh] rounded-xl bg-muted/50 relative w-[97%] mx-auto mb-5 p-6">
        <h1 className="text-3xl/9 font-bold pt-5 pb-7 mb-2 pl-4">
          Add New <span className="text-primary">Medical Record</span>
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
            {/* Patient Information Section */}
            <div className="border-b py-7 border-t">
              <h2 className="text-xl font-bold mb-4">Patient Information</h2>
              <FormField
                control={form.control}
                name="hospitalNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="1092834736" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Visit Information Section */}
            <div className="border-b pb-7">
              <h2 className="text-xl font-bold mb-4">Visit Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visit Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="doctor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Samuel Adebisi" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="field"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Field</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Family Doctor" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Vital Signs Section */}
            <div className="border-b pb-7">
              <h2 className="text-xl font-bold mb-4">Vital Signs</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="26.3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="75" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heartRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heart Rate</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="72" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bloodPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Pressure</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="120/80" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Clinical Information Section */}
            <div className="border-b pb-7">
              <h2 className="text-xl font-bold mb-4">Clinical Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptoms</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Chest pain, dizziness" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="None" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Hypertension" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="labTests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lab Tests</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Lipid Profile" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="labTestResults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lab Test Results</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Cholesterol: 200 mg/dL" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Medications Section */}
            <div className="border-b pb-7">
              <h2 className="text-xl font-bold mb-4">Medications</h2>
              <div className="space-y-4">
                {form.watch("medications")?.map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4 border rounded-lg">
                    {(["name", "dosage", "frequency", "duration"] as const).map((fieldName) => (
                      <FormField
                        key={fieldName}
                        control={form.control}
                        name={getMedicationFieldName(index, fieldName)}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="destructive"
                      className="mt-2 w-fit"
                      onClick={() => {
                        const medications = form.getValues("medications");
                        medications.splice(index, 1);
                        form.setValue("medications", [...medications]); // Added spread operator for immutability
                      }}>
                      Remove Medication
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const medications = form.getValues("medications") || [];
                    form.setValue("medications", [
                      ...medications,
                      { name: "", dosage: "", frequency: "", duration: "" },
                    ]);
                  }}>
                  Add Medication
                </Button>
              </div>
            </div>

            {/* Notes Section */}
            <div className="border-b pb-7">
              <h2 className="text-xl font-bold mb-4">Notes</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="doctorNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[100px]"
                          placeholder="Monitor BP, follow up in 2 weeks"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4"
                  role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {success && (
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative my-4"
                  role="alert">
                  <span className="block sm:inline">{success}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit">Save Record</Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
