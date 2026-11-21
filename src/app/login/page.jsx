"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star, Lock, Mail, Eye, EyeOff } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const supabase = supabaseClient();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUserInfo = (event) => {
    const { name, value } = event.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const login = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userInfo.email,
        password: userInfo.password,
      });

      if (error) throw error;

      console.log(data);
      router.push("/");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[350px]">
        {/* Login Card */}
        <div className="bg-white border border-gray-200 px-10 pt-10 pb-6">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <img
                src="https://static.cdninstagram.com/rsrc.php/yY/r/X32GsrNzif6.webp"
                height={34}
                width={34}
              />
              <span className="text-3xl font-semibold tracking-tight">
                Instagram
              </span>
            </div>
          </div>

          <p className="text-center text-sm font-semibold text-gray-500 mb-6">
            Log in to see photos and videos from your friends.
          </p>

          {/* Login Form */}
          <form onSubmit={login} className="space-y-3">
            {/* Email */}
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <Input
                type="email"
                placeholder="Email address"
                name="email"
                value={userInfo.email}
                onChange={handleUserInfo}
                required
                className="h-11 pl-10 text-xs bg-[#fafafa] border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={userInfo.password}
                onChange={handleUserInfo}
                required
                className="h-11 pl-10 pr-12 text-xs bg-[#fafafa] border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-9 bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold rounded-lg mt-3"
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white border border-gray-200 mt-3 py-5 text-center">
          <p className="text-sm text-gray-700">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/sign-up")}
              className="font-semibold text-[#0095f6] hover:text-[#1877f2]"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            © 2026 Your App. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
