import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Input } from "../../components/ui/input";
import Textarea from "../../components/ui/Textarea";
import { Label } from "../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../../lib/utils";
import { useTheme } from "next-themes";
import { MedicalRecordData } from "../../../types/medical";
import { ScrollArea } from "../../components/ui/scroll-area";

interface EditRecordModalProps {
  record: MedicalRecordData;
  onClose: () => void;
  onUpdate: (updatedRecord: MedicalRecordData) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditRecordModal: React.FC<EditRecordModalProps> = (props) => {
  useTheme();
  const [visitDate, setVisitDate] = useState<Date>(new Date(props.record.date));
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    temperature: props.record.temperature || "",
    weight: props.record.weight || "",
    heartRate: props.record.heartRate || "",
    bloodPressure: props.record.bloodPressure || "",
    symptoms: props.record.symptoms || "",
    allergies: props.record.allergies || "",
    diagnosis: props.record.diagnosis || "",
    labTests: props.record.labTests || "",
    labTestResults: props.record.labTestResults || "",
    medications: props.record.medications.map((med) => ({
      name: med.name || "",
      dosage: med.dosage || "",
      frequency: med.frequency || "",
    })),
    doctorNotes: props.record.doctorNotes || "",
  });

  // Add state for doctor credentials
  const [editorRole, setEditorRole] = useState<string>("doctor");
  const [editorId, setEditorId] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchEditorData = async () => {
      try {
        const userRole = localStorage.getItem("userRole");
        const userData = localStorage.getItem("userData");

        if (!userRole || !userData) {
          throw new Error("User data not found in localStorage");
        }

        const parsedUserData = JSON.parse(userData);
        if (!parsedUserData.user_id) {
          throw new Error("Invalid user data in localStorage");
        }

        setEditorRole(userRole);
        setEditorId(parsedUserData.user_id.toString()); // Ensure editorId is string
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch editor data");
      }
    };

    fetchEditorData();
  }, []);

  if (!isMounted) {
    return null;
  }

  const validateForm = () => {
    const errors = {
      temperature: "",
      weight: "",
      heartRate: "",
      bloodPressure: "",
    };

    // Temperature validation
    if (!formState.temperature.trim()) {
      errors.temperature = "Temperature is required";
    } else {
      const temp = formState.temperature.trim();
      // Check if it's a valid number without converting to float
      if (!/^\d*\.?\d+$/.test(temp)) {
        errors.temperature = "Temperature must be a valid number";
      } else if (parseFloat(temp) < 35 || parseFloat(temp) > 42) {
        errors.temperature = "Temperature must be between 35 and 42°C";
      }
    }

    // Weight validation
    if (!formState.weight.trim()) {
      errors.weight = "Weight is required";
    } else {
      const weight = parseFloat(formState.weight);
      if (isNaN(weight)) {
        errors.weight = "Weight must be a valid number";
      } else if (weight < 1 || weight > 200) {
        errors.weight = "Weight must be between 1 and 200 kg";
      }
    }

    // Heart Rate validation
    if (!formState.heartRate.trim()) {
      errors.heartRate = "Heart Rate is required";
    } else {
      const heartRate = parseInt(formState.heartRate);
      if (isNaN(heartRate)) {
        errors.heartRate = "Heart Rate must be a valid number";
      } else if (heartRate < 30 || heartRate > 200) {
        errors.heartRate = "Heart Rate must be between 30 and 200 bpm";
      }
    }

    // Blood Pressure validation
    if (!formState.bloodPressure.trim()) {
      errors.bloodPressure = "Blood Pressure is required";
    } else if (!/^\d{2,3}\/\d{2,3}$/.test(formState.bloodPressure)) {
      errors.bloodPressure = "Blood Pressure must be in format '120/80'";
    }

    return errors;
  };

  const handleAddMedication = () => {
    setFormState((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: "", dosage: "", frequency: "" }],
    }));
  };

  const handleRemoveMedication = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleMedicationChange = (
    index: number,
    field: "name" | "dosage" | "frequency",
    value: string
  ) => {
    setFormState((prev) => {
      const newMedications = [...prev.medications];
      newMedications[index][field] = value;
      return { ...prev, medications: newMedications };
    });
  };

  const handleApiUpdate = async (updatedRecord: MedicalRecordData) => {
    try {
      const response = await fetch("http://localhost/hospital_api/update_medical_records.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          editorRole: editorRole,
          editorId: editorId,
          recordId: parseInt(props.record.id),
          fields: {
            visitDate: updatedRecord.date,
            field: updatedRecord.field,
            temperature: parseFloat(updatedRecord.temperature),
            weight: parseFloat(updatedRecord.weight),
            heartRate: parseInt(updatedRecord.heartRate),
            bloodPressure: updatedRecord.bloodPressure,
            symptoms: updatedRecord.symptoms,
            allergies: updatedRecord.allergies,
            diagnosis: updatedRecord.diagnosis,
            labTests: updatedRecord.labTests,
            labTestResults: updatedRecord.labTestResults,
            doctorNotes: updatedRecord.doctorNotes,
            medications: updatedRecord.medications,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 403) {
          setError(
            "You are not authorized to update medical records."
          );
          return;
        }
        setError(data.message || "Failed to update record");
        return;
      }

      const data = await response.json();
      if (data.success) {
        props.onUpdate(updatedRecord);
        setSuccessMessage("Medical record updated successfully");
        setError(null);
        // Close the modal after 2 seconds
        setTimeout(() => {
          props.onClose();
        }, 2000);
      } else {
        setError(data.message || "Failed to update record");
      }
    } catch (error) {
      console.error("Error updating record:", error);
      console.log(error);
      setError(error instanceof Error ? error.message : "Failed to update record");
    }
  };

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const errors = validateForm();
      if (Object.values(errors).some((err) => err !== "")) {
        setError("Please correct the form errors");
        return;
      }

      // Validate medications
      if (
        formState.medications.some((med) => {
          return (
            !med.name.trim() ||
            !med.dosage.trim() ||
            !med.frequency.trim() ||
            formState.medications.filter((m) => m.name.toLowerCase() === med.name.toLowerCase())
              .length > 1
          );
        })
      ) {
        setError("Please fill in all medication details and ensure names are unique");
        return;
      }

      const updatedRecord: MedicalRecordData = {
        ...props.record,
        date: visitDate.toISOString(),
        temperature: formState.temperature.trim(),
        weight: formState.weight.trim(),
        heartRate: formState.heartRate.trim(),
        bloodPressure: formState.bloodPressure,
        symptoms: formState.symptoms,
        allergies: formState.allergies,
        diagnosis: formState.diagnosis,
        labTests: formState.labTests,
        labTestResults: formState.labTestResults,
        medications: formState.medications.map((med) => ({
          name: med.name.trim(),
          dosage: med.dosage.trim(),
          frequency: med.frequency.trim(),
        })),
        doctorNotes: formState.doctorNotes,
      };

      await handleApiUpdate(updatedRecord);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update record");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(formState);

  return (
    <Modal
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      onClose={props.onClose}
      className="flex justify-center items-center">
      <ModalHeader>
        <span className="text-primary">Edit</span> Medical Record
        {error && (
          <div className="my-1 p-2 bg-red-100 text-base text-red-700 rounded text-center">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="my-1 p-2 bg-green-100 text-base text-green-700 rounded text-center">
            {successMessage}
          </div>
        )}
      </ModalHeader>
      <ScrollArea>
        <ModalContent className="max-h-[70vh]">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Visit Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !visitDate && "text-muted-foreground"
                      )}>
                      {visitDate ? format(visitDate, "PPP") : <span>Select date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={visitDate}
                      onSelect={(date) => setVisitDate(date || new Date())}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Vital Signs</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={formState.temperature}
                    onChange={(e) => {
                      setFormState({ ...formState, temperature: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                    type="text"
                    pattern="^\d*\.?\d*$"
                    placeholder="Temperature (e.g., 36.8)"
                  />
                  <Input
                    value={formState.weight}
                    onChange={(e) => {
                      setFormState({ ...formState, weight: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                    type="text"
                    pattern="^\d*\.?\d*$"
                    placeholder="Weight (e.g., 75.5)"
                  />
                  <Input
                    value={formState.heartRate}
                    onChange={(e) => {
                      setFormState({ ...formState, heartRate: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                    type="text"
                    pattern="^\d*$"
                    placeholder="Heart Rate (e.g., 72)"
                  />
                  <Input
                    value={formState.bloodPressure}
                    onChange={(e) => {
                      setFormState({ ...formState, bloodPressure: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                    type="text"
                    placeholder="Blood Pressure (e.g., 120/80)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Symptoms</Label>
                <Textarea
                  value={formState.symptoms}
                  placeholder="head ache"
                  onChange={(e) => {
                    setFormState({ ...formState, symptoms: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Allergies</Label>
                <Textarea
                  value={formState.allergies}
                  placeholder="None"
                  onChange={(e) => {
                    setFormState({ ...formState, allergies: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Diagnosis</Label>
                <Input
                  placeholder="Malaria"
                  value={formState.diagnosis}
                  onChange={(e) => {
                    setFormState({ ...formState, diagnosis: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Lab Tests</Label>
                <div className="space-y-1">
                  <Input
                    value={formState.labTests}
                    placeholder="MRI"
                    onChange={(e) => {
                      setFormState({ ...formState, labTests: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Lab Tests Result</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="No Magraine"
                    value={formState.labTestResults}
                    onChange={(e) => {
                      setFormState({ ...formState, labTestResults: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Medications</Label>
                <div className="space-y-2">
                  {formState.medications.map((medication, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2">
                      <Input
                        placeholder="Name"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                      />
                      <Input
                        placeholder="Dose"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                      />
                      <Input
                        placeholder="Frequency"
                        value={medication.frequency}
                        onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveMedication(index)}
                        disabled={formState.medications.length === 1}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button onClick={handleAddMedication} className="w-full">
                    Add Medication
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <div className="space-y-2">
                  <Textarea
                    value={formState.doctorNotes}
                    placeholder="Doctor's Note"
                    onChange={(e) => {
                      setFormState({ ...formState, doctorNotes: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalContent>
      </ScrollArea>
      <ModalFooter className="flex justify-end">
        <Button variant="outline" onClick={props.onClose} disabled={isSubmitting} className="mr-4">
          Cancel
        </Button>
        <Button onClick={handleUpdate} disabled={isSubmitting || !!error}>
          Update Record
        </Button>
      </ModalFooter>
    </Modal>
  );
};
