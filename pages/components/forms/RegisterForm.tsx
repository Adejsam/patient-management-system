import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";

const formSchema = z
  .object({
    firstName: z.string().min(3, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(3, "Last name is required"),
    dateOfBirth: z.string({ required_error: "Date of birth is required" }),
    gender: z.enum(["Male", "Female", "Other", "Prefer Not to Say"]),
    photoUpload: z
      .any()
      .optional()
      .refine((file) => file instanceof File, "Photo upload must be a file"),
    primaryPhoneNumber: z
      .string()
      .min(11, "Primary phone number is required")
      .max(11, "Primary phone number is required"),
    alternatePhoneNumber: z.string().optional(),
    email: z.string().email("Invalid email format"),
    residentialAddress: z.object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      country: z.string().min(1, "Country is required"),
    }),
    emergencyContact: z.object({
      name: z.string().min(1, "Emergency contact name is required"),
      relationship: z.string().min(1, "Relationship is required"),
      phoneNumber: z.string().min(1, "Emergency contact phone number is required"),
    }),
    bloodGroup: z.string().optional(),
    knownAllergies: z.string().optional(),
    preExistingConditions: z.string().optional(),
    primaryPhysician: z.string().optional(),
    healthInsurance: z.object({
      insuranceNumber: z.string().optional(),
      provider: z.string().optional(),
    }),
    maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
    occupation: z.string().optional(),
    consentForDataUsage: z.boolean(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  })
  .refine(
    ({ password, confirmPassword }) => password === confirmPassword || !password,
    "Passwords do not match"
  );

