import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

export default function Home() {
  const { user } = useContext(UserDataContext);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.fullname?.firstName || "User"}!</h1>
      <p className="mb-8">You are logged in.</p>
      <a href="/logout" className="bg-black text-white px-6 py-2 rounded">Logout</a>
    </div>
  );
}
