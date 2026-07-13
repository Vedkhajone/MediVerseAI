# MediVerse AI Development Log

## Sprint 1 – Project Foundation

### Day 1

Date:

### Objectives
- Setup React project
- Setup folder structure
- Understand project architecture

### Completed
- Created React + Vite project
- Configured TypeScript
- Configured ESLint
- Created folder structure
- Created first Dashboard page

### Learned
- React project structure
- Difference between frontend and backend
- Importance of modular architecture

### Problems Faced
- (Write any issues here)

### Next Session
- Build AppShell
- Understand reusable components

# Sprint 2 - Day 1

## Objective
Build the first working dashboard using our own architecture.

## Completed
- Created AppShell component
- Understood React children
- Created DashboardPage
- Connected App.tsx to DashboardPage
- Successfully rendered the first MediVerse dashboard

## Learned
- What a Layout Component is
- What children are
- Component Composition
- React Project Structure

## Problems
- Initially copied AppShell from Lovable
- Learned why copying dependencies creates errors
- Decided to rebuild components ourselves

## Next Goal
Build Sidebar

## Sprint 2 – Day 2

### Goal
Build the first reusable application layout.

### Completed
- Created Sidebar component
- Integrated Sidebar into AppShell
- Built a two-column dashboard layout
- Understood nested layouts with Flexbox

### Learned
- Flexbox basics
- Nested components
- Layout composition
- Why dashboards reuse the same shell

### Next
- Style the sidebar
- Add icons
- Add active navigation

# Sprint 2 - Day 2

## Debugging Session

### Problem
Application displayed a black screen after introducing Lucide icons.

### Root Cause
The `lucide-react` package had not been installed.

### Solution
Installed the dependency:

npm install lucide-react

Verified the installation with a test component.

### Lesson Learned
Always install and verify a library before using it in components.

### Status
Application running successfully.

## Sprint 2 - Day 3

### Goal

Create the first reusable Header component.

### Completed

- Created Header.tsx
- Passed data using props
- Connected Header with AppShell

### Learned

- Props
- Component separation
- Reusable layouts

# Sprint 2 - Day 4

## Objective

Build the first reusable StatCard.

## Completed

- Created StatCard component
- Used Props
- Added four dashboard cards
- Learned reusable UI

## Learned

- Props
- Component Reuse
- Dashboard Layout

# Sprint 2 - Day 5

## Objective

Refactor Dashboard using OverviewCards.

## Completed

- Created OverviewCards component
- Refactored Dashboard
- Reduced duplicate code

## Learned

- Component hierarchy
- Parent-child components
- Refactoring

# Sprint 2 - Day 6

## Objective

Split Dashboard into reusable sections.

## Completed

- WelcomeSection
- QuickActions
- RecentActivity
- Cleaner Dashboard architecture

## Learned

- Component Composition
- Separation of Responsibilities
- Clean React Architecture

# Sprint 2 - Day 7

## Goal

Design the Patient data model.

## Completed

- Created Patient interface
- Added mock patient data
- Started Patients module

## Learned

- TypeScript interfaces
- Mock data
- Data modeling


## Sprint 2 - Day 8

### Goal
Display patient data using mock records.

### Completed
- Expanded mock patient dataset
- Created patient table
- Learned list rendering using map()

### Learned
- Rendering arrays
- Tables in React
- Working with TypeScript interfaces

# Sprint 3 - Day 1

## Goal

Initialize MediVerse AI backend.

## Completed

- Created backend project
- Configured Python virtual environment
- Installed FastAPI
- Created backend folder structure
- Implemented first API endpoints
- Verified backend server
- Explored Swagger documentation

## Learned

- FastAPI basics
- API endpoints
- Backend project organization
- Virtual environments

# Sprint 3 - Day 3

## Goal

Create the first production-style API endpoint.

## Completed

- Created patient router
- Added GET /patients endpoint
- Registered router in FastAPI
- Tested endpoint using Swagger

## Learned

- APIRouter
- Route registration
- API organization
- Swagger testing

# Sprint 3 - Day 4

## Goal
Implement patient creation API.

## Completed
- Created PatientCreate schema
- Added POST /patients endpoint
- Validated request body using Pydantic
- Tested patient creation in Swagger

## Learned
- POST requests
- Pydantic schemas
- Request validation
- Basic CRUD operations