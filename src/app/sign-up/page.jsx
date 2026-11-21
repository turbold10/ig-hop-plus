"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/supabase";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const supabase = supabaseClient();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUserInfo = (event) => {
    const { name, value } = event.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const signup = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userInfo.email,
        password: userInfo.password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("Unable to create user.");
      }

      // Create profile
      const { error: profileError } = await supabase.from("profile").insert({
        id: data.user.id,
        username: userInfo.username,
      });

      if (profileError) throw profileError;

      toast.add({
        title: "Welcome!",
        description: "Your account has been created successfully.",
        type: "success",
      });

      router.push("/login");
    } catch (error) {
      toast.add({
        title: "Try again",
        description: error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[350px]">
        {/* Signup Card */}
        <div className="bg-white border border-gray-200 px-10 pt-10 pb-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
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

          <h2 className="text-center text-base font-bold text-gray-500 mb-2">
            Sign up to see photos and videos from your friends.
          </h2>

          <p className="text-center text-sm text-gray-400 mb-6">
            Create an account to get started.
          </p>

          {/* Signup Form */}
          <form onSubmit={signup} className="space-y-3">
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

            {/* Username */}
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <Input
                type="text"
                placeholder="Username"
                name="username"
                value={userInfo.username}
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
                minLength={6}
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

            {/* Terms */}
            <p className="text-[11px] text-gray-400 text-center leading-4 py-2">
              By signing up, you agree to our Terms, Privacy Policy and Cookies
              Policy.
            </p>

            {/* Signup Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-9 bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold rounded-lg"
            >
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-semibold text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-xs text-center text-gray-500">
            Already have an account?
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 mt-3 py-5 text-center">
          <p className="text-sm text-gray-700">
            Have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-semibold text-[#0095f6] hover:text-[#1877f2]"
            >
              Log in
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
