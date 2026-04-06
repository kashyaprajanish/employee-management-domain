import { Router, Request, Response, NextFunction } from "express";
import { salaryService } from "../services/salaryService";
import { ValidationError, NotFoundError } from "../utils/errors";

const router = Router();

// GET /employees/:id/salary-calculation - Calculate salary for an employee
router.get(
  "/:id/salary-calculation",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new ValidationError("Invalid employee ID");
      }

      const result = await salaryService.calculateSalary(id);
      if (!result) {
        throw new NotFoundError("Employee not found");
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
