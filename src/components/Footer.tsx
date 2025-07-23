export default function Footer() {
  return (
    <footer className="w-full py-6 mt-16 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 bg-white dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
        <span>&copy; {new Date().getFullYear()} HR Recruitment Firm</span>
        <span className="hidden sm:inline">|</span>
        <a href="#" className="hover:text-blue-500-custom transition-colors">Contact</a>
        <span className="hidden sm:inline">|</span>
        <a href="#" className="hover:text-blue-500-custom transition-colors">Privacy Policy</a>
      </div>
    </footer>
  );
} 