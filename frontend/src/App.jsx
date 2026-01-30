import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Generate from './pages/Generate';
import Versions from './pages/Versions';
import Analytics from './pages/Analytics';
import PublicResume from './pages/PublicResume';
import HowItWorks from './pages/HowItWorks';

import Layout from './components/Layout';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route path="/generate" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
            <Route path="/versions" element={<ProtectedRoute><Versions /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          </Route>

          {/* Public Resume Routes - outside layout */}
          <Route path="/public/:username" element={<PublicResume />} />
          <Route path="/public/:username/:version" element={<PublicResume />} />
          <Route path="/public/:username/v/:profileName" element={<PublicResume />} />
          <Route path="/public/:username/v/:profileName/:version" element={<PublicResume />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
