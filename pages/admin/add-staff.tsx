"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AdminLayout from "../../shared/layout/AdminLayout";
import Header from "../components/headers/Header";
import Seo from "../../shared/seo/seo";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Textarea from "../components/ui/Textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "../components/ui/form";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";

// Define the staff schema with validation
const staffSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phoneNumber: z.string().min(10, { message: "Phone number is required" }),
  role: z.enum(["doctor", "admin", "pharmacist", "receptionist", "billingOfficer"]),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm password is required" }),
  experienceYears: z.string().optional(),
  licenseNumber: z.string().optional(),
  specialization: z.string().optional(),
  about: z.string().optional(),
  photoUpload: z
        .any()
        .refine((file) => file instanceof File, "Photo upload must be a file"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    if (data.role === "doctor") {
      return !!data.licenseNumber && !!data.experienceYears && !!data.specialization && !!data.about;
    }
    if (data.role === "pharmacist") {
      return !!data.licenseNumber;
    }
    return true;
  },
  {
    message: "Required fields missing for selected role",
    path: ["role"],
  }
);

type StaffFormData = z.infer<typeof staffSchema>;

export default function AddStaffPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin on component mount
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/login');
        return;
      }
      
      try {
        const userRole = localStorage.getItem("userRole")
        if (userRole !== 'admin') {
          router.push('/admin/unauthorized');
          return;
        }
        setIsAdmin(true);
      } catch  {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      photoUpload: undefined,
      role: "admin",
      password: "",
      confirmPassword: "",
      experienceYears: "",
      licenseNumber: "",
      specialization: "",
      about: "",
    },
  });

  const handleAddStaff = async (values: StaffFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      
      // Map form field names to API expected names
      const apiData = {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone_number: values.phoneNumber,
        profile_picture: values.photoUpload || undefined,  
        role: values.role === "billingOfficer" ? "billing_officer" : values.role,
        password: values.password,
        years_of_experience: values.experienceYears || "",
        license_number: values.licenseNumber || "",
        specialization: values.specialization || "",
        about: values.about || "",
      };

      // Handle file upload if provided
      if (values.photoUpload instanceof File) {
        const formData = new FormData();
        formData.append('photoUpload', values.photoUpload);
        
        // You could upload the file first and get a URL back
         const fileUploadResponse = await fetch("http://localhost/hospital_api/file_upload.php", {
           method: "POST",
           body: formData,
        });
        const fileData = await fileUploadResponse.json();
        values.photoUpload = fileData.fileUrl; // Replace file object with URL
      }

      // Make API request with JSON data
      const response = await fetch("http://localhost/hospital_api/register_staff.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (data.error) {
        setSubmitError(data.message || "Failed to add staff member");
        return;
      }

      setSubmitSuccess(true);
      form.reset();
      
      // Redirect to staff list after 2 seconds
      setTimeout(() => {
        router.push('/admin/manage-staff');
      }, 1000);
      
    } catch (error) {
      console.error("Error adding staff:", error);
      setSubmitError("Failed to add staff. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Theme setup
  useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isAdmin) return null; // Don't render anything until we confirm user is admin

  // Watch role to conditionally render fields
  const selectedRole = form.watch("role");

  return (
    <AdminLayout>
      <Seo title="Add New Staff"></Seo>
      <Header title="Add New Staff" breadcrumbLinkText="Manage Staff" breadcrumbLinkHref="/admin/staff" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-[97%] mx-auto">
          <h1 className="text-3xl/9 font-bold mt-5 mb-2 pl-5 pt-5">
            Add New <span className="text-primary">Staff Member</span>
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddStaff)} className="space-y-8 my-10 px-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter First Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Last Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Email" type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Phone Number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Password" type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Confirm Password" type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="pharmacist">Pharmacist</SelectItem>
                          <SelectItem value="receptionist">Receptionist</SelectItem>
                          <SelectItem value="billingOfficer">Billing Officer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photoUpload"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <Input 
                          type="file"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          disabled={isSubmitting}
                          name="profile_picture" accept="image/"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedRole === "doctor" && (
                  <>
                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter License Number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Specialization" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienceYears"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Years of Experience" type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="about"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Enter doctor's bio and qualifications" 
                              className="min-h-[120px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {selectedRole === "pharmacist" && (
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter License Number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedRole !== "doctor" && (
                  <FormField
                    control={form.control}
                    name="experienceYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Years of Experience" type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              {submitError && (
            <div className="text-red-900 p-2 bg-red-300 rounded-md text-sm my-4 mx-4 text-center">
              {submitError}
            </div>
          )}
          
          {submitSuccess && (
            <div className="text-green-900 p-2 bg-green-300 rounded-md text-sm my-4 mx-4 text-center">
              Staff member added successfully! Redirecting to staff list...
            </div>
          )}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Staff Member...
                  </>
                ) : (
                  "Add Staff Member"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
}