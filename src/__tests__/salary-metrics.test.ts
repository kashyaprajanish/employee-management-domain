import request from "supertest";
import app from "../server";
import prisma from "../db";

describe("Salary Metrics API", () => {
  beforeEach(async () => {
    await prisma.employee.deleteMany({});
    await prisma.employee.createMany({
      data: [
        {
          fullName: "John Doe",
          jobTitle: "Engineer",
          country: "United States",
          salary: 100000,
        },
        {
          fullName: "Jane Smith",
          jobTitle: "Engineer",
          country: "United States",
          salary: 120000,
        },
        {
          fullName: "Bob Johnson",
          jobTitle: "Manager",
          country: "United States",
          salary: 150000,
        },
        {
          fullName: "Raj Kumar",
          jobTitle: "Engineer",
          country: "India",
          salary: 80000,
        },
        {
          fullName: "Priya Singh",
          jobTitle: "Manager",
          country: "India",
          salary: 90000,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /salary-metrics/by-country/:country", () => {
    it("should retrieve salary metrics for a country", async () => {
      const response = await request(app).get(
        "/salary-metrics/by-country/United%20States",
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("country", "United States");
      expect(response.body).toHaveProperty("minSalary", 100000);
      expect(response.body).toHaveProperty("maxSalary", 150000);
      expect(response.body).toHaveProperty("averageSalary");
      expect(response.body.averageSalary).toBeCloseTo(123333.33, 1);
      expect(response.body).toHaveProperty("employeeCount", 3);
    });

    it("should retrieve salary metrics for India", async () => {
      const response = await request(app).get(
        "/salary-metrics/by-country/India",
      );

      expect(response.status).toBe(200);
      expect(response.body.country).toBe("India");
      expect(response.body.minSalary).toBe(80000);
      expect(response.body.maxSalary).toBe(90000);
      expect(response.body.averageSalary).toBe(85000);
      expect(response.body.employeeCount).toBe(2);
    });

    it("should return 404 if no employees in that country", async () => {
      const response = await request(app).get(
        "/salary-metrics/by-country/XYZ%20Country",
      );

      expect(response.status).toBe(404);
    });
  });

  describe("GET /salary-metrics/by-job-title/:jobTitle", () => {
    it("should retrieve average salary for a job title", async () => {
      const response = await request(app).get(
        "/salary-metrics/by-job-title/Engineer",
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("jobTitle", "Engineer");
      expect(response.body).toHaveProperty("averageSalary");
      expect(response.body.averageSalary).toBeCloseTo(100000, 1);
      expect(response.body).toHaveProperty("employeeCount", 3);
    });

    it("should retrieve average salary for Manager position", async () => {
      const response = await request(app).get(
        "/salary-metrics/by-job-title/Manager",
      );

      expect(response.status).toBe(200);
      expect(response.body.jobTitle).toBe("Manager");
      expect(response.body.averageSalary).toBe(120000);
      expect(response.body.employeeCount).toBe(2);
    });

    it("should return 404 if no employees with that job title", async () => {
      const response = await request(app).get(
        "/salary-metrics/by-job-title/CEO",
      );

      expect(response.status).toBe(404);
    });
  });
});
