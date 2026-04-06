import prisma from "../db";

// Deduction rules
const DEDUCTION_RATES: Record<string, number> = {
  India: 0.1, // 10% TDS
  "United States": 0.12, // 12% TDS
};

export const salaryService = {
  async calculateSalary(employeeId: number) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return null;
    }

    const grossSalary = employee.salary;
    const deductionRate = DEDUCTION_RATES[employee.country] || 0;
    const tds = grossSalary * deductionRate;
    const netSalary = grossSalary - tds;

    return {
      employeeId: employee.id,
      grossSalary,
      tds,
      netSalary,
    };
  },

  async getMetricsByCountry(country: string) {
    const employees = await prisma.employee.findMany({
      where: { country },
    });

    if (employees.length === 0) {
      return null;
    }

    const salaries = employees.map((e) => e.salary);
    const minSalary = Math.min(...salaries);
    const maxSalary = Math.max(...salaries);
    const averageSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;

    return {
      country,
      minSalary,
      maxSalary,
      averageSalary,
      employeeCount: employees.length,
    };
  },

  async getMetricsByJobTitle(jobTitle: string) {
    const employees = await prisma.employee.findMany({
      where: { jobTitle },
    });

    if (employees.length === 0) {
      return null;
    }

    const salaries = employees.map((e) => e.salary);
    const averageSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;

    return {
      jobTitle,
      averageSalary,
      employeeCount: employees.length,
    };
  },
};
