import React from 'react'
import Image from 'next/image'

export default function Index() {
  return (
    <div className='flex flex-col justify-center items-center flex-1 w-full h-full gap-6 py-8'>
        <h1 className='text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-900 via-stone-800 to-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-700'>
          Booking App
        </h1>
        <p className='text-lg text-stone-600 max-w-md text-center animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150'>
          Welcome to your modern booking solution
        </p>
        <div className='relative animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300'>
          <div className='absolute inset-0 bg-linear-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl'></div>
          <Image
            src={"/hero.png"}
            alt="Logo"
            width={500}
            height={600}
            className='relative rounded-2xl shadow-2xl border border-stone-200/50 transition-transform duration-300 hover:scale-105'
          />
        </div>
    </div>
  )
}
