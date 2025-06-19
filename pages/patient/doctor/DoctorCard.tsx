import React from "react";
import Image, { StaticImageData } from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../ui/card";
import { useTheme } from "next-themes";

interface DoctorCardProps {
  profilePicture: string | StaticImageData;
  name: string;
  field: string;
  contact: string;
  yearsOfExperience: number;
  about: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  profilePicture,
  name,
  field,
  contact,
  yearsOfExperience,
  about,
}) => {
  useTheme();
  return (
    <Card className="shadow-md w-72 mb-4 md:w-full">
      <CardHeader>
        <Image
          src={profilePicture}
          alt={`${name}'s profile`}
          width={200}
          height={200}
          className="w-full h-[200px] mx-auto object-cover object-top"
        />
        <CardTitle className="text-xl font-bold mt-4">{name}</CardTitle>
        <CardDescription className="text-foreground">{field}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground pb-1">{contact}</p>
        <p className="text-foreground pb-1">{yearsOfExperience} years of experience</p>
        <p className="text-foreground ">{about}</p>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
