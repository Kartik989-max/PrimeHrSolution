"use client";
import { FaCar, FaBoxOpen, FaIndustry, FaLaptop, FaAppleAlt, FaHospital, FaPlane, FaBolt } from "react-icons/fa";
import { motion } from "framer-motion";

const industries = [
  {
    icon: <FaCar size={40} className="text-[#1a174d] mb-4" />,
    title: "Automobile",
    description: "The automotive industry shapes global progress through electrification, autonomy, and sustainability, driving innovation and mobility.",
  },
  {
    icon: <FaBoxOpen size={40} className="text-[#1a174d] mb-4" />,
    title: "FMCG",
    description: "The FMCG (Fast-Moving Consumer Goods) industry produces everyday products, groceries, and household items, sustaining modern lifestyles and global consumer demand.",
  },
  {
    icon: <FaLaptop size={40} className="text-[#1a174d] mb-4" />,
    title: "IT industry",
    description: "The IT industry revolutionizes connectivity, software, and hardware, powering the digital world.",
  },
  {
    icon: <FaIndustry size={40} className="text-[#1a174d] mb-4" />,
    title: "Manufacturing",
    description: "The manufacturing industry crafts products, from consumer goods to industrial equipment, driving economic growth.",
  },
  {
    icon: <FaAppleAlt size={40} className="text-[#1a174d] mb-4" />,
    title: "Agriculture",
    description: "Agriculture sustains the world by producing food, raw materials, and supporting rural economies.",
  },
  {
    icon: <FaHospital size={40} className="text-[#1a174d] mb-4" />,
    title: "Healthcare",
    description: "Healthcare advances well-being through medical innovation, patient care, and public health initiatives.",
  },
  {
    icon: <FaPlane size={40} className="text-[#1a174d] mb-4" />,
    title: "Aerospace",
    description: "Aerospace propels exploration, travel, and technology, connecting the world and beyond.",
  },
  {
    icon: <FaBolt size={40} className="text-[#1a174d] mb-4" />,
    title: "Energy",
    description: "The energy sector powers progress, from renewables to traditional sources, fueling industries and daily life.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function IndustriesSlider() {
  return (
    <section className="py-8 sm:py-10 px-4 sm:px-6 md:px-2">
      <div className="md:max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-6 sm:gap-8">
        {/* Left: Title and Description */}
        <div className="w-full md:w-1/3 mb-6 sm:mb-8 md:mb-0 flex flex-col justify-center text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-2">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-black flex items-center">
              <svg width="80" height="20" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 sm:mr-3">
                <line x1="2" y1="14" x2="110" y2="14" stroke="#ee7822" strokeWidth="3" strokeLinecap="round" />
                <polyline points="100,7 110,14 100,21" fill="none" stroke="#ee7822" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Industries
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1831] mb-3 sm:mb-4 md:mb-6 leading-tight">
            Discover Our <br className="hidden sm:block" /> Industries
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#222] mb-4 sm:mb-6 md:mb-8">
            We are offering the following informations about us that circular that what we actually
          </p>
        
         {/* <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 sm:px-10 py-3 rounded-2xl transition w-full sm:w-48 text-base sm:text-lg">Explore All</button> */}
        </div>
        {/* Right: 2x2 Grid of Cards with vertical scroll */}
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-8 md:max-h-[420px] max-h-auto sm:overflow-y-auto pr-2 hide-scrollbar rounded-2xl">
          {industries.map((industry, idx) => (
            <motion.div
              key={idx}
              className="rounded bg-white p-4 sm:p-6 md:p-8 flex flex-col justify-start items-start min-h-[160px] sm:min-h-[180px] md:min-h-[220px] shadow transition-all duration-300 group hover:shadow-lg hover:-translate-y-1"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <span className="mb-3 sm:mb-4 group-hover:text-orange-500 transition-colors duration-300">{industry.icon}</span>
              <h3 className="text-base sm:text-lg md:text-2xl font-semibold text-black mb-2">{industry.title}</h3>
              <p className="text-xs sm:text-sm md:text-base text-black">{industry.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
} 