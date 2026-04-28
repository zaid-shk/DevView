import React from 'react'
import Navbar from '../components/Navbar'
import Control from './components/Control'
import Screens from './components/Screens'

const Page = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar /> 
      <Control/>
      <Screens/>
    </div>
  )
}

export default Page