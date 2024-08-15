import React from "react";
require("dotenv").config();
interface PlantInfoProps {
  info: string;
}

export default function PlantInfo({ info }: PlantInfoProps) {
  // Parse the information
  const lines = info.split("\n");

  // Extract the name
  const name = lines[0].replace("This is a ", "").split(",")[0].trim();

  // Extract common name if present
  const commonName =
    lines[0].split("also known as")[1]?.trim().replace("**", "") || "";

  // Extract scientific name if present
  const scientificName = lines[1]?.match(/\*\*(.*?)\*\*/)?.[1] || "";

  // Extract description from the remaining lines
  const description = lines
    .slice(2, lines.length - 2)
    .join(" ")
    .replace(/\*\*/g, "");

  // Extract country and medicinal qualities
  const country = lines[lines.length - 2]?.replace("Country: ", "").trim();
  const medicinalQualities = lines[lines.length - 1]
    ?.replace("Medicinal qualities: ", "")
    .trim();

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-md max-w-md mx-auto w-full">
      <h2 className="text-2xl font-semibold mb-4 text-green-300">
        Information
      </h2>
      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b border-gray-600">
            <td className="py-2 pr-4 font-bold">Name</td>
            <td className="py-2">{name}</td>
          </tr>
          {commonName && (
            <tr className="border-b border-gray-600">
              <td className="py-2 pr-4 font-bold">Common Name</td>
              <td className="py-2">{commonName}</td>
            </tr>
          )}
          {scientificName && (
            <tr className="border-b border-gray-600">
              <td className="py-2 pr-4 font-bold">Scientific Name</td>
              <td className="py-2">{scientificName}</td>
            </tr>
          )}
          <tr className="border-b border-gray-600">
            <td className="py-2 pr-4 font-bold"></td>
            <td className="py-2">{description}</td>
          </tr>
          {country && (
            <tr className="border-b border-gray-600">
              <td className="py-2 pr-4 font-bold"></td>
              <td className="py-2">{country}</td>
            </tr>
          )}
          {medicinalQualities && (
            <tr>
              <td className="py-2 pr-4 font-bold">Medicinal Qualities</td>
              <td className="py-2">{medicinalQualities}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
