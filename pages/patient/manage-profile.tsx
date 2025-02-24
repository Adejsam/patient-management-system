"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import Header from "../components/headers/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const ManageProfile = () => {
  useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "John",
    middleName: "William",
    lastName: "Doe",
    dateOfBirth: "1990-01-01",
    gender: "Male",
    photoUpload: null,
    primaryPhoneNumber: "123-456-7890",
    alternatePhoneNumber: "098-765-4321",
    email: "john.doe@example.com",
    residentialAddress: {
      street: "123 Main St",
      city: "City",
      state: "State",
      country: "Country",
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phoneNumber: "123-456-7890",
    },
    bloodGroup: "O+",
    knownAllergies: "None",
    preExistingConditions: "None",
    primaryPhysician: "Dr. Smith",
    healthInsurance: {
      insuranceNumber: "123456789",
      provider: "Insurance Provider",
    },
    maritalStatus: "Married",
    occupation: "Software Engineer",
    consentForDataUsage: true,
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <PatientLayout>
      <Seo title="Manage Profile" />
      <Header title="Manage Profile" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="h-fit flex-1 rounded-xl bg-muted/50 md:min-h-min w-[97%] mx-auto">
        <div className="py-2 px-7">
          <h1 className="text-3xl font-bold mt-5 mb-2">Manage Profile</h1>
          <h2 className="text-lg placeholder-opacity-60 tracking-tight">
            view and edit your <span className="text-primary">profile information</span>
          </h2>
        </div>
        <div className={`p-6 w-full`}>
          <section className="mb-5">
            <h2 className="text-2xl font-semibold pb-2 border-b-2 border-primary">
              Personal Information
            </h2>
          </section>
          <div className="flex flex-wrap gap-5 w-full">
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">First Name:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="firstName"
                  value={userInfo.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input 
                type="text"
                name="firstName"
                value={userInfo.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled
                />
              )}
            </div>
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Middle Name:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="middleName"
                  value={userInfo.middleName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input 
                type="text"
                  name="middleName"
                  value={userInfo.middleName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-5">
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Last Name:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="lastName"
                  value={userInfo.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input 
                type="text"
                  name="lastName"
                  value={userInfo.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Date of Birth:</label>
              {isEditing ? (
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={userInfo.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input 
                type="date"
                name="dateOfBirth"
                value={userInfo.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled
                />
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-5">
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Gender:</label>
              {isEditing ? (
                <Select
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  defaultValue={userInfo.gender}>
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
              ) : (
                <Select
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  defaultValue={userInfo.gender} disabled>
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
              )}
            </div>
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Marital Status:</label>
              {isEditing ? (
                <Select
                  onValueChange={(value) => handleSelectChange("maritalStatus", value)}
                  defaultValue={userInfo.maritalStatus}>
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
              ) : (
                <Select
                  onValueChange={(value) => handleSelectChange("maritalStatus", value)}
                  defaultValue={userInfo.maritalStatus} disabled>
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
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-5">
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Occupation:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="occupation"
                  value={userInfo.occupation}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="text"
                  name="occupation"
                  value={userInfo.occupation}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Primary Phone Number:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="primaryPhoneNumber"
                  value={userInfo.primaryPhoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="text"
                  name="primaryPhoneNumber"
                  value={userInfo.primaryPhoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-5">
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Alternate Phone Number:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="alternatePhoneNumber"
                  value={userInfo.alternatePhoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="text"
                  name="alternatePhoneNumber"
                  value={userInfo.alternatePhoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Email:</label>
              {isEditing ? (
                <Input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
          </div>
          <section className="mb-5 mt-6">
            <h2 className="text-2xl font-semibold pb-2 border-b-2 border-primary">
              Residential Address
            </h2>
          </section>
          <div className="flex flex-wrap gap-5">
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Street:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="residentialAddress.street"
                  value={userInfo.residentialAddress.street}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="text"
                  name="residentialAddress.street"
                  value={userInfo.residentialAddress.street}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">City:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="residentialAddress.city"
                  value={userInfo.residentialAddress.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="text"
                  name="residentialAddress.city"
                  value={userInfo.residentialAddress.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-5 ">
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">State/Province:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="residentialAddress.state"
                  value={userInfo.residentialAddress.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="text"
                  name="residentialAddress.state"
                  value={userInfo.residentialAddress.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Country:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="residentialAddress.country"
                  value={userInfo.residentialAddress.country}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="text"
                  name="residentialAddress.country"
                  value={userInfo.residentialAddress.country}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
          </div>
          <section className="mb-5 mt-6">
            <h2 className="text-2xl font-semibold pb-2 border-b-2 border-primary">
              Emergency Contact
            </h2>
          </section>
          <div className="flex flex-wrap gap-5">
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Emergency Contact Name:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="emergencyContact.name"
                  value={userInfo.emergencyContact.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="text"
                  name="emergencyContact.name"
                  value={userInfo.emergencyContact.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Relationship to Patient:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="emergencyContact.relationship"
                  value={userInfo.emergencyContact.relationship}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="text"
                  name="emergencyContact.relationship"
                  value={userInfo.emergencyContact.relationship}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Emergency Contact Phone Number:</label>
            {isEditing ? (
              <Input
                type="text"
                name="emergencyContact.phoneNumber"
                value={userInfo.emergencyContact.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            ) : (
                <Input
                type="text"
                name="emergencyContact.phoneNumber"
                value={userInfo.emergencyContact.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled
              />
            )}
          </div>
          <section className="mb-5 mt-10">
            <h2 className="text-2xl font-semibold pb-2 border-b-2 border-primary">
              Medical Information
            </h2>
          </section>
          <div className="flex flex-wrap gap-5">
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Blood Group:</label>
              {isEditing ? (
                <Select
                  onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                  defaultValue={userInfo.bloodGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
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
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                  defaultValue={userInfo.bloodGroup} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
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
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Known Allergies:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="knownAllergies"
                  value={userInfo.knownAllergies}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="text"
                  name="knownAllergies"
                  value={userInfo.knownAllergies}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Pre-existing Medical Conditions:</label>
            {isEditing ? (
              <Input
                type="text"
                name="preExistingConditions"
                value={userInfo.preExistingConditions}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            ) : (
                <Input
                type="text"
                name="preExistingConditions"
                value={userInfo.preExistingConditions}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Primary Physician:</label>
            {isEditing ? (
              <Input
                type="text"
                name="primaryPhysician"
                value={userInfo.primaryPhysician}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            ) : (
                <Input
                type="text"
                name="primaryPhysician"
                value={userInfo.primaryPhysician}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled
              />
            )}
          </div>
          <section className="mb-5 mt-10">
            <h2 className="text-2xl font-semibold pb-2 border-b-2 border-primary">
              Health Insurance
            </h2>
          </section>
          <div className="flex flex-wrap gap-5">
            <div className="mb-4 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Insurance Number:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="healthInsurance.insuranceNumber"
                  value={userInfo.healthInsurance.insuranceNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="text"
                  name="healthInsurance.insuranceNumber"
                  value={userInfo.healthInsurance.insuranceNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
            <div className="mb-6 flex-1 min-w-[250px]">
              <label className="block text-sm font-bold mb-2">Insurance Provider:</label>
              {isEditing ? (
                <Input
                  type="text"
                  name="healthInsurance.provider"
                  value={userInfo.healthInsurance.provider}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <Input
                  type="text"
                  name="healthInsurance.provider"
                  value={userInfo.healthInsurance.provider}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              )}
            </div>
          </div>
          <Button onClick={handleEditToggle}>{isEditing ? "Save" : "Edit"}</Button>
        </div>
      </div>
    </PatientLayout>
  );
};

export default ManageProfile;
