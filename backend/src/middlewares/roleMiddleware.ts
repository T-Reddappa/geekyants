import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const allowRoles = (...roles: ("engineer" | "manager")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (!req.user) {
      res.status(403).json({ msg: "Access denied. No user info" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ msg: "Access denied. Insufficient role" });
      return;
    }

    next();
  };
};
