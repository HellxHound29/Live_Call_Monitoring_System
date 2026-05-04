import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import SignIn from "./pages/SignIn";
import CdrDashboard from "./pages/CdrDashboard";
import UserManagement from "./pages/UserManagement";
import MonitorLogs from "./pages/MonitorLogs";
import ConnectionSettings from "./pages/ConnectionSettings";
import LiveMonitoring from "./pages/LiveMonitoring";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<ProtectedRoute><CdrDashboard /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path="/logs" element={<ProtectedRoute><MonitorLogs /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><ConnectionSettings /></ProtectedRoute>} />
        <Route path="/live" element={<ProtectedRoute><LiveMonitoring /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;