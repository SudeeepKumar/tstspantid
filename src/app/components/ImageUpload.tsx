import { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";

// Importing required hooks and components from React and other libraries:
// useState: to manage state variables like loading status, error messages, etc.
// useRef: to create references to DOM elements (e.g., file input, video).
// GoogleGenerativeAI: to interact with Google's Generative AI model.
// Image: Next.js component for optimized image handling.

const url = process.env.NEXT_PUBLIC_API_KEY || ""; // Provide a default empty string

const genAI = new GoogleGenerativeAI(url);

// Initializes the GoogleGenerativeAI object using the API key. This allows us to call the model for generating content based on inputs.

interface ImageUploadProps {
  setPlantInfo: (info: string) => void;
}

// Define the props that the ImageUpload component expects to receive:
// setPlantInfo: a function to update the plant information after identification.

export default function ImageUpload({ setPlantInfo }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Define the state variables and refs:
  // isLoading: tracks if the plant identification process is ongoing.
  // errorMessage: stores any error messages.
  // imagePreview: stores the base64 URL for the image preview.
  // fileInputRef: reference to the file input element.
  // videoRef: reference to the video element (for capturing photos).
  // cameraActive: tracks if the camera is active.

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setErrorMessage("");
    setPlantInfo("");

    // handleImageUpload: Handles the image upload and processing.
    // 1. Set loading state to true.
    // 2. Clear previous error messages and plant information.

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Create a preview of the uploaded image:
    // 1. Use FileReader to read the file as a data URL.
    // 2. When the reading is done, set the imagePreview state with the resulting URL.

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

      // Attempt to identify the plant using the uploaded image:
      // 1. Get the Generative AI model.
      // 2. Convert the file into an ArrayBuffer and then to a base64 string (required by the API).
      // 3. Call the API with a prompt asking for plant identification and attach the image as inline data.
      // 4. Once the API responds, extract the text result and update the plant information.

    } catch (error) {
      let errorMsg = "Unknown error occurred";
      if (error instanceof Error) {
        errorMsg = `Error: ${error.name} - ${error.message}`;
      }
      setErrorMessage(errorMsg);
      setPlantInfo("Error identifying plant. See error message for details.");

      // If any error occurs during the process:
      // 1. Set a generic error message.
      // 2. If the error is an instance of Error, update the error message with more specific details.
      // 3. Set the errorMessage state and display it to the user.

    } finally {
      setIsLoading(false);
    }

    // Finally, set the loading state to false, whether the process succeeded or failed.
  };

  const captureImage = async () => {
    setImagePreview(null);
    setCameraActive(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  };

  // captureImage: Activates the camera to capture a photo:
  // 1. Clear any existing image preview.
  // 2. Set cameraActive to true to show the camera interface.
  // 3. Request access to the user's camera, specifically the environment-facing camera.
  // 4. If access is granted, stream the video feed to the video element referenced by videoRef.
  // 5. If there's an error accessing the camera, log it to the console.

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

      setImagePreview(null);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured_image.jpg", {
            type: "image/jpeg",
          });
          handleImageUpload(file);
        }
      }, "image/jpeg");

      if (videoRef.current.srcObject instanceof MediaStream) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }

      setCameraActive(false);
    }
  };

  // takePhoto: Captures a still image from the video feed:
  // 1. Create a canvas element to draw the video frame.
  // 2. Set the canvas size to match the video dimensions.
  // 3. Draw the current video frame onto the canvas.
  // 4. Convert the canvas to a Blob (binary large object) and create a file from it.
  // 5. Pass the file to handleImageUpload for processing.
  // 6. Stop all video tracks to turn off the camera.
  // 7. Deactivate the camera interface.

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
      e.target.value = "";
    }
  };

  // handleFileInputChange: Handles file input change events:
  // 1. Check if a file was selected.
  // 2. If a file is present, call handleImageUpload with the selected file.
  // 3. Reset the input value to allow the same file to be selected again if needed.

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

// The return block defines the JSX that will be rendered:
// 1. Container for the entire component, including buttons for uploading or capturing an image.
// 2. A hidden input element to select files from the device storage.
// 3. Conditional rendering of the loading message, error message, image preview, and camera feed.
// 4. If cameraActive is true, display the video feed and a button to take a photo.
