/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import Layout from "./components/layout/Layout";
import Loading from "./components/Loading";
import { Toaster } from "sonner";
import { HelmetProvider } from 'react-helmet-async';
import "./lib/i18n";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TestRIASEC = lazy(() => import("./pages/TestRIASEC"));
const AICounselor = lazy(() => import("./pages/AICounselor"));
const Community = lazy(() => import("./pages/Community"));
const SubmitRoadmap = lazy(() => import("./pages/SubmitRoadmap"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const RoadmapDetail = lazy(() => import("./pages/RoadmapDetail"));
const AboutTest = lazy(() => import("./pages/AboutTest"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProjectExplore = lazy(() => import("./pages/ProjectExplore"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Toaster position="top-center" expand={false} richColors closeButton />
        <Router>
          <Layout>
            <Suspense fallback={<Loading message="Memuat Halaman" submessage="Sebentar lagi siap..." />}>
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
            </Suspense>
          </Layout>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
