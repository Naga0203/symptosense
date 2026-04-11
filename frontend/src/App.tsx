import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NewAssessment from './pages/NewAssessment';
import History from './pages/History';
import ReportAnalysis from './pages/ReportAnalysis';
import Profile from './pages/Profile';
import Diseases from './pages/Diseases';
import Layout from './components/Layout';
import Auth from './pages/Auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Auth routes disabled for testing */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/assessment" element={<Layout><NewAssessment /></Layout>} />
        <Route path="/report-analysis" element={<Layout><ReportAnalysis /></Layout>} />
        <Route path="/diseases" element={<Layout><Diseases /></Layout>} />
        <Route path="/history" element={<Layout><History /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

