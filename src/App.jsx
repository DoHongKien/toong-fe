import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Tours from './pages/Tours'
import TourDetail from './pages/TourDetail'
import Level from './pages/Level'
import AdventurePass from './pages/AdventurePass'

import Login from './pages/cms/Login'
import CMSLayout from './pages/cms/CMSLayout'
import ProtectedRoute from './pages/cms/ProtectedRoute'
import Dashboard from './pages/cms/Dashboard'
import ToursManagement from './pages/cms/ToursManagement'
import BookingsManagement from './pages/cms/BookingsManagement'
import StaffManagement from './pages/cms/StaffManagement'
import PassManagement from './pages/cms/PassManagement'
import PassOrders from './pages/cms/PassOrders'
import BannerManagement from './pages/cms/BannerManagement'
import BlogManagement from './pages/cms/BlogManagement'
import FAQManagement from './pages/cms/FAQManagement'
import Contacts from './pages/cms/Contacts'
import Profile from './pages/cms/Profile'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:slug" element={<TourDetail />} />
          <Route path="/level" element={<Level />} />
          <Route path="/adventure-pass" element={<AdventurePass />} />

          {/* Auth Route */}
          <Route path="/cms/login" element={<Login />} />

          {/* CMS Routes - Protected */}
          <Route
            path="/cms"
            element={
              <ProtectedRoute>
                <CMSLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="tours" element={<ToursManagement />} />
            <Route path="bookings" element={<BookingsManagement />} />
            <Route path="passes" element={<PassManagement />} />
            <Route path="pass-orders" element={<PassOrders />} />
            <Route path="banners" element={<BannerManagement />} />
            <Route path="blogs" element={<BlogManagement />} />
            <Route path="faqs" element={<FAQManagement />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
