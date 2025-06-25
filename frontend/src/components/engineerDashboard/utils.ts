export const getStatusColor = (
  status: string
): "default" | "secondary" | "outline" => {
  switch (status) {
    case "active":
      return "default";
    case "completed":
      return "secondary";
    case "planning":
    default:
      return "outline";
  }
};

export const getCapacityStatus = (capacity: number) => {
  if (capacity > 80) return { text: "Overloaded", color: "text-red-600" };
  if (capacity < 30) return { text: "Underutilized", color: "text-yellow-600" };
  return { text: "Well balanced", color: "text-green-600" };
};
