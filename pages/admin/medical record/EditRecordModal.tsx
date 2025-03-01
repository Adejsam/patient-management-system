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

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface EditRecordModalProps {
  record: MedicalRecordData;
  onClose: () => void;
  onUpdate: (updatedRecord: MedicalRecordData) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditRecordModal: React.FC<EditRecordModalProps> = ({
  record,
  onClose,
  onUpdate,
  isOpen,
  onOpenChange,
}) => {
  useTheme();
  const [visitDate, setVisitDate] = useState<Date>(new Date(record.date));
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    temperature: "",
    weight: "",
    heartRate: "",
    bloodPressure: "",
    symptoms: "",
    allergies: "",
    diagnosis: "",
    labTests: "",
    labTestResults: "",
    medications: [] as Medication[],
    doctorNotes: "",
    nursingNotes: "",
  });

  useEffect(() => {
    setIsMounted(true);
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

    const validateNumber = (value: string, field: string, allowDecimal = true) => {
      if (value.trim() === "") return `${field} is required`;
      const regex = allowDecimal ? /^\d*\.?\d+$|^\.$/ : /^\d+$/;
      if (!regex.test(value)) return `${field} must be a valid number`;
      return "";
    };

    errors.temperature = validateNumber(formState.temperature, "Temperature", true);
    errors.weight = validateNumber(formState.weight, "Weight", true);
    errors.heartRate = validateNumber(formState.heartRate, "Heart Rate", false);
    errors.bloodPressure = validateNumber(formState.bloodPressure, "Blood Pressure", false);

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

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const errors = validateForm();
      if (Object.values(errors).some((err) => err !== "")) {
        setError("Please correct the form errors");
        return;
      }

      if (formState.medications.some((med) => !med.name || !med.dosage || !med.frequency)) {
        setError("Please fill in all medication details");
        return;
      }

      const updatedRecord: MedicalRecordData = {
        ...record,
        date: visitDate.toISOString(),
        temperature: formState.temperature,
        weight: formState.weight,
        heartRate: formState.heartRate,
        bloodPressure: formState.bloodPressure,
        symptoms: formState.symptoms,
        allergies: formState.allergies,
        diagnosis: formState.diagnosis,
        labTests: formState.labTests,
        labTestResults: formState.labTestResults,
        medications: formState.medications.map((med) => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
        })),
        doctorNotes: formState.doctorNotes,
        nursingNotes: formState.nursingNotes,
      };

      onUpdate(updatedRecord);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      className="flex justify-center items-center">
      <ModalHeader>
        <span className="text-primary">Edit</span> Medical Record
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
                    placeholder="Temperature (e.g., 98.6°F)"
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
                    placeholder="Weight (e.g., 75kg)"
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
                    placeholder="Heart Rate (e.g., 72 bpm)"
                  />
                  <Input
                    value={formState.bloodPressure}
                    onChange={(e) => {
                      setFormState({ ...formState, bloodPressure: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                    type="text"
                    pattern="^\d*$"
                    placeholder="Blood Pressure (e.g., 120/80 mmHg)"
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
                  <Textarea
                    value={formState.nursingNotes}
                    placeholder="Nurse Note"
                    onChange={(e) => {
                      setFormState({ ...formState, nursingNotes: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {error && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          </div>
        </ModalContent>
      </ScrollArea>
      <ModalFooter className="flex justify-end">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="mr-4">
          Cancel
        </Button>
        <Button onClick={handleUpdate} disabled={isSubmitting || !!error}>
          Update Record
        </Button>
      </ModalFooter>
    </Modal>
  );
};
