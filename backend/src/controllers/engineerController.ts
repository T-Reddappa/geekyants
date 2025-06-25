import { Request, Response } from "express";
import User from "../models/User";
import Assignment from "../models/Assignment";
import { AuthRequest } from "../middlewares/authMiddleware";

// GET /api/engineers
export const getEngineers = async (req: Request, res: Response) => {
  try {
    const engineers = await User.find({ role: "engineer" }).select("-password");
    res.json(engineers);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch engineers", error: err });
  }
};

// GET /api/engineers/:id/capacity
export const getEngineerCapacity = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const engineer = await User.findById(id);
    if (!engineer) {
      res.status(404).json({ msg: "Engineer not found" });
      return;
    }

    const today = new Date();

    const activeAssignments = await Assignment.find({
      engineerId: id,
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    const totalAllocated = activeAssignments.reduce(
      (sum, a) => sum + a.allocationPercentage,
      0
    );

    const available = engineer.maxCapacity - totalAllocated;

    res.json({
      engineerId: id,
      maxCapacity: engineer.maxCapacity,
      allocated: totalAllocated,
      available,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to calculate capacity", error: err });
  }
};

export const getEngineerById = async (req: Request, res: Response) => {
  try {
    const engineer = await User.findById(req.params.id).select("-password");
    if (!engineer) {
      res.status(404).json({ message: "Engineer not found" });
      return;
    }
    res.json(engineer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEngineer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedEngineer = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-password");

    if (!updatedEngineer) {
      res.status(404).json({ message: "Engineer not found" });
      return;
    }

    res.json(updatedEngineer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
