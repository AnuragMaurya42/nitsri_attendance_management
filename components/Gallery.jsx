import React from 'react'

const Gallery = () => {
  return (
    <div>
    <section className="text-gray-800 body-font">
  <div className="container px-5 py-24 mx-auto flex flex-wrap">
    <div className="lg:w-2/3 mx-auto">
      <div className="flex flex-wrap w-full bg-gray-100 py-32 px-10 relative mb-4">
        <img alt="gallery" className="w-full object-cover h-full object-center block opacity-45 absolute inset-0" src={"./Teacher.png"}/>
        <div className="text-center relative z-10 w-full">
          <h2 className="text-2xl text-gray-900 font-bold title-font mb-2">Let's excel together!</h2>
          <p className="leading-relaxed font-semibold">Join Maths Classes By Nakul Sir </p>
          <a href='/aboutUs' className="mt-3 text-blue-800 font-semibold inline-flex items-center">Read More
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
      <div className="flex flex-wrap -mx-2">
        <div className="px-2 w-1/2">
          <div className="flex flex-wrap w-full bg-gray-100 sm:py-24 py-16 sm:px-10 px-6 relative">
            <img alt="gallery" className="w-full object-cover h-full object-center block opacity-45 absolute inset-0" src={"./Teacher2.png"}/>
            <div className="text-center relative z-10 w-full">
              <h2 className="text-xl text-gray-900 font-bold title-font mb-2">Ignite your passion</h2>
              <p className="leading-relaxed font-semibold">Let's make learning fun!</p>
            </div>
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="flex flex-wrap w-full bg-gray-100 sm:py-24 py-16 sm:px-10 px-6 relative">
            <img alt="gallery" className="w-full object-cover h-full object-center block opacity-45 absolute inset-0" src={"./Teacher3.png"}/>
            <div className="text-center relative z-10 w-full">
              <h2 className="text-xl text-gray-900 font-bold title-font mb-2">Unleash your genius</h2>
              <p className="leading-relaxed font-semibold"> Join us for an enriching educational experience!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  )
}

export default Gallery