import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'

const Page = () => {
  return (
    <div className='bg-zinc-900 h-screen '>
      <Navbar />
      <Hero/>
      <Footer/>
    </div>
  )
}

export default Page