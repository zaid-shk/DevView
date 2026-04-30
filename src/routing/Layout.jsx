import React from 'react'
import LandingPage from '../landing/Page'
import Dashboard from '../dashboard/Page'
import HistoryPage from '../dashboard/History'
import DevicesPage from '../dashboard/Devices'
import SettingsPage from '../dashboard/Settings'
import SavedProjectsPage from '../dashboard/SavedProjects'

import { Routes, Route } from 'react-router-dom'

const Layout = () => {
  return (
    <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/history' element={<HistoryPage />} />
        <Route path='/devices' element={<DevicesPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/saved' element={<SavedProjectsPage />} />
    </Routes>
  )
}

export default Layout