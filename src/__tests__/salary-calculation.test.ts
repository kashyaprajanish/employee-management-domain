import request from "supertest";
import app from "../server";
import prisma from "../db";

describe("Salary Calculation API", () => {
  beforeEach(async () => {
    await prisma.employee.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /employees/:id/salary-calculation", () => {
    it("should calculate salary deductions for an Indian employee (10% TDS)", async () => {
      const employee = await prisma.employee.create({
        data: {
          fullName: "Raj Kumar",
          jobTitle: "Engineer",
          country: "India",
          salary: 100000,
        },
      });

      const response = await request(app).get(
        `/employees/${employee.id}/salary-calculation`,
      );

      expect(response.status).toBe(200);
      expect(response.body.grossSalary).toBe(100000);
      expect(response.body.tds).toBe(10000); // 10% of 100000
      expect(response.body.netSalary).toBe(90000); // 100000 - 10000
    });

    it("should calculate salary deductions for a US employee (12% TDS)", async () => {
      const employee = await prisma.employee.create({
        data: {
          fullName: "John Smith",
          jobTitle: "Engineer",
          country: "United States",
          salary: 100000,
        },
      });

      const response = await request(app).get(
        `/employees/${employee.id}/salary-calculation`,
      );

      expect(response.status).toBe(200);
      expect(response.body.grossSalary).toBe(100000);
      expect(response.body.tds).toBe(12000); // 12% of 100000
      expect(response.body.netSalary).toBe(88000); // 100000 - 12000
    });

    it("should have no deductions for other countries", async () => {
      const employee = await prisma.employee.create({
        data: {
          fullName: "Pierre Dupont",
          jobTitle: "Engineer",
          country: "France",
          salary: 100000,
        },
      });

      const response = await request(app).get(
        `/employees/${employee.id}/salary-calculation`,
      );

      expect(response.status).toBe(200);
      expect(response.body.grossSalary).toBe(100000);
      expect(response.body.tds).toBe(0);
      expect(response.body.netSalary).toBe(100000);
    });

    it("should return 404 if employee not found", async () => {
      const response = await request(app).get(
        `/employees/9999/salary-calculation`,
      );

      expect(response.status).toBe(404);
    });
  });
});
