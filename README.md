# Employee Management Domain API

A production-ready REST API for managing employees and calculating salary metrics, built with Express.js, TypeScript, Prisma, and SQLite.

## Features

- **Employee CRUD Operations**: Create, read, update, and delete employee records
- **Salary Calculation**: Automatically calculate net salary with country-specific tax deductions
- **Salary Metrics**: Query salary statistics by country or job title
- **Type-Safe**: Full TypeScript support with Zod validation
- **Well-Tested**: Comprehensive test suite with 22+ tests covering all features
- **Production-Ready**: Error handling, request logging, and middleware
- **SQLite Database**: Lightweight, file-based database with Prisma ORM

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: SQLite with Prisma ORM v6
- **Validation**: Zod
- **Testing**: Jest with Supertest
- **Code Quality**: TypeScript strict mode

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
npx prisma migrate deploy  # Initialize database
```

### Development

```bash
# Start development server
npm run dev

# Watch mode tests
npm run test:watch

# Run all tests
npm test

# Generate test coverage
npm run test:coverage
```

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Employee Management

#### Create Employee

```http
POST /employees
Content-Type: application/json

{
  "fullName": "John Doe",
  "jobTitle": "Software Engineer",
  "country": "United States",
  "salary": 100000
}
```

**Response**: `201 Created`

#### Get All Employees

```http
GET /employees
```

**Response**: `200 OK` - Array of employees

#### Get Employee by ID

```http
GET /employees/:id
```

**Response**: `200 OK` or `404 Not Found`

#### Update Employee

```http
PUT /employees/:id
Content-Type: application/json

