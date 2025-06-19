import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";

interface DoctorFilterProps {
  filterField: string;
  onFieldChange: (value: string) => void;
}

const DoctorFilter: React.FC<DoctorFilterProps> = ({ filterField, onFieldChange }) => {
  return (
    <div className="flex space-x-4 mb-4 w-1/2">
      <Select value={filterField} onValueChange={onFieldChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Fields" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Fields</SelectItem>
          <SelectItem value="Cardiology">Cardiology</SelectItem>
          <SelectItem value="Dermatology">Dermatology</SelectItem>
          <SelectItem value="Neurology">Neurology</SelectItem>
          <SelectItem value="Family Doctor">Family Doctor</SelectItem>
          <SelectItem value="Psychiatry">Psychiatry</SelectItem>
          <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
          <SelectItem value="Endocrinology">Endocrinology</SelectItem>
          {/* Add more fields as needed */}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DoctorFilter;
