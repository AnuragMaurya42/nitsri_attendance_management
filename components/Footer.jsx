import React,{useRef} from 'react'
import Image from 'next/image'
import LoadingBar from 'react-top-loading-bar'


const Footer = () => {
  const ref=useRef(null)

  return (
    <div>
       <LoadingBar color='#f11946' ref={ref} height="4px"/>
        <footer className="text-white body-font border-2 border-gray-500 bg-blue-500 mb-0">
        <div className="container px-5 mt-10 mx-auto">
    <div className="text-center mb-20">
    <Image src={"/name_logo.png"} alt="Kumar Nakul Tution" className="mx-auto" width={100} height={100}></Image>
          <p className="font-semibold text-3xl leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto"><u>Maths Classes By Nakul Sir</u></p>
    </div></div>
  <div className="container pb-12">
    <div className="flex flex-wrap justify-center text-center">
      <div className="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3"><u>HOME</u></h2>
        <nav className="list-none mb-10">
          <li>
            <a onClick={()=>ref.current.complete()} href="/student/login" className="text-white hover:text-yellow-300 cursor-pointer">Student</a>
          </li>
          <li>
            <a onClick={()=>ref.current.complete()} href="/admin/adminPortal/adminaccess" className="text-white hover:text-yellow-300 cursor-pointer">Admin</a>
          </li>
          <li>
            <a onClick={()=>ref.current.complete()} href="/aboutUs" className="text-white hover:text-yellow-300 cursor-pointer">About Us</a>
          </li>
          <li>
            <a onClick={()=>ref.current.complete()} href="/contactUs" className="text-white hover:text-yellow-300 cursor-pointer">Contact Us</a>
          </li>
        </nav>
      </div>
      <div className="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3"><u>STUDENT</u></h2>
        <nav className="list-none mb-10">
          <li>
            <a onClick={()=>ref.current.complete()} href="/student/login" className="text-white hover:text-yellow-300 cursor-pointer">Login</a>
          </li>
          <li>
            <a onClick={()=>ref.current.complete()} href="/student/signup" className="text-white hover:text-yellow-300 cursor-pointer">Create Account</a>
          </li>
          <li>
            <a  onClick={()=>ref.current.complete()} href="/student/portal/myportal" className="text-white hover:text-yellow-300 cursor-pointer">Student Portal</a>
          </li>
          <li>
            <a onClick={()=>ref.current.complete()} href="/student/forgot" className="text-white hover:text-yellow-300 cursor-pointer">Forgot Password</a>
          </li>
        </nav>
      </div>
      <div className="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3"><u>ADMIN</u></h2>
        <nav className="list-none mb-10">
          <li>
            <a onClick={()=>ref.current.complete()} href="/admin/adminlogin" className="text-white hover:text-yellow-300 cursor-pointer">Login</a>
          </li>
          <li>
            <a onClick={()=>ref.current.complete()} href="/admin/adminPortal/adminaccess" className="text-white hover:text-yellow-300 cursor-pointer">Admin Portal</a>
          </li>
          <li>
            <a onClick={()=>ref.current.complete()} href="/material/studyMaterial" className="text-white hover:text-yellow-300 cursor-pointer">Study Material</a>
          </li>
          <li>
            <a onClick={()=>ref.current.complete()} href="/" className="text-white hover:text-yellow-300 cursor-pointer">Announcements</a>
          </li>
        </nav>
      </div>
    </div>
  </div>
  <div>
    <div className="container mx-auto py-4 px-5 border-t-2 flex flex-wrap flex-col sm:flex-row">
      <p className="text-white text-sm text-center sm:text-left">© 2024 Maths Classes By Nakul Sir —
        <a onClick={()=>ref.current.complete()} href="https://twitter.com/knyttneve" className="text-white ml-1" target="_blank" rel="noopener noreferrer">@Tution Classes</a>
      </p>
      <span className="inline-flex lg:ml-auto lg:mt-0 mt-6 w-full justify-center md:justify-start md:w-auto">
        <a onClick={()=>ref.current.complete()} className="text-white">
          <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
          </svg>
        </a>
        <a  onClick={()=>ref.current.complete()} className="ml-3 text-white">
          <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
          </svg>
        </a>
        <a onClick={()=>ref.current.complete()} className="ml-3 text-white" href="https://www.instagram.com/maths_classes_by_nakul_sir/">
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
          </svg>
        </a>
        <a onClick={()=>ref.current.complete()} className="ml-3 text-white">
          <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
            <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
            <circle cx="4" cy="4" r="2" stroke="none"></circle>
          </svg>
        </a>
      </span></div>
  </div>
</footer>
    </div>
  )
}

export default Footer