import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Engineer } from "@/types";

const EngineersList = ({ engineers }: { engineers: Engineer[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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

  return (
    <div className="space-y-6">
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
                  <Progress value={eng.currentCapacity} className="mb-2" />
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
    </div>
  );
};

export default EngineersList;
