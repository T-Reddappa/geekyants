import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import api from "../../lib/api";
import { useToast } from "../../lib/useToast";
import type { Project } from "@/types";

type Props = {
  initialValues: Project | null;
  onClose: () => void;
  managerId?: string;
};

const ProjectForm = ({ initialValues, onClose, managerId }: Props) => {
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      teamSize: 1,
      requiredSkills: "",
      status: "planning",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        description: initialValues.description,
        startDate: initialValues.startDate.slice(0, 10),
        endDate: initialValues.endDate.slice(0, 10),
        teamSize: initialValues.teamSize,
        requiredSkills: initialValues.requiredSkills.join(", "),
        status: initialValues.status,
      });
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      requiredSkills: data.requiredSkills
        .split(",")
        .map((s: string) => s.trim()),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };

    try {
      if (initialValues) {
        await api.put(`/projects/${initialValues._id}`, payload);
        showSuccess("Project updated successfully!");
      } else {
        await api.post("/projects", {
          ...payload,
          managerId,
        });
        showSuccess("Project created successfully!");
      }
      onClose();
    } catch (err) {
      console.error("Failed to submit project", err);
      // Error handling is done by API interceptor, but we can add specific messages if needed
      if (initialValues) {
        showError("Failed to update project. Please try again.");
      } else {
        showError("Failed to create project. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input {...register("name", { required: true })} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea rows={3} {...register("description", { required: true })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input type="date" {...register("startDate", { required: true })} />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input type="date" {...register("endDate", { required: true })} />
        </div>
      </div>
      <div>
        <Label htmlFor="teamSize">Team Size</Label>
        <Input
          type="number"
          min="1"
          {...register("teamSize", { required: true })}
        />
      </div>
      <div>
        <Label htmlFor="requiredSkills">
          Required Skills (comma separated)
        </Label>
        <Input {...register("requiredSkills", { required: true })} />
      </div>
      <div>
        <Label>Status</Label>
        <Select
          onValueChange={(value) => setValue("status", value)}
          defaultValue={initialValues?.status || "planning"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end cursor-pointer">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialValues ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
