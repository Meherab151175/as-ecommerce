import { Link } from "react-router-dom";


export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-40 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg border-b border-emerald-900 transition-all duration-300">
        <div className="container mx-auto px-4 py-3">
            <Link to="/" className="text-2xl font-bold text-emerald-400 flex space-x-2 items-center">E-commerce</Link>
            <nav className="flex item-center flex-wrap gap-4"></nav>
        </div>
    </header>
  )
}
