import { Link } from "react-router-dom";
export default function Start() {
  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Welcome to Zippy Ride!</h1>
      <Link to="/login" className="bg-black text-white py-2 px-6 rounded">
        Login / Signup
      </Link>
    </div>
  );
}
