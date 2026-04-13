import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NewAssessment from './pages/NewAssessment';
import History from './pages/History';
import ReportAnalysis from './pages/ReportAnalysis';
import Profile from './pages/Profile';
import Diseases from './pages/Diseases';
import TreatmentExploration from './pages/TreatmentExploration';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/assessment" element={<ProtectedRoute><Layout><NewAssessment /></Layout></ProtectedRoute>} />
          <Route path="/report-analysis" element={<ProtectedRoute><Layout><ReportAnalysis /></Layout></ProtectedRoute>} />
          <Route path="/diseases" element={<ProtectedRoute><Layout><Diseases /></Layout></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/:diseaseName/treatment-exploration" element={<ProtectedRoute><Layout><TreatmentExploration /></Layout></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
