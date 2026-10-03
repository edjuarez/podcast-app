import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight text-[#4897CE]"
        >
          Podcaster
        </Link>
      </div>
    </header>
  )
}