"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Creator() {
  const developers = [
    {
      name: "PRIYANSHU TIWARI",
      role: "UG Student (Dept AIML)",
      image: "/images/team/6t28ik1mysy-image.png"
    },
    {
      name: "HIMANSHU TIWARI",
      role: "MS Student (NTU Taiwan)",
      image: "/images/team/nn5iczb231n-image.png"
    },
    {
      name: "RISHABH RAJ",
      role: "UG Student (Dept ISE)",
      image: "/images/team/IMG_21E9853910FA-1.jpeg"
    }
  ];

  const mentors = [
    {
      name: "Dr. Abhiram Anand",
      department: "Glass Expert, Associate Professor, Dept. of Physics",
      image: "/images/mentors/Dr. Abhiram Anand.jpeg"
    },
    {
      name: "Dr. S Ambareesh",
      department: "Professor, Dept. of AIML",
      image: "/images/mentors/Dr. S Ambareesh.jpg"
    },
    {
      name: "Dr. Hariharan N.",
      department: "Professor & Head of Dept. of Physics",
      image: "/images/mentors/Dr. Hariharan N..jpeg"
    }
  ];

  return (
    <div className="space-y-8">
      {/* College Affiliation */}
      <Card className="overflow-hidden bg-white/95">
        <CardHeader className="bg-gradient-to-r from-blue-500/20 to-blue-600/10 pb-2">
          <CardTitle className="text-center">Project Affiliation</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-4">
          <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 p-4">
            <div className="w-40 h-40 relative">
              <img
                src="/images/logos/smvit-logo.png"
                alt="Sir M. Visvesvaraya Institute of Technology"
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-red-800">SIR M. VISVESVARAYA INSTITUTE OF TECHNOLOGY</h2>
              <p className="text-slate-700 mt-2">
                Affiliated to VTU, Belagavi | Approved by AICTE, New Delhi / Govt. of Karnataka | Accredited by NAAC
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developers Section */}
      <Card className="overflow-hidden bg-white/95">
        <CardHeader className="bg-gradient-to-r from-purple-500/20 to-purple-600/10">
          <CardTitle className="text-center">Developers</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {developers.map((dev) => (
              <div key={dev.name} className="flex flex-col items-center p-4 bg-white/50 rounded-lg shadow-sm">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-blue-100 shadow-md">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center">{dev.name}</h3>
                <p className="text-sm text-gray-600 mt-1 text-center">{dev.role}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mentors Section */}
      <Card className="overflow-hidden bg-white/95">
        <CardHeader className="bg-gradient-to-r from-green-500/20 to-green-600/10">
          <CardTitle className="text-center">Mentors</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mentors.map((mentor, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-white/50 rounded-lg shadow-sm">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-green-100 shadow-md">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center">{mentor.name}</h3>
                <p className="text-sm text-gray-500 mt-1 text-center">{mentor.department}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
