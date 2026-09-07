import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import ProjectDetail from './pages/public/ProjectDetail';
import ArticleDetail from './pages/public/ArticleDetail';
import Login from './pages/public/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProfile from './pages/admin/ManageProfile';
import ManageProjects from './pages/admin/ManageProjects';
import ManageArticles from './pages/admin/ManageArticles';
import ManageSkills from './pages/admin/ManageSkills';
import ManageExperiences from './pages/admin/ManageExperiences';
import ManageEducation from './pages/admin/ManageEducations';
import ManageCertifications from './pages/admin/ManageCertifications';
import ManageResumes from './pages/admin/ManageResumes';
import ManageMessages from './pages/admin/ManageMessages';
import ManageSettings from './pages/admin/ManageSettings';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute>
                  <ManageProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute>
                  <ManageProjects />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/articles"
              element={
                <ProtectedRoute>
                  <ManageArticles />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/skills"
              element={
                <ProtectedRoute>
                  <ManageSkills />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/experience"
              element={
                <ProtectedRoute>
                  <ManageExperiences />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/education"
              element={
                <ProtectedRoute>
                  <ManageEducation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/certifications"
              element={
                <ProtectedRoute>
                  <ManageCertifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/resumes"
              element={
                <ProtectedRoute>
                  <ManageResumes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute>
                  <ManageMessages />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <ManageSettings />
                </ProtectedRoute>
              }
            />

            <Route path="/project/:identifier" element={<ProjectDetail />} />
            <Route path="/article/:identifier" element={<ArticleDetail />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;