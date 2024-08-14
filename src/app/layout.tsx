import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plant Identifier",
  description: "Identify plants using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-green-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold animate__animated animate__fadeInLeft">
              Plant Identifier
            </h1>
            <p className="text-lg animate__animated animate__fadeInRight">
              Identify plants using AI by uploading or capturing a photo.
            </p>
          </div>
        </header>
        <main className="container mx-auto p-4">{children}</main>
        <footer className="bg-gray-800 text-white p-4 animate__animated animate__fadeInUp">
          <div className="container mx-auto text-center">
            
            <p>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="underline animate__animated animate__heartBeat"
              > <p> </p>
                A Product of SudeepKumarPanda
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
