import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Search, Users, Briefcase, BarChart3 } from "lucide-react";
import api from "../../lib/api";
import { useAuth } from "../../context/auth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
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
import ProjectForm from "@/components/forms/projectForm";
import AssignmentForm from "@/components/forms/assignmentForm";

type Engineer = {
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

type Project = {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  teamSize: number;
  status: "planning" | "active" | "completed";
  requiredSkills: string[];
};

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [engineersRes, projectsRes] = await Promise.all([
        api.get("/engineers"),
        api.get("/projects"),
      ]);

      const engineersWithCapacity = await Promise.all(
        (engineersRes.data as Engineer[]).map(async (eng: Engineer) => {
          try {
            const capacityRes = await api.get(`/engineers/${eng._id}/capacity`);
            return {
              ...eng,
              currentCapacity: (capacityRes.data as any).allocated || 0,
            };
          } catch (error) {
            return {
              ...eng,
              currentCapacity: 0,
            };
          }
        })
      );

      setEngineers(engineersWithCapacity);
      setProjects(projectsRes.data as Project[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEngineers = engineers.filter((eng) => {
    const matchesSearch =
      eng.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eng.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "overloaded" && eng.currentCapacity > 80) ||
      (filterStatus === "underutilized" && eng.currentCapacity < 30) ||
      (filterStatus === "available" && eng.currentCapacity < 50);
    return matchesSearch && matchesStatus;
  });

  const totalEngineers = engineers.length;
  const overloadedEngineers = engineers.filter(
    (eng) => eng.currentCapacity > 80
  ).length;
  const underutilizedEngineers = engineers.filter(
    (eng) => eng.currentCapacity < 30
  ).length;
  const averageUtilization =
    engineers.length > 0
      ? engineers.reduce((sum, eng) => sum + eng.currentCapacity, 0) /
        engineers.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10">
      <div className="p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Manager Dashboard
          </h1>
          <p className="text-gray-600">Manage your team and projects</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Engineers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEngineers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Projects
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter((p) => p.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overloaded</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {overloadedEngineers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Utilization
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageUtilization.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="flex flex-col sm:flex-row w-full gap-2">
            <TabsTrigger className="flex-1" value="team">
              Team Overview
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="projects">
              Projects
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="analytics">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search engineers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="overloaded">Overloaded</SelectItem>
                    <SelectItem value="underutilized">Underutilized</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredEngineers.map((eng) => (
                <Card key={eng._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{eng.name}</h3>
                          <Badge
                            variant={
                              eng.employmentType === "full-time"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {eng.employmentType}
                          </Badge>
                          <Badge variant="outline">{eng.seniority}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Department: {eng.department}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {eng.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="w-48">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Capacity</span>
                          <span>
                            {eng.currentCapacity}% / {eng.maxCapacity}%
                          </span>
                        </div>
                        <Progress
                          value={eng.currentCapacity}
                          className="mb-2"
                        />
                        <div className="text-xs text-gray-500">
                          {eng.currentCapacity > 80
                            ? "Overloaded"
                            : eng.currentCapacity < 30
                            ? "Underutilized"
                            : "Well balanced"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="projects" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Project Management</h2>
              <Button
                className="cursor-pointer"
                onClick={() => {
                  setEditingProject(null);
                  setIsProjectDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
              <Dialog
                open={isAssignmentDialogOpen}
                onOpenChange={setIsAssignmentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="cursor-pointer"
                    variant="secondary"
                    onClick={() => setIsAssignmentDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Engineer to Project</DialogTitle>
                    <DialogDescription>
                      Select an engineer, project, allocation %, role and
                      duration.
                    </DialogDescription>
                  </DialogHeader>

                  <AssignmentForm
                    engineers={engineers}
                    projects={projects}
                    onSuccess={() => {
                      setIsAssignmentDialogOpen(false);
                      fetchData();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {project.name}
                          </h3>
                          <Badge
                            variant={
                              project.status === "active"
                                ? "default"
                                : project.status === "completed"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.requiredSkills.map((skill) => (
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
                          {new Date(project.startDate).toLocaleDateString()} -{" "}
                          {new Date(project.endDate).toLocaleDateString()} •
                          Team Size: {project.teamSize}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="ml-4 mt-2 md:mt-0"
                        onClick={() => {
                          setEditingProject(project);
                          setIsProjectDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Shared Create/Edit Project Dialog */}
            <Dialog
              open={isProjectDialogOpen}
              onOpenChange={(open) => {
                setIsProjectDialogOpen(open);
                if (!open) setEditingProject(null);
              }}
            >
              <DialogContent className="max-h-[90vh] w-full sm:max-w-lg overflow-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProject ? "Edit Project" : "Create New Project"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProject
                      ? "Update this project's information and required skills."
                      : "Set up a new project with required skills and team size."}
                  </DialogDescription>
                </DialogHeader>

                <ProjectForm
                  initialValues={editingProject}
                  onClose={() => {
                    setIsProjectDialogOpen(false);
                    setEditingProject(null);
                    fetchData(); // refresh project list
                  }}
                  managerId={user?._id}
                />
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold">Team Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Capacity Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Overloaded (&gt;80%)</span>
                      <span className="font-semibold text-red-600">
                        {overloadedEngineers}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Well Balanced (30-80%)</span>
                      <span className="font-semibold text-green-600">
                        {
                          engineers.filter(
                            (eng) =>
                              eng.currentCapacity >= 30 &&
                              eng.currentCapacity <= 80
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Underutilized (&lt;30%)</span>
                      <span className="font-semibold text-yellow-600">
                        {underutilizedEngineers}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skill Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.from(
                      new Set(engineers.flatMap((eng) => eng.skills))
                    ).map((skill) => {
                      const count = engineers.filter((eng) =>
                        eng.skills.includes(skill)
                      ).length;
                      return (
                        <div key={skill} className="flex justify-between">
                          <span>{skill}</span>
                          <span className="font-semibold">
                            {count} engineers
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagerDashboard;
