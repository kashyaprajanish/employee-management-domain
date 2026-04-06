import { Router, Request, Response, NextFunction } from "express";
import { salaryService } from "../services/salaryService";
import { NotFoundError } from "../utils/errors";

const router = Router();

router.get(
  "/by-country/:country",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const country = String(req.params.country);
      const metrics = await salaryService.getMetricsByCountry(country);

      if (!metrics) {
        throw new NotFoundError("Employee data not found for this country");
      }

      res.json(metrics);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/by-job-title/:jobTitle",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobTitle = String(req.params.jobTitle);
      const metrics = await salaryService.getMetricsByJobTitle(jobTitle);

      if (!metrics) {
        throw new NotFoundError("Employee data not found for this job title");
      }

      res.json(metrics);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
