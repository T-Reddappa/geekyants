export type Project = {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  teamSize: number;
  requiredSkills: string[];
  status: "planning" | "active" | "completed";
  managerId?: string;
};

export type Engineer = {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  employmentType: string;
  skills: string[];
  currentCapacity: number;
  seniority: string;
  maxCapacity: number;
};

export type EngineerProfile = {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  seniority: "junior" | "mid" | "senior";
  maxCapacity: number;
  department: string;
  currentCapacity: number;
  employmentType: "full-time" | "part-time";
};

export type Assignment = {
  _id: string;
  project: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    requiredSkills: string[];
  };
  role: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
};
