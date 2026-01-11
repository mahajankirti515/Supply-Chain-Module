# 🎮 KhelKud Admin Dashboard

A high-performance, full-stack Supply Chain Management and Admin Dashboard. This project provides a comprehensive suite of tools for tracking products, managing vendors, and visualizing supply chain data with a premium, modern interface.

---

## 🛠️ Tech Stack

### **Frontend** (Modern & Responsive UI)
- **Framework**: [React.js](https://reactjs.org/) (Powered by **Vite**)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) (Primitive UI components)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with **Zod**
- **Data Export**: [XLSX](https://sheetjs.com/) (Excel processing)

### **Backend** (Robust & Scalable API)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Sequelize](https://sequelize.org/)
- **Validation**: [Express Validator](https://express-validator.github.io/docs/)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** installed and running on your machine.
- **npm** or **yarn** package manager.

---

### � Step 1: Backend Configuration

The backend handles the API logic and database communication.

1. **Navigate to the backend directory**:
   ```bash
   cd supply-chain-backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root of `supply-chain-backend/` and add the following:
   ```env
   # Database Configuration
   DB_NAME=supply_chain_db
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432

   # Server Configuration
   PORT=7777
   ```
   *Note: Ensure you have created the database `supply_chain_db` in your PostgreSQL instance.*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The backend will now be running at `http://localhost:7777`.

---

### 🔵 Step 2: Frontend Configuration

The frontend provides the user interface for managing the supply chain.

1. **Navigate to the frontend directory**:
   ```bash
   cd Assessment
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root of `Assessment/` and point it to your backend API:
   ```env
   VITE_API_BASE_URL=http://localhost:7777/api
   ```

4. **Start the Application**:
   ```bash
   npm run dev
   ```
   The application will launch at `http://localhost:3000` (or the port specified by Vite).

---

## ✨ Key Features

- **Inventory Control**: Add, update, and track products in real-time.
- **Vendor Analytics**: Detailed insights into vendor performance and relationships.
- **Live Reports**: Dynamic charts for visualizing supply chain efficiency.
- **Excel Integration**: Import and export large datasets seamlessly.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile screens.
- **Dark/Light Mode**: Premium UI with theme support.

---

## 📂 Project Structure

```text
KhelKud_Admin_Dashboard/
├── Assessment/             # Frontend React Application
│   ├── src/components/     # Reusable UI components
│   ├── src/pages/          # Main application pages
│   └── src/store/          # Redux Toolkit state management
├── supply-chain-backend/   # Express API Service
│   ├── src/controllers/    # Request handling logic
│   ├── src/models/         # Sequelize database models
│   └── src/routes/         # API endpoint definitions
└── README.md               # Documentation
```

---

# Supply-Chain-Module
