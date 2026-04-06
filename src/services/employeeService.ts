import { z } from "zod";
import prisma from "../db";

// Validation schema
export const CreateEmployeeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  country: z.string().min(1, "Country is required"),
  salary: z.number().positive("Salary must be positive"),
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>;

// Service functions
export const employeeService = {
  async create(data: CreateEmployeeInput) {
    return prisma.employee.create({
      data,
    });
  },

  async findAll() {
    return prisma.employee.findMany({
      orderBy: { id: "asc" },
    });
  },

  async findById(id: number) {
    return prisma.employee.findUnique({
      where: { id },
    });
  },

  async update(id: number, data: UpdateEmployeeInput) {
    return prisma.employee.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return prisma.employee.delete({
      where: { id },
    });
  },
};
