import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";

const ProjectsList = ({
  projects,
  onEdit,
}: {
  projects: Project[];
  onEdit: any;
}) => {
  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <Card key={project._id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
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
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(project.startDate).toLocaleDateString()} -{" "}
                  {new Date(project.endDate).toLocaleDateString()} • Team Size:{" "}
                  {project.teamSize}
                </div>
              </div>
              <Button
                variant="outline"
                className="ml-4 mt-2 md:mt-0"
                onClick={() => onEdit(project)}
              >
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectsList;
