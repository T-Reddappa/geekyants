import { useAuth } from "../context/auth";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };
  return (
    <nav className="bg-gray-800  shadow-2xl border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1
              className="text-4xl font-bold text-white cursor-pointer"
              onClick={() => navigate("/")}
            >
              RMS
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-white" />
              <span className="text-sm text-white">{user?.name}</span>
              <Badge variant="secondary" className="text-xs">
                {user?.role}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