type FormData = z.infer<typeof formSchema>;
type RegistrationResponse = {
  message: string;
  hospital_number?: string;
  error?: string;
};

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<RegistrationResponse | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "Male",
      photoUpload: undefined,
      primaryPhoneNumber: "",
      alternatePhoneNumber: "",
      email: "",
      residentialAddress: {
        street: "",
        city: "",
        state: "",
        country: "",
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phoneNumber: "",
      },
      bloodGroup: "",
      knownAllergies: "",
      preExistingConditions: "",
      primaryPhysician: "",
      healthInsurance: {
        insuranceNumber: "",
        provider: "",
      },
      maritalStatus: "Single",
      occupation: "",
      consentForDataUsage: false,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setRegistrationSuccess(null);
    console.log(FormData);

    try {
      // Handle file upload separately if needed
      if (values.photoUpload instanceof File) {
        const formData = new FormData();
        formData.append("photoUpload", values.photoUpload);

        // You could upload the file first and get a URL back
        const fileUploadResponse = await fetch("http://localhost/hospital_api/file_upload.php", {
          method: "POST",
          body: formData,
        });
        const fileData = await fileUploadResponse.json();
        values.photoUpload = fileData.fileUrl; // Replace file object with URL
      }

      // For regular JSON submission
      const response = await fetch("http://localhost/hospital_api/register_patient.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.message) {
        setRegistrationSuccess(data);
        form.reset();
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again later.");
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 " method="POST">
        <section className="">
          <h1 className="header text-3xl font-bold">Welcome 👋</h1>
          <p className="text-dark-700 text-xl">Let us know more about yourself.</p>
        </section>

        <section className="">
          <div className="mt-10 mb-5">
            <h2 className="sub-header text-2xl font-semibold  pb-[5px]">
              <span className="border-b-[3px] boder border-b-green-500 rounded-md">Personal</span>{" "}
              Information
            </h2>
          </div>
        </section>

        {/* form fields */}
        <div className="flex flex-wrap gap-5">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="min-w-[250px] flex-1">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem className="min-w-[250px] flex-1">
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="William" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap gap-5">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="min-w-[250px] flex-1">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Frank" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-2">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col min-w-[250px] flex-1">
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      disabled={isSubmitting}
                      placeholder="Pick Date of Birth"
                      max={new Date().toISOString().split("T")[0]}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-5">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="min-w-[250px] flex-1">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer Not to Say">Prefer Not to Say</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem className="min-w-[250px] flex-1">
                <FormLabel>Marital Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap gap-5">
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem className="min-w-[250px] flex-1">
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Business Man" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="photoUpload"
            render={({ field }) => (
              <FormItem className="min-w-[250px] flex-1">
                <FormLabel>Photo Upload</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                    disabled={isSubmitting}
                    name="profile_picture"
                    accept="image/"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <section className="">
          <div className="mt-14 mb-5">
            <h2 className="sub-header text-2xl font-semibold  pb-[5px]">
              <span className="border-b-[3px] boder border-b-green-500 rounded-md">Contact</span>{" "}
              Information
            </h2>
          </div>
        </section>

        <div className="flex flex-wrap gap-5">
          <FormField
            control={form.control}
            name="primaryPhoneNumber"
            render={({ field }) => (
              <FormItem className="min-w-[250px] flex-1">
                <FormLabel>Primary Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="08028382***" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alternatePhoneNumber"
            render={({ field }) => (
              <FormItem className="min-w-[250px] flex-1">
                <FormLabel>Alternate Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="081827458**" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  {...field}
                  placeholder="example@gmail.com"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-5">
          <FormField
            control={form.control}
            name="residentialAddress.street"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="20, herbert Maclean Way" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="residentialAddress.city"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Lekki" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap gap-5">
          <FormField
            control={form.control}
            name="residentialAddress.state"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Lagos" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="residentialAddress.country"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nigeria" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <section className="">
          <div className="mt-14 mb-5">
            <h2 className="sub-header text-2xl font-semibold  pb-[5px]">
              <span className="border-b-[3px] boder border-b-green-500 rounded-md">Emergency</span>{" "}
              Contact Details
            </h2>
          </div>
        </section>

        <FormField
          control={form.control}
          name="emergencyContact.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Contact Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Sandra William" disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap gap-5">
          <FormField
            control={form.control}
            name="emergencyContact.relationship"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel>Relationship to Patient</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Spouse" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergencyContact.phoneNumber"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel>Emergency Contact Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="090235837**" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <section className="">
          <div className="mt-14 mb-5">
            <h2 className="sub-header text-2xl font-semibold  pb-[5px]">
              <span className="border-b-[3px] boder border-b-green-500 rounded-md">Medical</span>{" "}
              Information
            </h2>
          </div>
        </section>

        <div className="flex flex-wrap gap-5">
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel>Blood Group</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="Widowed">None</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="knownAllergies"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel>Known Allergies</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Lactose Intolerant" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="preExistingConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pre-existing Medical Conditions</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Asthmatic" disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-5">
          <FormField
            control={form.control}
            name="healthInsurance.insuranceNumber"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel>Insurance Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="1023473834" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="healthInsurance.provider"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel>Insurance Provider</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="AXA Mansard" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <section className="">
          <div className="mt-14 mb-5">
            <h2 className="sub-header text-2xl font-semibold  pb-[5px]">
              <span className="border-b-[3px] boder border-b-green-500 rounded-md">Security</span>{" "}
              Information
            </h2>
          </div>
        </section>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex-1 min-w-[250px]">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} placeholder="********" disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap gap-5">
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    placeholder="*********"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-5 pb-3">
          <FormField
            control={form.control}
            name="consentForDataUsage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormLabel> Consent for Data Usage</FormLabel>
                <br />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {error && (
          <div className="text-red-900 p-2 bg-red-300 rounded-md text-sm my-4 text-center">
            {error}
          </div>
        )}
        {registrationSuccess && (
          <div className="text-green-900 p-2 bg-green-300 rounded-md text-sm my-4 text-center">
            {registrationSuccess.message}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {" "}
          {isSubmitting ? "Registering..." : "Register"}
        </Button>

        <div className="pt-12 ">
          Already have an account?
          <Link href="/patient/login" className="text-green-500 hover:text-green-600">
            {" "}
            login
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
