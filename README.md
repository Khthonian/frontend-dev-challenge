
# Frontend Code Challenge

The task of this code challenge is to add functionality described below to this existing sample application: [https://github.com/dfds-frontend/frontend-dev-challenge](https://github.com/dfds-frontend/frontend-dev-challenge). Clone this project to get started.

The application is built using NextJS, TypeScript, Prisma, React Query, Tailwind, zod, and [https://ui.shadcn.com/](https://ui.shadcn.com/) for ready-made components. It is expected that you will complete the tasks below using the technologies listed.

The challenge consists of a variety of frontend tasks. We invite you to tailor your implementation as closely to the description as possible, otherwise be sure to document any deviations.

The Swagger documentation for the Mock API for this solution is available at:
[http://localhost:3000/api-doc](http://localhost:3000/api-doc)

## Task 1 - Create New Voyage
At the root of the application, place a "Create" button on the top left of the list of mock voyages.
When pressed, the button should open [https://ui.shadcn.com/docs/components/sheet](https://ui.shadcn.com/docs/components/sheet) with the form for creating a voyage inside.
The form should have the following validations:
- All fields are required.
- Departure date and time should be before arrival date and time.
Refresh the list of voyages once a voyage has been successfully created.
Display [https://ui.shadcn.com/docs/components/toast](https://ui.shadcn.com/docs/components/toast) with a success message.

## Task 2 - Introduce UnitType Relation to Voyage
Enable adding at least 5 UnitTypes to a voyage.
Ensure selection of a minimum of 5 UnitTypes.

## Task 3 - Modify the List
Add a "unittypes" column to the voyages table.
Display unit type count for each voyage.
Clicking on unit type count opens a PopOver showing selected UnitTypes: [https://ui.shadcn.com/docs/components/popover](https://ui.shadcn.com/docs/components/popover).
List to include:
- Name
- Default length

## Task 4 - Handling Voyage Deletion Error
You may have noticed that deleting a voyage does not always work. Add error handling to inform the user when that happens. It is sufficient to show [https://ui.shadcn.com/docs/components/toast](https://ui.shadcn.com/docs/components/toast) with the appropriate error message.
