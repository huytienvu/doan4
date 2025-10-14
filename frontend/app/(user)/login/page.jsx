"use client";
import { apilogin } from "@/services/login";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router =useRouter();
  const handleLogin = async () => {
    const obj = {
      username: username,
      password: password
    }
    const res = await apilogin(obj)
    if (res?.token) {

      localStorage.setItem("token", res.token);
      const role = res.user.role;
      // lưu token
      if (role == "Admin") {
        alert("Đăng nhập thành công admin!");

        router.push("/admin/movie");
      }
      if (role == "User") {
        alert("Đăng nhập thành công user!");
        router.push("/");
      }
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
    
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
          <h2 className="text-2xl font-bold mt-3 text-yellow-400">
            Đăng Nhập
          </h2>
        </div>

        {/* Form */}
        <form className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Tài khoản</label>
            <input
              type="text"
              value={username}
              className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Nhập tài khoản..."
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Mật khẩu</label>
            <input
              type="password"
              value={password}
              className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Nhập mật khẩu..."
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </div>

          <button
            type="button"
            className="w-full py-2 rounded-md bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition"
            onClick={handleLogin}
          >
            Đăng nhập
          </button>
        </form>

        {/* Link phụ */}
        <div className="flex justify-between mt-4 text-sm text-gray-400">
          <a href="#" className="hover:text-yellow-400">
            Quên mật khẩu?
          </a>
          <a href="/register" className="hover:text-yellow-400">
            Đăng ký tài khoản
          </a>
        </div>
      </div>
    </div>
  );
}