{
  "salary": 120000
}
```

**Response**: `200 OK` or `404 Not Found`

#### Delete Employee

```http
DELETE /employees/:id
```

**Response**: `204 No Content` or `404 Not Found`

### Salary Calculation

#### Calculate Salary with Tax Deductions

```http
GET /employees/:id/salary-calculation
```

**Response Example:**

```json
{
  "employeeId": 1,
  "grossSalary": 100000,
  "tds": 12000,
  "netSalary": 88000
}
```

**Tax Deduction Rules:**

- **India**: 10% TDS (Tax Deducted at Source)
- **United States**: 12% TDS
- **All other countries**: No deductions (net = gross)

### Salary Metrics

#### Get Salary Statistics by Country

```http
GET /salary-metrics/by-country/:country?
// Example: GET /salary-metrics/by-country/United%20States
```

**Response Example:**

```json
{
  "country": "United States",
  "minSalary": 80000,
  "maxSalary": 150000,
  "averageSalary": 110000,
  "employeeCount": 3
}
```

#### Get Average Salary by Job Title

```http
GET /salary-metrics/by-job-title/:jobTitle
// Example: GET /salary-metrics/by-job-title/Senior%20Engineer
```

**Response Example:**

```json
{
  "jobTitle": "Senior Engineer",
  "averageSalary": 125000,
  "employeeCount": 2
}
```

## Project Structure

```
src/
├── routes/
│   ├── employees.ts      # Employee CRUD REST endpoints
│   ├── salary.ts         # Salary calculation endpoints
│   └── salaryMetrics.ts  # Salary metrics/statistics endpoints
├── services/
│   ├── employeeService.ts    # Employee business logic & DB queries
│   └── salaryService.ts      # Salary calculations & metrics logic
├── middleware/
│   └── errorHandler.ts   # Global error handling & request logging
├── utils/
│   └── errors.ts         # Custom error classes (ValidationError, NotFoundError)
├── db.ts                 # Prisma client singleton
├── server.ts             # Express app configuration
└── index.ts              # Server entry point
prisma/
├── schema.prisma         # Database schema definition
└── migrations/           # Database migrations
__tests__/
├── employees.test.ts         # Employee CRUD tests (11 test cases)
├── salary-calculation.test.ts # Salary calculation tests (3 test cases)
└── salary-metrics.test.ts     # Salary metrics tests (8 test cases)
```

## Database Schema

```prisma
model Employee {
  id        Int      @id @default(autoincrement())
  fullName  String
  jobTitle  String
  country   String
  salary    Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Input Validation

### Employee Resource

- `fullName`: Required, non-empty string
- `jobTitle`: Required, non-empty string
- `country`: Required, non-empty string
- `salary`: Required, positive number

All fields are required for creation. Optional fields can be updated using PUT requests.

## Error Responses

All errors return consistent JSON responses:

```json
{
  "error": "Error message",
  "details": "Optional error details for validation errors"
}
```

**HTTP Status Codes:**

- `201`: Employee created successfully
- `200`: Request successful
- `204`: Delete successful (no content)
- `400`: Validation error (invalid input)
- `404`: Employee or resource not found
- `500`: Internal server error

## Implementation Details

### AI-Assisted Development

This project was developed using GitHub Copilot to accelerate development while maintaining code quality:

1. **Scaffolding**: Copilot generated the initial project structure and boilerplate
2. **Route Handlers**: API endpoints were generated with proper Express patterns
3. **Service Layer**: Business logic functions created with type safety
4. **Error Handling**: Custom error classes and middleware generated for consistency
5. **Tests**: Test structure and assertions scaffolded, then refined

**Key Principle**: AI was used for routine code generation, while critical logic (validation rules, tax calculations, metrics aggregation) was carefully reviewed and verified.

### Architecture Decisions

1. **Service Layer Pattern**: Business logic decoupled from route handlers for testability
2. **Zod Validation**: Runtime validation at API boundaries prevents invalid data propagation
3. **Prisma ORM**: Type-safe database queries with automatic migrations
4. **Express Error Middleware**: Centralized error handling for consistent responses
5. **SQLite for Development**: Lightweight database suitable for the project scope

### Testing Strategy (TDD)

Tests follow strict Test-Driven Development methodology:

**Test Coverage:**

- **Employee CRUD**: 11 tests
  - Create (with validation)
  - Read (single and all)
  - Update
  - Delete
- **Salary Calculation**: 3 tests
  - India deduction (10%)
  - US deduction (12%)
  - No deduction for other countries
- **Salary Metrics**: 8 tests
  - By country: min, max, average, count
  - By job title: average, count
  - 404 for missing data

**TDD Workflow:**

1. **Red Phase**: Write failing tests that define requirements
2. **Green Phase**: Implement minimal code to pass tests
3. **Refactor Phase**: Improve code quality, error handling, and structure

### Performance Considerations

- SQLite suitable for development and small-scale deployments (< 1M records)
- Prisma query results can be cached for frequently accessed metrics
- Recommend PostgreSQL for production with concurrent traffic
- Add database indexes on `country` and `jobTitle` for large datasets:
  ```prisma
  @@index([country])
  @@index([jobTitle])
  ```

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- src/__tests__/employees.test.ts
```

## Environment Variables

Create `.env` files for different environments:

**.env (Development)**

```
DATABASE_URL=file:./dev.db
NODE_ENV=development
PORT=3000
```

**.env.test (Testing)**

```
DATABASE_URL=file:./test.db
NODE_ENV=test
PORT=3000
```

## Git Commit History

The project follows TDD with clear commit messages:

- Initial setup (Prisma, Express, TypeScript)
- Tests for Employee CRUD
- Implementation of Employee CRUD routes
- Tests for Salary Calculation
- Implementation of Salary Calculation
- Tests for Salary Metrics
- Implementation of Salary Metrics
- Refactoring with error handling middleware
- Production-ready improvements

## Future Enhancement Ideas

- [ ] Authentication & Authorization (JWT)
- [ ] Rate limiting middleware
- [ ] Pagination for employee listing
- [ ] Advanced filtering and search capabilities
- [ ] Salary history/audit trail tracking
- [ ] Benefits calculation module
- [ ] Performance bonus calculations
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Caching layer (Redis)
- [ ] Database migration to PostgreSQL for production
- [ ] CSV import/export for bulk operations
- [ ] Analytics dashboard data endpoints

## Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "ok"
}
```

## Development Commands

```bash
# Install dependencies
npm install

# Start in development mode with hot-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting (TypeScript checks)
npx tsc --noEmit

# Run tests with watch
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Troubleshooting

### Database Connection Issues

```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (deletes all data)
rm dev.db test.db
npx prisma migrate deploy
```

### Port Already in Use

```bash
# Change PORT in .env
PORT=3001 npm run dev
```

## License

MIT

## Contact & Support

This project was created as a professional coding exercise demonstrating:

- Test-Driven Development (TDD) best practices
- Production-ready API architecture
- TypeScript type safety and strict mode
- Effective AI-assisted development
- Comprehensive documentation and testing
