import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { users } from "./users";
import { projects } from "./projects";
import { assignments } from "./assignments";
import User from "../models/User";
import Project from "../models/Project";
import Assignment from "../models/Assignment";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await User.deleteMany({});
    await Project.deleteMany({});
    await Assignment.deleteMany({});
    console.log("🧹 Cleared old data");

    // Insert Users
    const hashedUsers = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    );

    const userDocs = await User.insertMany(hashedUsers);
    const engineers = userDocs.filter((u) => u.role === "engineer");
    const manager = userDocs.find((u) => u.role === "manager");

    console.log(`👤 Created ${userDocs.length} users`);

    // Insert Projects
    const projectDocs = await Project.insertMany(
      projects.map((p) => ({
        ...p,
        managerId: manager!._id,
      }))
    );
    console.log(`📁 Created ${projectDocs.length} projects`);

    // Insert Assignments
    const getUserId = (email: string) =>
      userDocs.find((u) => u.email === email)?._id;
    const getProjectId = (name: string) =>
      projectDocs.find((p) => p.name === name)?._id;

    const assignmentPayloads = assignments.map((a) => ({
      engineerId: getUserId(a.engineerEmail)!,
      projectId: getProjectId(a.projectName)!,
      allocationPercentage: a.allocationPercentage,
      startDate: a.startDate,
      endDate: a.endDate,
      role: a.role,
    }));

    await Assignment.insertMany(assignmentPayloads);
    console.log(`📌 Created ${assignmentPayloads.length} assignments`);

    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
