import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Engineer } from "@/types";

const AnalyticsOverview = ({ engineers }: { engineers: Engineer[] }) => {
  const overloaded = engineers.filter((eng) => eng.currentCapacity > 80).length;
  const wellBalanced = engineers.filter(
    (eng) => eng.currentCapacity >= 30 && eng.currentCapacity <= 80
  ).length;
  const underutilized = engineers.filter(
    (eng) => eng.currentCapacity < 30
  ).length;

  const allSkills = Array.from(new Set(engineers.flatMap((eng) => eng.skills)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Capacity Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Overloaded (&gt;80%)</span>
            <span className="font-semibold text-red-600">{overloaded}</span>
          </div>
          <div className="flex justify-between">
            <span>Well Balanced (30-80%)</span>
            <span className="font-semibold text-green-600">{wellBalanced}</span>
          </div>
          <div className="flex justify-between">
            <span>Underutilized (&lt;30%)</span>
            <span className="font-semibold text-yellow-600">
              {underutilized}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skill Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {allSkills.map((skill) => {
            const count = engineers.filter((eng) =>
              eng.skills.includes(skill)
            ).length;
            return (
              <div key={skill} className="flex justify-between">
                <span>{skill}</span>
                <span className="font-semibold">{count} engineers</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;
