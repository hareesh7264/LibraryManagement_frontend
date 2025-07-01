import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Loginpages";
import DashboardPage from "./pages/DashboardPage";
import BooksPage from "./pages/BooksPage";
import MembersPage from "./pages/MembersPage";
import IssuePage from "./pages/IssuePage";
import ReportsPage from "./pages/ReportsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BooksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <MembersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues"
          element={
            <ProtectedRoute>
              <IssuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
