import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Engineer, Project } from "@/types";
import { Users, Briefcase, BarChart3 } from "lucide-react";

const StatsCards = ({
  engineers,
  projects,
}: {
  engineers: Engineer[];
  projects: Project[];
}) => {
  const totalEngineers = engineers.length;
  const overloadedEngineers = engineers.filter(
    (eng) => eng.currentCapacity > 80
  ).length;
  const averageUtilization =
    engineers.length > 0
      ? engineers.reduce((sum, eng) => sum + eng.currentCapacity, 0) /
        engineers.length
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Engineers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEngineers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {projects.filter((p) => p.status === "active").length}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
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
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {averageUtilization.toFixed(1)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
