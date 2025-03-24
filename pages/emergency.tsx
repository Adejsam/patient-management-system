
"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./components/ui/button";
import { PhoneIcon, ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import { HeartPulse } from "lucide-react";
import LandingLayout from "../shared/layout/LandingLayout";
import Seo from "../shared/seo/seo";

const EmergencyPage = () => {
  useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const emergencyContacts = [
    {
      name: "Emergency Services",
      number: "112",
      icon: PhoneIcon,
    },
    {
      name: "Poison Control",
      number: "113",
      icon: HeartPulse,
    },
    {
      name: "Medical Emergencies",
      number: "114",
      icon: ExclamationTriangleIcon,
    },
  ];

  return (
    <main>
      <Seo title="Emergency Care"></Seo>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="text-center py-12">
            <h1 className={`text-4xl font-bold text-primary`}>
              Emergency Care
            </h1>
            <p className={`text-lg text-foreground mb-8`}>
              Quick access to emergency services and important contacts
            </p>

            {/* Emergency Contacts Section */}
            <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 mb-12">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.name}
                  className="bg-background-800 p-6 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <contact.icon
                      className={`h-12 w-12 mr-4 text-red-500`}
                      aria-hidden="true"
                    />
                    <h3 className={`text-xl font-semibold text-foreground`}>
                      {contact.name}
                    </h3>
                  </div>
                  <p className={`text-2xl font-bold text-foreground mb-4`}>
                    {contact.number}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = `tel:${contact.number}`}
                  >
                    Call Now
                  </Button>
                </div>
              ))}
            </div>

            {/* Emergency Services Section */}
            <div className="bg-background rounded-lg shadow-md p-8 mb-12">
              <h2 className={`text-2xl font-bold text-foreground mb-6`}>
                Emergency Services
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className={`text-xl font-semibold text-foreground mb-2`}>
                    Ambulance Dispatch
                  </h3>
                  <p className={`textforeground`}>
                    24/7 ambulance dispatch service for critical emergencies
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className={`text-xl font-semibold text-foreground`}>
                    Emergency Room Access
                  </h3>
                  <p className={`text-foreground`}>
                    Direct access to our emergency room facilities
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className={`text-xl font-semibold text-foreground mb-2`}>
                    Emergency Triage
                  </h3>
                  <p className={`text-foreground`}>
                    Immediate triage and prioritization of critical cases
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className={`text-xl font-semibold text-foreground mb-2`}>
                    Critical Care Unit
                  </h3>
                  <p className={`text-fore
                    ground`}>
                    Specialized care for life-threatening conditions
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="bg-background rounded-lg shadow-md p-8">
              <h2 className={`text-2xl font-bold text-foreground mb-6`}>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  variant="default"
                  className="w-full flex items-center justify-center"
                  onClick={() => window.location.href = "tel:112"}
                >
                  <PhoneIcon className="h-6 w-6 mr-2" />
                  Emergency Call
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center"
                  onClick={() => window.location.href = "/first-aid"}
                >
                  <HeartPulse className="h-6 w-6 mr-2" />
                  First Aid Guide
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

EmergencyPage.getLayout = (page: React.ReactElement) => {
  return <LandingLayout>{page}</LandingLayout>;
};

export default EmergencyPage;
