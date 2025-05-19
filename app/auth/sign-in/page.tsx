import { LoginForm } from '@/components/login-form'
import React from 'react'

const page = () => {
  return (
      <div className='flex flex-col items-center justify-center h-full bg-background py-5 w-full'>
          <LoginForm/>
    </div>
  )
}

export default page