import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-olive-100 via-white to-olive-200 text-olive-800 px-6 md:px-16 relative">

      {/* Left Column: Text */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-start md:items-start md:w-1/2 mb-10 md:mb-0"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-olive-900 drop-shadow-lg">
          Welcome to Global Connect
        </h1>
        <p className="text-lg md:text-xl mb-8 text-olive-700 max-w-md">
          A place to connect, share, and learn with people around the world.
        </p>

        {/* Buttons */}
        <div className="flex gap-6 flex-wrap">
          <a
            href="/login"
            className="px-8 py-3 bg-olive-600 text-white font-semibold rounded-xl shadow-lg hover:bg-olive-700 hover:scale-105 transform transition duration-300"
          >
            Login
          </a>
          <a
            href="/signup"
            className="px-8 py-3 bg-white text-olive-700 border border-olive-300 font-semibold rounded-xl shadow-lg hover:bg-olive-100 hover:scale-105 transform transition duration-300"
          >
            Sign Up
          </a>
        </div>
      </motion.div>

      {/* Right Column: Image */}
      

      {/* Decorative floating circles */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-olive-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-olive-300 rounded-full opacity-20 animate-pulse"></div>
    </div>
  );
}
