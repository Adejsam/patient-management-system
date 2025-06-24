"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { PhoneIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { HeartPulse } from "lucide-react";
import LandingLayout from "../shared/layout/LandingLayout";
import Seo from "../shared/seo/seo";

const FirstAidGuide = () => {
  useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const firstAidSteps = [
    {
      title: "Assess the Situation",
      description: "Ensure the scene is safe and check the victim's responsiveness.",
    },
    {
      title: "Call for Help",
      description: "Dial emergency services if the situation is critical.",
    },
    {
      title: "Provide Basic Care",
      description: "Administer first aid procedures based on the injury or condition.",
    },
    {
      title: "Monitor and Comfort",
      description: "Keep the victim comfortable and monitor their condition until help arrives.",
    },
  ];

  const commonInjuries = [
    {
      name: "Cuts and Scrapes",
      symptoms: "Bleeding, pain, redness",
      treatment: "Clean the wound, apply pressure, and cover with a sterile bandage.",
    },
    {
      name: "Burns",
      symptoms: "Redness, blistering, pain",
      treatment:
        "Cool the burn with running water, cover with a sterile dressing, and seek medical attention.",
    },
    {
      name: "Fractures",
      symptoms: "Swelling, deformity, inability to move the affected area",
      treatment: "Immobilize the injured area and seek immediate medical attention.",
    },
    {
      name: "Choking",
      symptoms: "Coughing, difficulty breathing, clutching throat",
      treatment: "Use the Heimlich maneuver if the victim cannot breathe or speak.",
    },
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br bg-background w-full">
        <Seo title="First Aid Guide"></Seo>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="text-center py-16">
            <h1 className={`text-5xl font-bold text-primary mb-6`}>First Aid Guide</h1>
            <p className={`text-xl text-foreground-300 mb-12`}>
              Essential first aid information and procedures for common medical emergencies
            </p>

            {/* Key First Aid Steps Section */}
            <div className="bg-background rounded-2xl p-12 mb-16">
              <h2 className={`text-3xl font-bold text-primary mb-8`}>Key First Aid Steps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {firstAidSteps.map((step) => (
                  <div key={step.title} className="p-6 border-2 rounded-xl border-border">
                    <h3 className={`text-2xl font-semibold text-foreground mb-4`}>{step.title}</h3>
                    <p className={`text-foreground leading-relaxed`}>{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Injuries Section */}
            <div className="bg-background rounded-2xl  p-12 mb-16">
              <h2 className={`text-3xl font-bold text-primary pb-10`}>
                Common Injuries and Conditions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {commonInjuries.map((injury) => (
                  <div key={injury.name} className="p-6 border-2 rounded-xl border-border">
                    <h3 className={`text-2xl font-semibold text-foreground mb-4`}>{injury.name}</h3>
                    <div className="mb-6">
                      <h4 className={`text-xl font-medium text-foreground mb-2`}>Symptoms:</h4>
                      <p className={`text-foreground leading-relaxed`}>{injury.symptoms}</p>
                    </div>
                    <div>
                      <h4 className={`text-xl font-medium text-foreground mb-2`}>Treatment:</h4>
                      <p className={`text-foreground leading-relaxed`}>{injury.treatment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts Section */}
            <div className="bg-background rounded-2xl p-12 mb-16">
              <h2 className={`text-3xl font-bold text-primary mb-8`}>Emergency Contacts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 border-2 rounded-xl border-border">
                  <div className="flex items-center mb-4">
                    <PhoneIcon className="h-12 w-12 mr-4 text-blue-500" />
                    <h3 className={`text-xl font-semibold text-foreground`}>Emergency Services</h3>
                  </div>
                  <p className={`text-2xl font-bold text-foreground mb-4`}>112</p>
                  <Button
                    variant="outline"
                    className="w-full mt-4 hover:bg-blue-900"
                    onClick={() => (window.location.href = "tel:112")}>
                    Call Now
                  </Button>
                </div>
                <div className="p-6 border-2 rounded-xl border-border">
                  <div className="flex items-center mb-4">
                    <HeartPulse className="h-12 w-12 mr-4 text-red-500" />
                    <h3 className={`text-xl font-semibold text-foreground`}>Poison Control</h3>
                  </div>
                  <p className={`text-2xl font-bold text-foreground mb-4`}>113</p>
                  <Button
                    variant="outline"
                    className="w-full mt-4 hover:bg-red-900"
                    onClick={() => (window.location.href = "tel:113")}>
                    Call Now
                  </Button>
                </div>
                <div className="p-6 border-2 rounded-xl border-border">
                  <div className="flex items-center mb-4">
                    <ExclamationTriangleIcon className="h-12 w-12 mr-4 text-yellow-500" />
                    <h3 className={`text-xl font-semibold text-foreground`}>Medical Emergencies</h3>
                  </div>
                  <p className={`text-2xl font-bold text-foreground mb-4`}>114</p>
                  <Button
                    variant="outline"
                    className="w-full mt-4 hover:bg-yellow-900"
                    onClick={() => (window.location.href = "tel:114")}>
                    Call Now
                  </Button>
                </div>
              </div>
            </div>

            {/* When to Seek Professional Help Section */}
            <div className="bg-background rounded-2xl p-12">
              <h2 className={`text-3xl font-bold text-primary mb-8`}>
                When to Seek Professional Help
              </h2>
              <ul className=" pl-8 space-y-4">
                {[
                  "The injury or condition is severe or life-threatening",
                  "Symptoms worsen or do not improve with basic first aid",
                  "The victim is unconscious or unresponsive",
                  "There is significant bleeding that cannot be controlled",
                  "Suspected fractures or serious injuries",
                ].map((item, index) => (
                  <li key={index} className={`text-foreground leading-relaxed`}>
                    <span className="text-primary-500 mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
};

FirstAidGuide.getLayout = (page: React.ReactElement) => {
  return <LandingLayout>{page}</LandingLayout>;
};

export default FirstAidGuide;
