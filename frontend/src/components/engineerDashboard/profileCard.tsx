import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import EditProfileDialog from "./editProfileDialog";
import type { EngineerProfile } from "@/types";

const ProfileCard = ({
  profile,
  currentCapacity,
  capacityStatus,
  onProfileUpdated,
}: {
  profile: EngineerProfile | null;
  currentCapacity: number;
  capacityStatus: { text: string; color: string };
  onProfileUpdated: () => void;
}) => {
  return (
    <Card className="mb-8 bg-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between ">
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
          <EditProfileDialog
            profile={profile}
            onProfileUpdated={onProfileUpdated}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
