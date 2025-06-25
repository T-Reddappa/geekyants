import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import api from "../../lib/api";
import { Card, CardContent } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { getCapacityStatus } from "@/components/engineerDashboard/utils";
import ProfileCard from "@/components/engineerDashboard/profileCard";
import AssignmentCard from "@/components/engineerDashboard/assignmentCard";

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
  const [currentCapacity, setCurrentCapacity] = useState(0);

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

  const capacityStatus = getCapacityStatus(currentCapacity);
  const upcoming = assignments.filter(
    (a) => new Date(a.startDate) > new Date()
  );
  const current = assignments.filter(
    (a) =>
      new Date(a.startDate) <= new Date() && new Date(a.endDate) >= new Date()
  );
  const completed = assignments.filter((a) => new Date(a.endDate) < new Date());

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
        <ProfileCard
          profile={profile}
          currentCapacity={currentCapacity}
          capacityStatus={capacityStatus}
          onProfileUpdated={fetchData}
        />

        <Tabs defaultValue="current" className="space-y-6 ">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 ">
            <TabsTrigger value="current" className="cursor-pointer">
              Current
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="cursor-pointer">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="completed" className="cursor-pointer">
              Completed
            </TabsTrigger>
            <TabsTrigger value="timeline" className="cursor-pointer">
              Timeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <h2 className="text-xl font-semibold">Current Assignments</h2>
            {current.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No current assignments
                </CardContent>
              </Card>
            ) : (
              current.map((a) => <AssignmentCard key={a._id} assignment={a} />)
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <h2 className="text-xl font-semibold">Upcoming Assignments</h2>
            {upcoming.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No upcoming assignments
                </CardContent>
              </Card>
            ) : (
              upcoming.map((a) => (
                <AssignmentCard
                  key={a._id}
                  assignment={a}
                  showDateType="start"
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <h2 className="text-xl font-semibold">Completed Assignments</h2>
            {completed.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No completed assignments
                </CardContent>
              </Card>
            ) : (
              completed.map((a) => (
                <AssignmentCard key={a._id} assignment={a} />
              ))
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <h2 className="text-xl font-semibold">Assignment Timeline</h2>
            <div className="space-y-4">
              {assignments
                .sort(
                  (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime()
                )
                .map((a, i) => (
                  <div key={a._id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          new Date(a.startDate) <= new Date() &&
                          new Date(a.endDate) >= new Date()
                            ? "bg-blue-500"
                            : new Date(a.endDate) < new Date()
                            ? "bg-gray-400"
                            : "bg-green-500"
                        }`}
                      />
                      {i < assignments.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 mt-2" />
                      )}
                    </div>

                    <div className="flex-1">
                      <AssignmentCard assignment={a} />
                    </div>
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
