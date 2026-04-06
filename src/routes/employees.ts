import { Router, Request, Response, NextFunction } from "express";
import {
  employeeService,
  CreateEmployeeSchema,
  UpdateEmployeeSchema,
} from "../services/employeeService";
import { ValidationError, NotFoundError } from "../utils/errors";

const router = Router();

// POST /employees - Create a new employee
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = CreateEmployeeSchema.parse(req.body);
    const employee = await employeeService.create(validated);
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
});

// GET /employees - Get all employees
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employees = await employeeService.findAll();
    res.json(employees);
  } catch (error) {
    next(error);
  }
});

// GET /employees/:id - Get an employee by ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      throw new ValidationError("Invalid employee ID");
    }

    const employee = await employeeService.findById(id);
    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
});

// PUT /employees/:id - Update an employee
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      throw new ValidationError("Invalid employee ID");
    }

    const validated = UpdateEmployeeSchema.parse(req.body);

    // Check if employee exists
    const existing = await employeeService.findById(id);
    if (!existing) {
      throw new NotFoundError("Employee not found");
    }

    const employee = await employeeService.update(id, validated);
    res.json(employee);
  } catch (error) {
    next(error);
  }
});

// DELETE /employees/:id - Delete an employee
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        throw new ValidationError("Invalid employee ID");
      }

      // Check if employee exists
      const existing = await employeeService.findById(id);
      if (!existing) {
        throw new NotFoundError("Employee not found");
      }

      await employeeService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
