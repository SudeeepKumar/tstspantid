"use client";

import { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import PlantInfo from "./components/PlantInfo";
import HowItWorks from "./components/HowItWorks";

export default function Home() {
  const [plantInfo, setPlantInfo] = useState<string | null>(null);

  return (
    <div>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-green-800">
          Discover Plants with PlantSnap
        </h1>
        <p className="text-xl text-green-600">
          Identify any plant instantly using our AI-powered technology
        </p>
      </section>

      <ImageUpload setPlantInfo={setPlantInfo} />
      {plantInfo && <PlantInfo info={plantInfo} />}

      <HowItWorks />

      <section className="mt-12 bg-green-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-800">
          Why Use PlantSnap?
        </h2>
        <ul className="list-disc list-inside space-y-2 text-green-700">
          <li>Instant plant identification with high accuracy</li>
          <li>
            Learn about plant species, their characteristics, and care tips
          </li>
          <li>Contribute to biodiversity research and conservation efforts</li>
          <li>
            Perfect for gardeners, hikers, students, and nature enthusiasts
          </li>
        </ul>
      </section>
    </div>
  );
}
