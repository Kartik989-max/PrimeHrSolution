import { FaLaptopCode, FaStethoscope, FaUniversity, FaCog, FaChartLine, FaTruck, FaHotel, FaBullhorn } from "react-icons/fa";

const categories = [
  {
    icon: <FaLaptopCode size={36} className="text-blue-500" />,
    title: "IT & Software",
    color: "bg-blue-50",
  },
  {
    icon: <FaChartLine size={36} className="text-blue-500" />,
    title: "Finance & Banking",
    color: "bg-blue-50",
  },
  {
    icon: <FaStethoscope size={36} className="text-blue-500" />,
    title: "Healthcare",
    color: "bg-blue-50",
  },
  {
    icon: <FaCog size={36} className="text-blue-500" />,
    title: "Engineering",
    color: "bg-blue-50",
  },
  {
    icon: <FaBullhorn size={36} className="text-blue-500" />,
    title: "Marketing",
    color: "bg-blue-50",
  },
  {
    icon: <FaUniversity size={36} className="text-blue-500" />,
    title: "Education",
    color: "bg-blue-50",
  },
  {
    icon: <FaTruck size={36} className="text-blue-500" />,
    title: "Logistics",
    color: "bg-blue-50",
  },
  {
    icon: <FaHotel size={36} className="text-blue-500" />,
    title: "Hospitality",
    color: "bg-blue-50",
  },
];

export default function JobCategories() {
  return (
    <section className="w-full py-12 px-4 md:px-0 flex flex-col items-center">
      <h2 className="text-heading mb-2 text-center">Job Categories We Provide</h2>
      <div className="w-16 h-1 bg-blue-500-custom rounded-full mb-8 mx-auto" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl w-full">
        {categories.map((cat, idx) => (
          <div
            key={cat.title}
            className={`group flex flex-col items-center justify-center p-7 rounded-2xl shadow-md border border-blue-100 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl ${cat.color}`}
            style={{ minHeight: 180 }}
          >
            <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
              {cat.icon}
            </div>
            <h3 className="text-subheading mb-1 text-center">{cat.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
} 