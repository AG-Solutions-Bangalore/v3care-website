import React from 'react'
import BlogRoutes from './blog.routes'
import HomeHeader from '../home/header/home-header'
import FooterSeven from '../home/home-seven/footer-seven'

const Blog = () => {
  return (
    <>
      <HomeHeader type={2} />
      <BlogRoutes />
       <FooterSeven />
    </>
  )
}

export default Blog
