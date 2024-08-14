import { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";
import PlantInfo from "./PlantInfo"; // Ensure this is correctly imported

const API_KEY = "AIzaSyBoaQLCLBHXjZo9eY5QKyJbrzNhFIajgWw"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

interface ImageUploadProps {
  setPlantInfo: (info: string) => void; // Typing the setPlantInfo function to accept a string
}

export default function ImageUpload({ setPlantInfo }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setErrorMessage("");
    setPlantInfo("");

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const imageData = await file.arrayBuffer();
      const base64Image = Buffer.from(imageData).toString("base64");
      const response = await model.generateContent([
        "Identify this plant and provide its name, scientific name, brief description, the country where it is found, and any medicinal qualities.",
        { inlineData: { data: base64Image, mimeType: file.type } },
      ]);
      const result = response.response.text();
      setPlantInfo(result);
    } catch (error) {
      let errorMsg = "Unknown error occurred";
      if (error instanceof Error) {
        errorMsg = `Error: ${error.name} - ${error.message}`;
      }
      setErrorMessage(errorMsg);
      setPlantInfo("Error identifying plant. See error message for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const captureImage = async () => {
    setImagePreview(null); // Clear the previous image preview
    setCameraActive(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } }, // Use rear camera
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          console.log("Camera stream started with rear camera");
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

      setImagePreview(null); // Clear the old image preview

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured_image.jpg", {
            type: "image/jpeg",
          });
          handleImageUpload(file); // Process the new image
        }
      }, "image/jpeg");

      // Stop the camera stream
      if (videoRef.current.srcObject instanceof MediaStream) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }

      setCameraActive(false); // Disable camera preview
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
      e.target.value = ""; // Reset the file input value
    }
  };

  return (
    <div className="mb-8 text-center">
      <div className="flex justify-center space-x-4 mb-4">
        <label
          htmlFor="image-upload"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors"
        >
          Upload Plant Image
        </label>
        <button
          onClick={captureImage}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Capture Photo
        </button>
      </div>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        ref={fileInputRef}
      />
      {isLoading && <p className="mt-4 text-gray-600">Identifying plant...</p>}
      {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
      {imagePreview && (
        <div className="mt-4 flex justify-center">
          <Image
            src={imagePreview}
            alt="Uploaded plant"
            width={300}
            height={300}
            objectFit="contain"
          />
        </div>
      )}
      {cameraActive && (
        <div className="mt-4">
          <video
            ref={videoRef}
            className="w-full max-w-md"
            autoPlay
            playsInline
          />
          <button
            onClick={takePhoto}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Take Photo
          </button>
        </div>
      )}
    </div>
  );
}
