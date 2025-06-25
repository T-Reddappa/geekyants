import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { getStatusColor } from "./utils";
import type { Assignment } from "@/types";

const AssignmentCard = ({
  assignment,
  showDateType,
}: {
  assignment: Assignment;
  showDateType?: "range" | "start";
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg">{assignment.project.name}</h3>
            <Badge variant={getStatusColor(assignment.project.status)}>
              {assignment.project.status}
            </Badge>
            <Badge variant="outline">{assignment.role}</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {assignment.project.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {assignment.project.requiredSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            {showDateType === "start" ? (
              <>
                <Calendar className="inline w-4 h-4 mr-1" />
                Starting: {new Date(assignment.startDate).toLocaleDateString()}
              </>
            ) : (
              <>
                <Clock className="inline w-4 h-4 mr-1" />
                {new Date(assignment.startDate).toLocaleDateString()} -{" "}
                {new Date(assignment.endDate).toLocaleDateString()}
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            {assignment.allocationPercentage}%
          </div>
          <div className="text-sm text-gray-500">Allocation</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AssignmentCard;
