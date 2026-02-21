"use client";

import { clearToken } from "@/redux/api/slice/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter()

  const handleLogout = () => {
    dispatch(clearToken());
    router.push("/login")
  };

  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white"
    >
      Logout
    </button>
  );
}
