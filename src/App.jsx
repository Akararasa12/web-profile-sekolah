import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import PopupModal from './components/PopupModal'
import TopBanner from './components/TopBanner'
import SideWatermark from './components/SideWatermark'

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Profil = lazy(() => import('./pages/Profil'))
const Teachers = lazy(() => import('./pages/Teachers'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const PPDB = lazy(() => import('./pages/PPDB'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminApplicants = lazy(() => import('./pages/AdminApplicants'))
const AdminTeachers = lazy(() => import('./pages/AdminTeachers'))
const AdminBlog = lazy(() => import('./pages/AdminBlog'))
const AdminGallery = lazy(() => import('./pages/AdminGallery'))
const AdminSettings = lazy(() => import('./pages/AdminSettings'))
const AdminGuide = lazy(() => import('./pages/AdminGuide'))

// Loading component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            padding: '16px 24px',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid #f1f5f9',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <ScrollToTop />
        <TopBanner />
        <SideWatermark />
        <PopupModal />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/profil" element={<MainLayout><Profil /></MainLayout>} />
            <Route path="/guru" element={<MainLayout><Teachers /></MainLayout>} />
            <Route path="/galeri" element={<MainLayout><Gallery /></MainLayout>} />
            <Route path="/berita" element={<MainLayout><Blog /></MainLayout>} />
            <Route path="/berita/:id" element={<MainLayout><BlogPost /></MainLayout>} />
            <Route path="/ppdb" element={<MainLayout><PPDB /></MainLayout>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout><Dashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/applicants" element={
              <ProtectedRoute>
                <AdminLayout><AdminApplicants /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/teachers" element={
              <ProtectedRoute>
                <AdminLayout><AdminTeachers /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/blog" element={
              <ProtectedRoute>
                <AdminLayout><AdminBlog /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/gallery" element={
              <ProtectedRoute>
                <AdminLayout><AdminGallery /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminLayout><AdminSettings /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/guide" element={
              <ProtectedRoute>
                <AdminLayout><AdminGuide /></AdminLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={
              <MainLayout>
                <div className="min-h-screen flex items-center justify-center text-center p-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-4 text-primary-600">Halaman Belum Tersedia</h1>
                    <p className="text-slate-500 mb-8 font-medium">Halaman ini sedang dalam tahap pengembangan.</p>
                    <a href="/" className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold">Kembali ke Beranda</a>
                  </div>
                </div>
              </MainLayout>
            } />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App
