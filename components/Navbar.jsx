import React, { useRef } from 'react'
import Image from 'next/image'
import LoadingBar from 'react-top-loading-bar'


const Navbar = () => {
    const ref = useRef(null);

    return (
        <div>
            <LoadingBar color='#f11946' ref={ref} height="4px" />
            <header className="text-white body-font bg-blue-500">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                        <Image src={"/Nakul_logo.png"} alt="Tution classNamees Logo" width={70} height={70}></Image>
                        <span className="ml-5"><Image src={"/name_logo.png"} alt="Kumar Nakul Tution classNamees" width={100} height={100}></Image>
                        </span>
                    </a>
                    <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-white	flex flex-wrap items-center text-base justify-center">
                        <a href="/" onClick={() => ref.current.complete()} className="mr-5 hover:text-yellow-300 cursor-pointer">Home</a>
                        <a href="/admin/adminPortal/adminaccess" onClick={() => ref.current.complete()} className="mr-5 hover:text-yellow-300 cursor-pointer">Admin</a>
                        <a href="/student/login" onClick={() => ref.current.complete()}  className="mr-5 hover:text-yellow-300 cursor-pointer">Student</a>
                        <a href="/material/studyMaterial" onClick={() => ref.current.complete()} className="mr-5 hover:text-yellow-300 cursor-pointer">Study-Material</a>
                        <a href="/aboutUs" onClick={() => ref.current.complete()} className="mr-5 hover:text-yellow-300 cursor-pointer">About us</a>
                        <a href="/contactUs" onClick={() => ref.current.complete()} className="mr-5 hover:text-yellow-300 cursor-pointer">Contact Us</a>
                    </nav>
                </div>
            </header>
        </div>
    )
}

export default Navbar