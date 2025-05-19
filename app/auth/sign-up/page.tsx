import { SignupForm } from '@/components/signup-form'
import React from 'react'

const page = () => {
  return (
      <div className='flex flex-col items-center justify-center h-full bg-background py-5 w-full'>
          <SignupForm/>
    </div>
  )
}

export default page