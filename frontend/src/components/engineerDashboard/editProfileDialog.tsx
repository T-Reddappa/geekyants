import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import api from "@/lib/api";
import { useState } from "react";
import type { EngineerProfile } from "@/types";

const EditProfileDialog = ({
  profile,
  onProfileUpdated,
}: {
  profile: EngineerProfile | null;
  onProfileUpdated: () => void;
}) => {
  const { register, handleSubmit, control, reset } = useForm();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await api.put(`/engineers/${profile?._id}`, {
        ...data,
        skills: data.skills.split(",").map((s: string) => s.trim()),
      });
      setOpen(false);
      reset();
      onProfileUpdated();
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your skills and profile information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              {...register("name")}
              defaultValue={profile?.name}
              readOnly
            />
          </div>
          <div>
            <Label>Skills</Label>
            <Input
              {...register("skills", { required: true })}
              defaultValue={profile?.skills.join(", ")}
            />
          </div>
          <div>
            <Label>Seniority</Label>
            <Controller
              name="seniority"
              control={control}
              defaultValue={profile?.seniority}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select seniority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>Department</Label>
            <Input
              {...register("department", { required: true })}
              defaultValue={profile?.department}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
