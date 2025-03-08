import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import Textarea from '../../components/ui/Textarea';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

interface ApiError {
  message: string;
  code?: string;
}

const complaintFormSchema = z.object({
  complaintType: z.string({
    required_error: "Please select the type of complaint",
  }),
  department: z.string({
    required_error: "Please select the relevant department",
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
  preferredContact: z.string({
    required_error: "Please select your preferred contact method",
  }),
  attachments: z.any().optional(),
});

type ComplaintFormValues = z.infer<typeof complaintFormSchema>;

const defaultValues: Partial<ComplaintFormValues> = {
  complaintType: "",
  department: "",
  subject: "",
  description: "",
  incidentDate: "",
};

export default function LodgeComplaintForm() {
    useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const form = useForm<ComplaintFormValues>({
      resolver: zodResolver(complaintFormSchema),
      defaultValues: {
        complaintType: "",
        department: "",
        subject: "",
        description: "",
        incidentDate: "",
        attachments: null
      },
    });

    const [isMounted, setIsMounted] = useState(false);
    
      useEffect(() => {
        setIsMounted(true);
      }, []);
    
      if (!isMounted) {
        return null;
      }
  
    async function onSubmit(data: ComplaintFormValues) {
      setIsSubmitting(true);
      try {
        // TODO: Implement API call to submit complaint
        console.log(data);
        
        toast.success("Complaint Submitted", {
          description: "Your complaint has been successfully logged. We will contact you shortly.",
        });
        
        // Reset all form fields
        form.reset(defaultValues);
  
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
  
      } catch (error: unknown) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : (error as ApiError)?.message || "An unexpected error occurred";
        
        console.error("Complaint submission error:", error);
        
        toast.error("Error", {
          description: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  
    return (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="complaintType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Complaint</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select complaint type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="service">Service Quality</SelectItem>
                            <SelectItem value="staff">Staff Behavior</SelectItem>
                            <SelectItem value="facility">Facility Issues</SelectItem>
                            <SelectItem value="billing">Billing Problems</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="outpatient">Receptionist</SelectItem>
                            <SelectItem value="pharmacy">Pharmacy</SelectItem>
                            <SelectItem value="laboratory">Laboratory</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
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
                          <Input type="date" {...field} />
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
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
  
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </Button>
              </form>
            </Form>
    );
  }