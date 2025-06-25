import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Calendar, Clock, User, Edit } from "lucide-react";
import { useAuth } from "../../context/auth";
import api from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

type Assignment = {
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

type EngineerProfile = {
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

const EngineerDashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [profile, setProfile] = useState<EngineerProfile | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [currentCapacity, setCurrentCapacity] = useState(0);

  const { register, handleSubmit, reset, control } = useForm();

  const fetchData = async () => {
    try {
      if (!user?._id) return;

      const [assignmentsRes, profileRes, capacityRes] = await Promise.all([
        api.get(`/assignments?engineerId=${user._id}`),
        api.get(`/auth/profile`),
        api.get(`/engineers/${user._id}/capacity`),
      ]);

      setAssignments(assignmentsRes.data as Assignment[]);
      setProfile(profileRes.data as EngineerProfile);
      setCurrentCapacity((capacityRes.data as any).allocated || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [user]);

  const onUpdateProfile = async (data: any) => {
    console.log("tried to update profile");
    try {
      await api.put(`/engineers/${user?._id}`, {
        ...data,
        skills: data.skills.split(",").map((skill: string) => skill.trim()),
      });
      setIsProfileDialogOpen(false);
      reset();
      fetchData();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "planning":
        return "outline";
      default:
        return "outline";
    }
  };

  const getCapacityStatus = (capacity: number) => {
    if (capacity > 80) return { text: "Overloaded", color: "text-red-600" };
    if (capacity < 30)
      return { text: "Underutilized", color: "text-yellow-600" };
    return { text: "Well balanced", color: "text-green-600" };
  };

  const upcomingAssignments = assignments.filter(
    (a) => new Date(a.startDate) > new Date()
  );
  const currentAssignments = assignments.filter(
    (a) =>
      new Date(a.startDate) <= new Date() && new Date(a.endDate) >= new Date()
  );
  const completedAssignments = assignments.filter(
    (a) => new Date(a.endDate) < new Date()
  );

  const capacityStatus = getCapacityStatus(currentCapacity);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Engineer Dashboard
          </h1>
          <p className="text-gray-600">
            View your assignments and manage your profile
          </p>
        </div>

        {/* Profile Summary Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{profile?.name}</h2>
                  <p className="text-gray-600">{profile?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{profile?.seniority}</Badge>
                    <Badge
                      variant={
                        profile?.employmentType === "full-time"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {profile?.employmentType}
                    </Badge>
                    <Badge variant="outline">{profile?.department}</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{currentCapacity}%</div>
                <div className="text-sm text-gray-500">Current Capacity</div>
                <div className={`text-sm ${capacityStatus.color}`}>
                  {capacityStatus.text}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Capacity Utilization</span>
                <span>
                  {currentCapacity}% / {profile?.maxCapacity}%
                </span>
              </div>
              <Progress value={currentCapacity} className="h-2" />
            </div>
            <div className="mt-4">
              <Dialog
                open={isProfileDialogOpen}
                onOpenChange={setIsProfileDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
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
                  <form
                    onSubmit={handleSubmit(onUpdateProfile)}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        {...register("name")}
                        defaultValue={profile?.name}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="skills">Skills (comma separated)</Label>
                      <Input
                        {...register("skills", { required: true })}
                        defaultValue={profile?.skills.join(", ")}
                        placeholder="React, Node.js, Python"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seniority">Seniority Level</Label>
                      <Controller
                        name="seniority"
                        control={control}
                        defaultValue={profile?.seniority}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select seniority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="junior">Junior</SelectItem>
                              <SelectItem value="mid">Mid-level</SelectItem>
                              <SelectItem value="senior">Senior</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        {...register("department", { required: true })}
                        defaultValue={profile?.department}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="cursor-pointer">
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Current Assignments */}
          <TabsContent value="current" className="space-y-6">
            <h2 className="text-xl font-semibold">Current Assignments</h2>
            {currentAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No current assignments
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {currentAssignments.map((assignment) => (
                  <Card key={assignment._id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {assignment.project.name}
                            </h3>
                            <Badge
                              variant={getStatusColor(
                                assignment.project.status
                              )}
                            >
                              {assignment.project.status}
                            </Badge>
                            <Badge variant="outline">{assignment.role}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {assignment.project.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {assignment.project.requiredSkills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            <Clock className="inline w-4 h-4 mr-1" />
                            {new Date(
                              assignment.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(assignment.endDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {assignment.allocationPercentage}%
                          </div>
                          <div className="text-sm text-gray-500">
                            Allocation
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Upcoming Assignments */}
          <TabsContent value="upcoming" className="space-y-6">
            <h2 className="text-xl font-semibold">Upcoming Assignments</h2>
            {upcomingAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No upcoming assignments
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {upcomingAssignments.map((assignment) => (
                  <Card key={assignment._id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {assignment.project.name}
                            </h3>
                            <Badge
                              variant={getStatusColor(
                                assignment.project.status
                              )}
                            >
                              {assignment.project.status}
                            </Badge>
                            <Badge variant="outline">{assignment.role}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {assignment.project.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {assignment.project.requiredSkills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            <Calendar className="inline w-4 h-4 mr-1" />
                            Starting:{" "}
                            {new Date(
                              assignment.startDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {assignment.allocationPercentage}%
                          </div>
                          <div className="text-sm text-gray-500">
                            Allocation
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Completed Assignments */}
          <TabsContent value="completed" className="space-y-6">
            <h2 className="text-xl font-semibold">Completed Assignments</h2>
            {completedAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No completed assignments
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {completedAssignments.map((assignment) => (
                  <Card key={assignment._id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {assignment.project.name}
                            </h3>
                            <Badge variant="secondary">Completed</Badge>
                            <Badge variant="outline">{assignment.role}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {assignment.project.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {assignment.project.requiredSkills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            <Calendar className="inline w-4 h-4 mr-1" />
                            {new Date(
                              assignment.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(assignment.endDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {assignment.allocationPercentage}%
                          </div>
                          <div className="text-sm text-gray-500">
                            Allocation
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Timeline View */}
          <TabsContent value="timeline" className="space-y-6">
            <h2 className="text-xl font-semibold">Assignment Timeline</h2>
            <div className="space-y-4">
              {assignments
                .sort(
                  (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime()
                )
                .map((assignment, index) => (
                  <div key={assignment._id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          new Date(assignment.startDate) <= new Date() &&
                          new Date(assignment.endDate) >= new Date()
                            ? "bg-blue-500"
                            : new Date(assignment.endDate) < new Date()
                            ? "bg-gray-400"
                            : "bg-green-500"
                        }`}
                      />
                      {index < assignments.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 mt-2" />
                      )}
                    </div>
                    <Card className="flex-1">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">
                              {assignment.project.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {assignment.role}
                            </p>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(
                                assignment.startDate
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                assignment.endDate
                              ).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {assignment.allocationPercentage}%
                            </div>
                            <Badge
                              variant={getStatusColor(
                                assignment.project.status
                              )}
                              className="text-xs"
                            >
                              {assignment.project.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EngineerDashboard;
