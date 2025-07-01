import React, { useEffect, useState } from "react";
import { MedicalRecordData } from "../../types/medical";
import { useTheme } from "next-themes";
import { Button } from "../../ui/button";

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
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props.isOpen]);

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

  if (!isMounted || !props.isOpen) {
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
          setError("You are not authorized to update medical records.");
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

  // Custom modal and scrollable content styles
  return (
    <div
      className="custom-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.onClose();
          props.onOpenChange(false);
        }
      }}
    >
      <div className="custom-modal-container bg-muted">
        <div className="custom-modal-header text-foreground">
          <span className="text-primary">Edit</span> Medical Record
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-base text-red-700 rounded text-center">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mt-2 p-2 bg-green-100 text-base text-green-700 rounded text-center">
              {successMessage}
            </div>
          )}
        </div>
        <div className="custom-modal-content">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Visit Date</label>
                <input
                  type="date"
                  className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                  value={visitDate.toISOString().slice(0, 10)}
                  onChange={(e) => setVisitDate(new Date(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1 ">Vital Signs</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={formState.temperature}
                    onChange={(e) => setFormState({ ...formState, temperature: e.target.value })}
                    className="h- w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                    type="text"
                    placeholder="Temperature (e.g., 36.8)"
                  />
                  <input
                    value={formState.weight}
                    onChange={(e) => setFormState({ ...formState, weight: e.target.value })}
                    className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                    type="text"
                    placeholder="Weight (e.g., 75.5)"
                  />
                  <input
                    value={formState.heartRate}
                    onChange={(e) => setFormState({ ...formState, heartRate: e.target.value })}
                    className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                    type="text"
                    placeholder="Heart Rate (e.g., 72)"
                  />
                  <input
                    value={formState.bloodPressure}
                    onChange={(e) => setFormState({ ...formState, bloodPressure: e.target.value })}
                    className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                    type="text"
                    placeholder="Blood Pressure (e.g., 120/80)"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1 ">Symptoms</label>
                <textarea
                  value={formState.symptoms}
                  placeholder="head ache"
                  onChange={(e) => setFormState({ ...formState, symptoms: e.target.value })}
                  className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1 ">Allergies</label>
                <textarea
                  value={formState.allergies}
                  placeholder="None"
                  onChange={(e) => setFormState({ ...formState, allergies: e.target.value })}
                  className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1 ">Diagnosis</label>
                <input
                  placeholder="Malaria"
                  value={formState.diagnosis}
                  onChange={(e) => setFormState({ ...formState, diagnosis: e.target.value })}
                  className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Lab Tests</label>
                <input
                  value={formState.labTests}
                  placeholder="MRI"
                  onChange={(e) => setFormState({ ...formState, labTests: e.target.value })}
                  className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Lab Tests Result</label>
                <input
                  placeholder="No Magraine"
                  value={formState.labTestResults}
                  onChange={(e) => setFormState({ ...formState, labTestResults: e.target.value })}
                  className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Medications</label>
                <div className="space-y-2">
                  {formState.medications.map((medication, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2">
                      <input
                        placeholder="Name"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                        className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                      />
                      <input
                        placeholder="Dose"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                        className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                      />
                      <input
                        placeholder="Frequency"
                        value={medication.frequency}
                        onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                        className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                      />
                      <Button
                        variant="destructive"
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleRemoveMedication(index)}
                        disabled={formState.medications.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="default"
                    className=""
                    onClick={handleAddMedication}
                  >
                    Add Medication
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Notes</label>
                <textarea
                  value={formState.doctorNotes}
                  placeholder="Doctor's Note"
                  onChange={(e) => setFormState({ ...formState, doctorNotes: e.target.value })}
                  className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="custom-modal-footer">
          <Button
            variant="outline"
            className="mr-4"
            onClick={props.onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleUpdate}
            disabled={isSubmitting || !!error}
          >
            Update Record
          </Button>
        </div>
      </div>
      <style>{`
        .custom-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .custom-modal-container {
          border-radius: 1rem;
          box-shadow: 0 2px 16px rgba(0,0,0,0.15);
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .custom-modal-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eee;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .custom-modal-content {
          flex: 1 1 0%;
          min-height: 0;
          overflow-y: auto;
          padding: 1.5rem;
        }
        .custom-modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
        }
        @media (max-width: 768px) {
          .custom-modal-container {
            max-width: 98vw;
            padding: 0;
          }
          .custom-modal-content {
            padding: 1rem;
          }
          .custom-modal-header, .custom-modal-footer {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};