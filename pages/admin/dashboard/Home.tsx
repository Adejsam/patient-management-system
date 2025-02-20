import React from 'react'
import AdminLayout from '../../../shared/layout/AdminLayout'

const Home = () => {
  return (
    <div>Home</div>
  )
}

Home.getLayout = (page: React.ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default Home