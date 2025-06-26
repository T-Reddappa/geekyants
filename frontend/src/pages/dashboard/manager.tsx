import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useAuth } from "../../context/auth";
import DashboardTabs from "@/components/managetDashboard/dashboardTabs";
import StatsCards from "@/components/managetDashboard/statsCards";
import type { Engineer, Project } from "@/types";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchData = async () => {
    try {
      const [engineersRes, projectsRes] = await Promise.all([
        api.get("/engineers"),
        api.get("/projects"),
      ]);

      const engineersWithCapacity = await Promise.all(
        (engineersRes.data as Engineer[]).map(async (eng) => {
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

  return (
    <div className="min-h-screen px-4 md:px-10 py-6 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600">Manage your team and projects</p>
      </div>

      <StatsCards engineers={engineers} projects={projects} />

      <DashboardTabs
        engineers={engineers}
        projects={projects}
        user={user}
        fetchData={fetchData}
      />
    </div>
  );
};

export default ManagerDashboard;
