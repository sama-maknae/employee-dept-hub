# 🏢 Employee & Department Hub

A modern web application for managing employees and departments with an intuitive interface built with Next.js and Material-UI.

## 📋 What This Project Does

This is a simple **Employee & Department Management System** that helps you:

- **Manage Employees**: Add, edit, delete, and view employee information
- **Manage Departments**: Create, update, and organize company departments  
- **Connect People**: Assign employees to departments and track relationships
- **Search & Filter**: Find employees and departments quickly
- **View Data**: See everything in clean, organized tables

## 🎯 Main Features

### 👥 Employee Management
- Add new employees with name and email
- Edit existing employee information
- Delete employees from the system
- View all employees in a searchable table
- Assign employees to multiple departments

### 🏢 Department Management  
- Create new departments with titles and descriptions
- Edit department details
- Delete departments (with warnings if employees are assigned)
- View department information and employee counts
- Track when departments were created and updated

### 🔗 Employee-Department Relationships
- Assign employees to departments
- Remove employees from departments
- View which employees belong to which departments
- See how many employees are in each department

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **UI Library**: Material-UI (MUI) for beautiful components
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Emotion CSS-in-JS
- **Forms**: React Hook Form for easy form handling
- **Development**: Docker for database setup

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- Docker (for database)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd table-manager
npm install
```

### 2. Setup Environment
```bash
cp .env.sample .env
```

### 3. Start Database
```bash
docker-compose up -d
```
This starts:
- PostgreSQL database on port 5432
- PgAdmin (database admin tool) on port 5050

### 4. Setup Database
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## 📱 How to Use

1. **Open the App**: Go to http://localhost:3000
2. **Choose a Tab**: 
   - Click "Employee" tab to manage employees
   - Click "Department" tab to manage departments
3. **Add Data**: Use the "+" button to add new employees or departments
4. **Edit/Delete**: Use the action buttons in each table row
5. **Search**: Use the search box to find specific items
6. **Assign Departments**: Use the school icon to assign employees to departments

## 🗂️ Project Structure

```
table-manager/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── employees/            # Employee CRUD operations
│   │   ├── departments/          # Department CRUD operations
│   │   └── employee-departments/ # Employee-Department relationships
│   ├── components/               # Reusable UI components
│   │   ├── common/              # Shared components (tables, forms, etc.)
│   │   └── containers/          # Page-specific components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Database connection
│   └── utils/                   # Helper functions
├── prisma/                      # Database schema and migrations
├── docker-compose.yml           # Database setup
└── package.json                 # Dependencies and scripts
```

## 🎨 Key Components

- **Data Tables**: Clean, sortable tables with pagination
- **Forms**: Easy-to-use forms for adding/editing data
- **Search**: Real-time search functionality
- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Shows loading spinners during operations
- **Error Handling**: User-friendly error messages

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Check code quality
```

## 🗄️ Database Access

- **PgAdmin**: http://localhost:5050
  - Email: admin@admin.com  
  - Password: admin
- **Database**: PostgreSQL on localhost:5432
  - Database: table_manager
  - User: postgres
  - Password: postgres

## 💡 Tips

- Use the search boxes to quickly find employees or departments
- The employee count in departments updates automatically
- You can assign one employee to multiple departments
- All changes are saved immediately to the database
- The app works great on both desktop and mobile devices
