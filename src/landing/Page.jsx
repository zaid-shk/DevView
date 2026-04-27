import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

const Page = () => {
  return (
    <div className='bg-zinc-900 h-screen '>
      <Navbar />
      <Hero/>
    </div>
  )
}

export default Page