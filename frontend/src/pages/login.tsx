import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: User;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: "engineer" | "manager";
  skills?: string[];
  seniority?: "junior" | "mid" | "senior";
  maxCapacity?: number;
  department?: string;
};

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post<LoginResponse>("/auth/login", data);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      setUser(user);

      if (user.role === "manager") {
        navigate("/dashboard/manager");
      } else {
        navigate("/dashboard/engineer");
      }
    } catch (err: any) {
      alert("Invalid credentials or server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Sign In to Your RMS Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">Email is required</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">Password is required</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full mt-2 text-sm cursor-pointer"
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
