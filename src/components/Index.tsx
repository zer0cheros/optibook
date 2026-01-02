import React from 'react'
import Image from 'next/image'

export default function Index() {
  return (
    <div className='flex flex-col justify-center items-center flex-1 w-full h-full'>
        <h1 className='text-5xl text-slate-900 font-sans'>Booking App</h1>
        <Image src={"/hero.png"} alt="Logo" width={500} height={600} />
    </div>
  )
}
