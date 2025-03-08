import React from "react";
import { Modal, ModalHeader, ModalFooter, ModalContent } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { MedicalRecordData } from "../../../types/medical";

interface MedicalRecordDetailsModalProps {
  record: MedicalRecordData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function MedicalRecordDetailsModal({
  record,
  isOpen,
  onOpenChange,
  onClose,
}: MedicalRecordDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      className="flex justify-center items-center">
      <ModalHeader>
        <h2 className="text-xl font-semibold text-center"><span className="text-primary">Medical Record</span> Details</h2>
      </ModalHeader>
      <ScrollArea>
        <ModalContent className="flex justify-center items-center">
          <Tabs defaultValue="patient-info">
            <TabsList>
              <TabsTrigger value="patient-info" className="text-sm">
                Patient Info
              </TabsTrigger>
              <TabsTrigger value="vitals" className="text-sm">
                Vital Signs
              </TabsTrigger>
              <TabsTrigger value="diagnosis" className="text-sm">
                Diagnosis
              </TabsTrigger>
              <TabsTrigger value="medications" className="text-sm">
                Medications
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-sm">
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patient-info" key="patient-info">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 py-5">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Patient Name</p>
                  <p className="text-gray-600">{record.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Date of Birth</p>
                  <p className="text-gray-600">{record.dateOfBirth}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-gray-600">{record.gender}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-gray-600">{record.contactDetails}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vitals" key="vitals">
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4 py-5">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Temperature</p>
                  <p className="text-gray-600">{record.temperature}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Weight</p>
                  <p className="text-gray-600">{record.weight}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Heart Rate</p>
                  <p className="text-gray-600">{record.heartRate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Blood Pressure</p>
                  <p className="text-gray-600">{record.bloodPressure}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="diagnosis" key="diagnosis">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 py-5">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Symptoms</p>
                  <p className="text-gray-600">{record.symptoms}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Allergies</p>
                  <p className="text-gray-600">{record.allergies}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Diagnosis</p>
                  <p className="text-gray-600">{record.diagnosis}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medications" key="medications">
              <div className="overflow-x-auto py-5">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm font-medium text-gray-500">
                      <th className="pb-2">Medication</th>
                      <th className="pb-2">Dosage</th>
                      <th className="pb-2">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.medications.map((med, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-3">{med.name || "N/A"}</td>
                        <td className="py-3">{med.dosage || "N/A"}</td>
                        <td className="py-3">{med.frequency || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="notes" key="notes">
              <div className="space-y-4 py-5">
                <h3 className="text-lg font-medium">Notes</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Doctor&apos;s Notes</p>
                    <p className="text-gray-600">{record.doctorNotes}</p>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Nursing Notes</p>
                    <p className="text-gray-600">{record.nursingNotes}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ModalContent>
      </ScrollArea>
      <ModalFooter className="flex justify-end">
        <Button onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
