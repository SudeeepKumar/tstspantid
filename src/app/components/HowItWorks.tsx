import React from "react";
import Image from "next/image";

const steps = [
  {
    icon: "/upload-icon.svg",
    title: "Upload Image",
    description:
      "Take a photo or upload an existing image of a plant you want to identify.",
  },
  {
    icon: "/ai-icon.svg",
    title: "AI Analysis",
    description:
      "Our advanced AI analyzes the image to identify the plant species.",
  },
  {
    icon: "/info-icon.svg",
    title: "Get Information",
    description:
      "Receive detailed information about the plant, including its name, scientific name, and characteristics.",
  },
];

export default function HowItWorks() {
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-800">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-green-700 text-white p-6 rounded-lg text-center"
          >
            <Image
              src={step.icon}
              alt={step.title}
              width={64}
              height={64}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
