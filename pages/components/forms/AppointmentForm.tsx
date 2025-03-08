import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Input } from "../../components/ui/input";
import { Calendar } from "../../components/ui/calendar";
import Textarea from "../../components/ui/Textarea";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useState } from "react";
import { useTheme } from "next-themes";

// Updated schema to match PHP backend requirements
const formSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  doctorName: z.string().min(1, "Doctor name is required"),
  appointmentDate: z.date({ required_error: "Appointment date is required" }),
  appointmentTime: z.string().min(1, "Appointment time is required"),
  reasonForVisit: z.string().min(1, "Reason for visit is required"),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .regex(/^(0|\+234)[789]\d{9}$/, "Invalid Nigerian phone number format"),
});

type FormData = z.infer<typeof formSchema>;

interface ApiResponse {
  success: boolean;
  message: string;
  appointmentId?: number;
}

const AppointmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  useTheme();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointmentDate: new Date(),
    },
  });

  // Updated to use the PHP backend API endpoint
  const handleApiSubmission = async (data: FormData): Promise<ApiResponse> => {
    try {
      // Update the endpoint to point to the PHP backend
      const response = await fetch("http://localhost/hospital_api/book_appointment.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          // Format date as YYYY-MM-DD for PHP backend
          appointmentDate: data.appointmentDate.toISOString().split("T")[0],
        }),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Network response was not ok");
      }

      return responseData;
    } catch (submitError) {
      console.error("Appointment submission error:", submitError);
      throw submitError;
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const response = await handleApiSubmission(data);

      if (response.success) {
        toast.success("Appointment booked successfully!");

        // Pass all relevant appointment details to the success page
        const queryString = new URLSearchParams({
          appointmentId: response.appointmentId?.toString() || "",
          date: data.appointmentDate.toISOString().split("T")[0],
          time: data.appointmentTime,
          doctor: data.doctorName,
          patient: data.patientName,
          reason: data.reasonForVisit,
          contactNumber: data.contactNumber,
        }).toString();

        // Navigate to the appointment success page with all the details
        router.push(`/patient/appointment-success?${queryString}`);
      } else {
        throw new Error(response.message);
      }
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Failed to book appointment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to check if a date is within the valid range
  const isDateInRange = (date: Date) => {
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setMonth(currentDate.getMonth() + 3);

    return date <= currentDate || date.getTime() > maxDate.getTime();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-7 my-7 pb-6">
        <div className="flex flex-wrap gap-5">
          <FormField
            name="patientName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="min-w-[250px] flex-1">
                <FormLabel>Patient Name</FormLabel>
                <FormControl>
                  <Input placeholder="Olumide Micheal" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="doctorName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="min-w-[250px] flex-1">
                <FormLabel>Doctor Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Doc Adeyemi James"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap gap-5">
          <FormField
            control={form.control}
            name="appointmentDate"
            render={({ field }) => (
              <FormItem className="flex flex-col min-w-[250px] flex-1 pt-[8px]">
                <FormLabel>Appointment Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant={"outline"}
                        className={cn(
                          "w-[100%] pl-3 text-left font-normal border data-[state=open]:border-primary ",
                          !field.value && "text-muted-foreground"
                        )}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      className="bg-background text-foreground border-border"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={isDateInRange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="appointmentTime"
            control={form.control}
            render={({ field }) => (
              <FormItem className="min-w-[250px] flex-1">
                <FormLabel>Appointment Time</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 8 }, (_, i) => {
                        const hour = i + 9;
                        const time = `${hour.toString().padStart(2, "0")}:00 ${
                          hour < 12 ? "AM" : "PM"
                        }`;
                        return (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="contactNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., +2347012345678" {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="reasonForVisit"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Visit</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your symptoms or reason for visit"
                  {...field}
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </Button>
      </form>
    </Form>
  );
};

export default AppointmentForm;
