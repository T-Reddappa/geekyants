import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { RocketIcon } from "lucide-react";
import { useAuth } from "@/context/auth";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex flex-col items-center justify-center px-6 text-center">
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-gray-800 mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Welcome to ProjectMate
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Manage engineers, track assignments, and streamline resource allocation
        — all in one intuitive dashboard.
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button
          className="text-lg p-6 rounded-lg shadow-md cursor-pointer "
          onClick={() =>
            user
              ? navigate(
                  user?.role === "manager"
                    ? "/dashboard/manager"
                    : "/dashboard/engineer"
                )
              : navigate("/login")
          }
        >
          <RocketIcon className="w-5 h-5 mr-2" />
          Launch Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default Home;
