import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'

const Page = () => {
  return (
    <div className='bg-zinc-900 min-h-screen flex flex-col'>
      <Navbar />
      <main className="flex-grow">
        <Hero/>
      </main>
      <Footer/>
    </div>
  )
}

export default Page