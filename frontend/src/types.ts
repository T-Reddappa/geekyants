// frontend/src/types.ts
export type Project = {
  _id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  teamSize: number;
  requiredSkills: string[];
  status: "planning" | "active" | "completed";
  managerId?: string;
};
