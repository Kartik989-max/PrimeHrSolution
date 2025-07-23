import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";

const companies = [
  { name: "Company 1", logo: "/company_logo/logo1.png" },
  { name: "Company 2", logo: "/company_logo/logo2.png" },
  { name: "Company 3", logo: "/company_logo/logo3.png" },
  { name: "Company 4", logo: "/company_logo/logo4.png" },
  { name: "Company 5", logo: "/company_logo/logo5.jpg" },
  { name: "Company 6", logo: "/company_logo/logo6.png" },
  { name: "Company 7", logo: "/company_logo/logo7.jpg" },
  { name: "Company 8", logo: "/company_logo/logo8.png" },
  { name: "Company 9", logo: "/company_logo/logo9.png" },
  { name: "Company 10", logo: "/company_logo/logo10.png" },
  { name: "Company 11", logo: "/company_logo/logo11.png" },
  { name: "Company 12", logo: "/company_logo/logo12.png" },
  { name: "Company 13", logo: "/company_logo/logo13.png" },
  { name: "Company 14", logo: "/company_logo/logo14.png" },
  { name: "Company 15", logo: "/company_logo/logo15.jpg" },
  { name: "Company 16", logo: "/company_logo/logo16.png" },
  { name: "Company 17", logo: "/company_logo/logo17.png" },
  { name: "Company 18", logo: "/company_logo/logo18.jpg" },
  // Add more as needed
];

const CompaniesSection = () => {
  return (
    <section className="w-full flex flex-col items-center py-12 bg-white">
        <h1 className="text-black tracking-wider text-3xl mb-2">The Company we Keep
        </h1>
        <p className="text-gray-700 text-base mb-4" >Trusted by 51+ companies</p>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 7 },
        }}
        loop={true}
        className="w-full max-w-6xl"
      >
        {companies.map((company, idx) => (
          <SwiperSlide key={idx} className="flex items-center justify-center">
            <div className="h-24 w-32 flex items-center justify-center  rounded  p-2">
              <Image
                width={100}
                height={100}
                src={company.logo}
                alt={company.name}
                className="object-contain max-h-full max-w-full  hover:grayscale-0 transition duration-300"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
     </section>
  );
};

export default CompaniesSection; 