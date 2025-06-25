import { Request, Response } from "express";
import Assignment from "../models/Assignment";
import Project from "../models/Project";
import User from "../models/User";
import { AuthRequest } from "../middlewares/authMiddleware";

// CREATE assignment
export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const {
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role,
    } = req.body;

    const engineer = await User.findById(engineerId);
    if (!engineer) {
      res.status(404).json({ msg: "Engineer not found" });
      return;
    }

    const activeAssignments = await Assignment.find({
      engineerId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // overlapping
      ],
    });

    const currentAllocation = activeAssignments.reduce(
      (sum, a) => sum + a.allocationPercentage,
      0
    );

    const available = engineer.maxCapacity - currentAllocation;

    if (allocationPercentage > available) {
      res
        .status(400)
        .json({ msg: `Engineer only has ${available}% capacity left.` });
      return;
    }

    const assignment = await Assignment.create({
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role,
    });

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ msg: "Assignment creation failed", error: err });
  }
};

// LIST all assignments
export const getAssignments = async (req: Request, res: Response) => {
  try {
    const { engineerId } = req.query;
    const query = engineerId ? { engineerId } : {};
    const assignments = await Assignment.find(query)
      .populate({
        path: "projectId",
        select: "name description startDate endDate status requiredSkills",
      })
      .populate({
        path: "engineerId",
        select: "name email",
      })
      .lean();

    const transformedAssignments = assignments.map((assignment) => {
      const { projectId, ...rest } = assignment;
      return {
        ...rest,
        project: projectId,
      };
    });

    res.status(200).json(transformedAssignments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE assignment
export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ msg: "Assignment not found" });
      return;
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update", error: err });
  }
};

// DELETE assignment
export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ msg: "Assignment not found" });
      return;
    }
    res.status(200).json({ msg: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete", error: err });
  }
};
