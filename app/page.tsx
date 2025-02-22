import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Welcome to the Weight Loss Tracker</h1>
        <div className="flex mt-6">
          <Link
            href="/login"
            className="mx-4 px-6 py-2 text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="mx-4 px-6 py-2 text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  )
}

