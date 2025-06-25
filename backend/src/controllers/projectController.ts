import { Request, Response } from "express";
import Project from "../models/Project";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    console.log("request to create project");
    const {
      name,
      description,
      startDate,
      endDate,
      requiredSkills,
      teamSize,
      status,
    } = req.body;

    const project = await Project.create({
      name,
      description,
      startDate,
      endDate,
      requiredSkills,
      teamSize,
      status,
      managerId: req.user?.id,
    });
    console.log(project, "project created");

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create project", error: err });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().populate("managerId", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching projects", error: err });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "managerId",
      "name email"
    );
    if (!project) {
      res.status(404).json({ msg: "Project not found" });
      return;
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: "Error retrieving project", error: err });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Project.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updated) {
      res.status(404).json({ msg: "Project not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating project", err);
    res.status(500).json({ msg: "Server error" });
  }
};
