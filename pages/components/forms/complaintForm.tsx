import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "../../../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../ui/form";
import Textarea from "../../../ui/Textarea";
import { Input } from "../../../ui/input";

const complaintFormSchema = z.object({
  complaintType: z.string({
    required_error: "Please select the type of complaint",
  }),
  patientName: z.string({
    required_error: "Please enter registered name",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }),
  incidentDate: z.string({
    required_error: "Please select the date of incident",
  }),
  attachments: z.any().optional(),
});

type ComplaintFormValues = z.infer<typeof complaintFormSchema>;

export default function LodgeComplaintForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      complaintType: "",
      patientName: "",
      subject: "",
      description: "",
      incidentDate: "",
      attachments: [] as File[],
    },
  });

  const onSubmit = async (data: ComplaintFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Convert form data to FormData format
      const formData = new FormData();

      // Add regular form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "attachments" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Handle file uploads
      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach((file: File, index: number) => {
          formData.append(`attachments[${index}]`, file);
        });
      }

      // First API call to lodge complaint
      const complaintResponse = await fetch("http://localhost/hospital_api/lodge_complaint.php", {
        method: "POST",
        body: formData,
      });

      const complaintResult = await complaintResponse.json();

      if (!complaintResult.success) {
        throw new Error(complaintResult.message || "Failed to lodge complaint");
      }

      const complaintId = complaintResult.complaintId;

      // Handle file uploads if any
      if (data.attachments && data.attachments.length > 0) {
        const fileFormData = new FormData();
        fileFormData.append("complaintId", complaintId.toString());

        data.attachments.forEach((file: File, index: number) => {
          fileFormData.append(`attachments[${index}]`, file);
        });

        const uploadResponse = await fetch(
          "http://localhost/hospital_api/complain_file_upload.php",
          {
            method: "POST",
            body: fileFormData,
          }
        );

        // Check if response is JSON before parsing
        if (!uploadResponse.headers.get("Content-Type")?.includes("application/json")) {
          throw new Error("Failed to upload attachments - invalid response format");
        }

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success) {
          throw new Error(uploadResult.message || "Failed to upload attachments");
        }
      }

      setTimeout(() => {
        setSuccessMessage("Complaint lodged successfully! we will get back to you");
        form.reset();
      }, 2000);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      // Handle JSON parsing errors
      if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
        setErrorMessage("Failed to process response. Please try again.");
      } else {
        setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
      }
      console.error("Complaint submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Registered name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complaintType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Complaint</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g service Quality" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Brief subject of your complaint" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="incidentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Incident</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="text-muted-foreground w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complaint Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please provide detailed information about your complaint"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attachments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachments (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      field.onChange(Array.from(files));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {successMessage && (
          <div className="text-center mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="text-center mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </Button>
      </form>
    </Form>
  );
}
