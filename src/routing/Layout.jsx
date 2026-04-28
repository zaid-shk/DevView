import React from 'react'
import LandingPage from '../landing/Page'
import Dashboard from '../dashboard/Page'

import { Routes, Route } from 'react-router-dom'

const Layout = () => {
  return (
    <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  )
}

export default Layout