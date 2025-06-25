import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProjectForm from "@/components/forms/projectForm";
import AssignmentForm from "@/components/forms/assignmentForm";
import EngineersList from "./engineersList";
import ProjectsList from "./projectsList";
import AnalyticsOverview from "./analytics";

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

type Props = {
  engineers: Engineer[];
  projects: Project[];
  user: any;
  fetchData: () => void;
};

const DashboardTabs = ({ engineers, projects, user, fetchData }: Props) => {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);

  return (
    <Tabs defaultValue="team" className="space-y-6">
      <TabsList className="flex flex-col sm:flex-row w-full gap-2">
        <TabsTrigger className="flex-1 cursor-pointer" value="team">
          Team Overview
        </TabsTrigger>
        <TabsTrigger className="flex-1 cursor-pointer" value="projects">
          Projects
        </TabsTrigger>
        <TabsTrigger className="flex-1 cursor-pointer" value="analytics">
          Analytics
        </TabsTrigger>
      </TabsList>

      {/* TEAM TAB */}
      <TabsContent value="team" className="space-y-6">
        <EngineersList engineers={engineers} />
      </TabsContent>

      {/* PROJECTS TAB */}
      <TabsContent value="projects" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Project Management</h2>

          <div className="flex flex-wrap gap-2">
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
        </div>

        <ProjectsList
          projects={projects}
          onEdit={(project: any) => {
            setEditingProject(project);
            setIsProjectDialogOpen(true);
          }}
        />

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
                fetchData();
              }}
              managerId={user?._id}
            />
          </DialogContent>
        </Dialog>
      </TabsContent>

      {/* ANALYTICS TAB */}
      <TabsContent value="analytics" className="space-y-6">
        <AnalyticsOverview engineers={engineers} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
