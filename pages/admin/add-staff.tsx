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
import axios from "axios";

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
  photoUpload?: File | null;
  licenseNumber?: string;
  experienceYears?: string;
  specialization?: string;
  about?: string;
}

export const staffSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email format" }),
    phoneNumber: z.string().min(10, { message: "Phone number is required" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
    role: z.enum(["admin", "doctor", "pharmacist", "receptionist", "billing_officer"]),
    licenseNumber: z.string().optional(),
    experienceYears: z.string().optional(),
    specialization: z.string().optional(),
    about: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, "Passwords do not match")
  .superRefine((data, ctx) => {
    if (data.role === "doctor" || data.role === "pharmacist") {
      if (!data.licenseNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "License number is required",
          path: ["licenseNumber"],
        });
      }
    }

    if (data.role === "doctor") {
      if (!data.experienceYears) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Years of experience is required",
          path: ["experienceYears"],
        });
      }

      if (!data.specialization) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Specialization is required",
          path: ["specialization"],
        });
      }

      if (!data.about) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "About section is required",
          path: ["about"],
        });
      }
    }
  });

interface ApiDataInterface {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
  role: string;
  profile_picture?: string | null;
  license_number?: string;
  years_of_experience?: number;
  specialization?: string;
  about?: string;
}

export default function AddStaffPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [fileUploadError, setFileUploadError] = React.useState<string | null>(null);

  // Check if user is admin on component mount
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userRole = localStorage.getItem("userRole");
        if (userRole !== "admin") {
          router.push("/admin/unauthorized");
          return;
        }
      } catch {
        router.push("/admin/login");
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
      password: "",
      confirmPassword: "",
      role: "admin",
      photoUpload: undefined,
      licenseNumber: "",
      experienceYears: "",
      specialization: "",
      about: "",
    },
  });

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("photoUpload", file);

      const response = await axios.post(
        "http://localhost/hospital_api/picture_upload.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        return response.data.fileUrl;
      } else {
        throw new Error(response.data.error || "File upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      throw error;
    }
  };

  const handleAddStaff = async (values: StaffFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setFileUploadError(null);

    try {
      // Handle file upload if provided
      let uploadedPhoto: string | null = null;
      if (values.photoUpload instanceof File) {
        try {
          uploadedPhoto = await handleFileUpload(values.photoUpload);
        } catch (error) {
          setFileUploadError(error instanceof Error ? error.message : "Failed to upload photo");
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare API data
      const apiData: ApiDataInterface = {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone_number: values.phoneNumber,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role,
        profile_picture: uploadedPhoto || "",
        license_number: values.licenseNumber || "",
        years_of_experience: values.role === "doctor" ? parseInt(values.experienceYears || "0") : 0,
        specialization: values.specialization || "",
        about: values.about || "",
      };
      console.log("API Data:", apiData);

      // Make API request
      const response = await axios.post(
        "http://localhost/hospital_api/register_staff.php",
        apiData
      );
      const data = response.data;

      if (!data.success) {
        throw new Error(data.error || "Failed to add staff member");
      }

      setSubmitSuccess(true);
      form.reset();

      // Redirect after success
      setTimeout(() => {
        router.push("/admin/manage-staff");
      }, 2000);
    } catch (error) {
      console.error("Error adding staff:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to add staff. Please try again."
      );
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

  // Watch role to conditionally render fields
  const selectedRole = form.watch("role");

  return (
    <AdminLayout>
      <Seo title="Add New Staff"></Seo>
      <Header
        title="Add New Staff"
        breadcrumbLinkText="Manage Staff"
        breadcrumbLinkHref="/admin/staff"
      />
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
                          <SelectItem value="billing_officer">Billing Officer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedRole === "doctor" && (
                  <div className="space-y-4">
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
                      name="photoUpload"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>Photo Upload</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  field.onChange(e.target.files[0]);
                                } else {
                                  field.onChange(null);
                                }
                              }}
                              name="profile_picture"
                              disabled={isSubmitting}
                              accept="image/"
                            />
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
                            <Input
                              {...field}
                              placeholder="Enter Years of Experience"
                              type="number"
                            />
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
                  </div>
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
              </div>
              {fileUploadError && (
                <div className="text-red-900 p-2 bg-red-300 rounded-md text-sm my-4 mx-4 text-center">
                  {fileUploadError}
                </div>
              )}

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
