import { Navbar } from '@/components/Navbar';
import React from 'react'

function layout({ children }:  Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className='h-screen bg-gradient-to-tr from-slate-50 to-violet-50'>
        <Navbar />
        {children}
    </div>
  )
}

export default layout