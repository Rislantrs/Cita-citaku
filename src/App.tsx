/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import TestRIASEC from "./pages/TestRIASEC";
import AICounselor from "./pages/AICounselor";
import Community from "./pages/Community";
import SubmitRoadmap from "./pages/SubmitRoadmap";
import Roadmap from "./pages/Roadmap";
import RoadmapDetail from "./pages/RoadmapDetail";
import AboutTest from "./pages/AboutTest";
import AdminDashboard from "./pages/AdminDashboard";
import ProjectExplore from "./pages/ProjectExplore";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";
import { Toaster } from "sonner";
import "./lib/i18n"; // Import i18n

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" expand={false} richColors closeButton />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about-test" element={<AboutTest />} />
            <Route path="/test" element={<TestRIASEC />} />
            <Route path="/counselor" element={<AICounselor />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/submit" element={<SubmitRoadmap />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/roadmap/:slug" element={<RoadmapDetail />} />
            <Route path="/explore-projects" element={<ProjectExplore />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/admin-rahasia" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

