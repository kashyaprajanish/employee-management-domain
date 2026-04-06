import request from "supertest";
import app from "../server";
import prisma from "../db";

describe("Employee CRUD API", () => {
  beforeAll(async () => {
    // Reset database before tests
    await prisma.employee.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /employees", () => {
    it("should create a new employee with required fields", async () => {
      const response = await request(app).post("/employees").send({
        fullName: "John Doe",
        jobTitle: "Software Engineer",
        country: "United States",
        salary: 100000,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.fullName).toBe("John Doe");
      expect(response.body.jobTitle).toBe("Software Engineer");
      expect(response.body.country).toBe("United States");
      expect(response.body.salary).toBe(100000);
    });

    it("should return 400 if fullName is missing", async () => {
      const response = await request(app).post("/employees").send({
        jobTitle: "Software Engineer",
        country: "United States",
        salary: 100000,
      });

      expect(response.status).toBe(400);
    });

    it("should return 400 if jobTitle is missing", async () => {
      const response = await request(app).post("/employees").send({
        fullName: "John Doe",
        country: "United States",
        salary: 100000,
      });

      expect(response.status).toBe(400);
    });

    it("should return 400 if country is missing", async () => {
      const response = await request(app).post("/employees").send({
        fullName: "John Doe",
        jobTitle: "Software Engineer",
        salary: 100000,
      });

      expect(response.status).toBe(400);
    });

    it("should return 400 if salary is missing", async () => {
      const response = await request(app).post("/employees").send({
        fullName: "John Doe",
        jobTitle: "Software Engineer",
        country: "United States",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /employees", () => {
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
            jobTitle: "Manager",
            country: "India",
            salary: 80000,
          },
        ],
      });
    });

    it("should retrieve all employees", async () => {
      const response = await request(app).get("/employees");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].fullName).toBe("John Doe");
      expect(response.body[1].fullName).toBe("Jane Smith");
    });
  });

  describe("GET /employees/:id", () => {
    let employeeId: number;

    beforeEach(async () => {
      await prisma.employee.deleteMany({});
      const employee = await prisma.employee.create({
        data: {
          fullName: "John Doe",
          jobTitle: "Engineer",
          country: "United States",
          salary: 100000,
        },
      });
      employeeId = employee.id;
    });

    it("should retrieve an employee by id", async () => {
      const response = await request(app).get(`/employees/${employeeId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(employeeId);
      expect(response.body.fullName).toBe("John Doe");
    });

    it("should return 404 if employee not found", async () => {
      const response = await request(app).get("/employees/9999");

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /employees/:id", () => {
    let employeeId: number;

    beforeEach(async () => {
      await prisma.employee.deleteMany({});
      const employee = await prisma.employee.create({
        data: {
          fullName: "John Doe",
          jobTitle: "Engineer",
          country: "United States",
          salary: 100000,
        },
      });
      employeeId = employee.id;
    });

    it("should update an employee", async () => {
      const response = await request(app).put(`/employees/${employeeId}`).send({
        fullName: "Jane Doe",
        jobTitle: "Senior Engineer",
        country: "Canada",
        salary: 120000,
      });

      expect(response.status).toBe(200);
      expect(response.body.fullName).toBe("Jane Doe");
      expect(response.body.jobTitle).toBe("Senior Engineer");
      expect(response.body.country).toBe("Canada");
      expect(response.body.salary).toBe(120000);
    });

    it("should return 404 if employee not found", async () => {
      const response = await request(app).put("/employees/9999").send({
        fullName: "Jane Doe",
      });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /employees/:id", () => {
    let employeeId: number;

    beforeEach(async () => {
      await prisma.employee.deleteMany({});
      const employee = await prisma.employee.create({
        data: {
          fullName: "John Doe",
          jobTitle: "Engineer",
          country: "United States",
          salary: 100000,
        },
      });
      employeeId = employee.id;
    });

    it("should delete an employee", async () => {
      const response = await request(app).delete(`/employees/${employeeId}`);

      expect(response.status).toBe(204);

      const retrieved = await request(app).get(`/employees/${employeeId}`);
      expect(retrieved.status).toBe(404);
    });

    it("should return 404 if employee not found", async () => {
      const response = await request(app).delete("/employees/9999");

      expect(response.status).toBe(404);
    });
  });
});
