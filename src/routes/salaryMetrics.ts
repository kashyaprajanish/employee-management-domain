import { Router, Request, Response, NextFunction } from "express";
import { salaryService } from "../services/salaryService";
import { NotFoundError } from "../utils/errors";

const router = Router();

// GET /by-country/:country - Get salary metrics by country
router.get(
  "/by-country/:country",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const country = decodeURIComponent(req.params.country);
      const result = await salaryService.getMetricsByCountry(country);

      if (!result) {
        throw new NotFoundError("No employees found in that country");
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

// GET /by-job-title/:jobTitle - Get average salary by job title
router.get(
  "/by-job-title/:jobTitle",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobTitle = decodeURIComponent(req.params.jobTitle);
      const result = await salaryService.getMetricsByJobTitle(jobTitle);

      if (!result) {
        throw new NotFoundError("No employees found with that job title");
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
