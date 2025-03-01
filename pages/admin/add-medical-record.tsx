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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import Textarea from "../components/ui/Textarea";
import { z } from "zod";

const medicalFields = [
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Emergency",
];

const genders = ["Male", "Female", "Other"];

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
});

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  contactDetails: z.string().min(2, { message: "Contact details are required" }),
  date: z.string().min(1, { message: "Visit date is required" }),
  doctor: z.string().min(2, { message: "Doctor name is required" }),
  field: z.string().min(1, { message: "Medical field is required" }),
  temperature: z.string().min(1, { message: "Temperature is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  heartRate: z.string().optional(),
  bloodPressure: z.string().optional(),
  symptoms: z.string().min(1, { message: "Symptoms are required" }),
  allergies: z.string().optional(),
  diagnosis: z.string().optional(),
  labTests: z.string().optional(),
  labTestResults: z.string().optional(),
  medications: z.array(medicationSchema).optional().default([]),
  doctorNotes: z.string().min(1, { message: "Doctor notes are required" }),
  nursingNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddMedicalRecord() {
  useTheme();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      gender: "",
      contactDetails: "",
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
      nursingNotes: "",
    },
  });

  // Helper function to type-safe medication field names
  const getMedicationFieldName = (index: number, field: keyof z.infer<typeof medicationSchema>) => {
    return `medications.${index}.${field}` as const;
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Form submitted:", data);
      alert("Medical record added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
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
              <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genders.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Details</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                        <Input type="date" {...field} />
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
                        <Input {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select medical field" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {medicalFields.map((medicalField) => (
                            <SelectItem key={medicalField} value={medicalField}>
                              {medicalField}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Textarea {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nursingNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nursing Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
