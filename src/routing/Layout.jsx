import React from 'react'
import LandingPage from '../landing/Page'
import Dashboard from '../dashboard/Page'
import HistoryPage from '../dashboard/History'
import DevicesPage from '../dashboard/Devices'
import SettingsPage from '../dashboard/Settings'
import SavedProjectsPage from '../dashboard/SavedProjects'
import Features from '../pages/Features'
import Pricing from '../pages/Pricing'
import Docs from '../pages/Docs'

import { Routes, Route } from 'react-router-dom'

const Layout = () => {
  return (
    <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/features' element={<Features />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/docs' element={<Docs />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/history' element={<HistoryPage />} />
        <Route path='/devices' element={<DevicesPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/saved' element={<SavedProjectsPage />} />
    </Routes>
  )
}

export default Layout