import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import api from "../../lib/api";
import { useToast } from "../../lib/useToast";

type Engineer = {
  _id: string;
  name: string;
  skills: string[];
};

type Project = {
  _id: string;
  name: string;
  requiredSkills: string[];
};

type Props = {
  engineers: Engineer[];
  projects: Project[];
  onSuccess: () => void;
};

export default function AssignmentForm({
  engineers,
  projects,
  onSuccess,
}: Props) {
  const { showSuccess, showError, showWarning } = useToast();

  const { register, handleSubmit, setValue, control } = useForm();
  const [filteredEngineers, setFilteredEngineers] = useState<Engineer[]>([]);
  const selectedProjectId = useWatch({
    control,
    name: "projectId",
  });

  useEffect(() => {
    if (selectedProjectId) {
      const selectedProject = projects.find((p) => p._id === selectedProjectId);
      if (selectedProject) {
        const suitableEngineers = engineers.filter((engineer) =>
          selectedProject.requiredSkills.some((skill) =>
            engineer.skills.includes(skill)
          )
        );
        setFilteredEngineers(suitableEngineers);
      }
    } else {
      setFilteredEngineers(engineers);
    }
  }, [selectedProjectId, projects, engineers]);

  const onSubmit = async (data: any) => {
    try {
      if (!data.engineerId || !data.projectId) {
        showWarning("Please select both an engineer and a project.");
        return;
      }
      await api.post("/assignments", {
        engineerId: data.engineerId,
        projectId: data.projectId,
        allocationPercentage: Number(data.allocationPercentage),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        role: data.role,
      });
      showSuccess("Assignment created successfully!");
      onSuccess();
    } catch (err: any) {
      console.error(err);
      // Error handling is done by API interceptor, but we can add specific messages if needed
      showError("Failed to create assignment. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Project</Label>
        <Select
          onValueChange={(val) => {
            setValue("projectId", val);
            setValue("engineerId", ""); // Reset engineer when project changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Engineer (Filtered by Skill)</Label>
        <Select
          onValueChange={(val) => setValue("engineerId", val)}
          disabled={!selectedProjectId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Engineer" />
          </SelectTrigger>
          <SelectContent>
            {filteredEngineers.map((eng) => (
              <SelectItem key={eng._id} value={eng._id}>
                {eng.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Allocation (%)</Label>
        <Input
          type="number"
          min="1"
          max="100"
          {...register("allocationPercentage", { required: true })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input type="date" {...register("startDate", { required: true })} />
        </div>
        <div>
          <Label>End Date</Label>
          <Input type="date" {...register("endDate", { required: true })} />
        </div>
      </div>

      <div>
        <Label>Role</Label>
        <Input
          placeholder="Developer, Tech Lead, etc."
          {...register("role", { required: true })}
        />
      </div>

      <Button type="submit">Assign</Button>
    </form>
  );
}
