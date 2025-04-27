"use client";
import React, { useCallback, useState } from "react";
import { Input } from "../../../ui/Input";
import { Button } from "../../../ui/Button";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { axiosInstance } from "../../../config";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "motion/react";

function page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const onSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      const result = await axiosInstance.post("/signup", form);

      if (result.data.success) {
        router.push("/signin");
        setForm({ username: "", email: "", password: "" });
      } else {
        console.error("Login failed:", result.data.message);
        alert(result.data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        alert(
          error.response?.data?.message || "Network error. Please try again."
        );
      } else {
        console.error("Unexpected error:", error);
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [form, router]);
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#f7f9fb] to-[#e0e7ef]">
      <motion.div
        initial={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-xl p-10 shadow-2xl"
      >
        <div className="flex flex-col justify-center items-center gap-1 text-black">
          <h1 className={twMerge("text-2xl font-semibold text-gray-900")}>
            Sign up to your account
          </h1>
          <p className="text-black/90">
            Or{" "}
            <span className={twMerge("text-sm text-primary")}>
              <Link href="/signin"> sign in to existing account</Link>
            </span>
          </p>
        </div>
        <div className="flex flex-col justify-center items-center gap-8 mt-6">
          <Input
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="text"
            placeholder="Username"
            className="p-1 rounded-lg bg-white shadow-md"
          />
          <Input
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="email"
            placeholder="Email"
            className="p-1 rounded-lg bg-white shadow-md"
          />
          <Input
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password"
            placeholder="Password"
            className="p-1 rounded-lg bg-white shadow-md"
          />
          <Button
            disabled={isSubmitting}
            onClick={onSubmit}
            size="lg"
            variant="primary"
            className="w-full px-4 text-lg rounded-full mt-4"
          >
            Sign up
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default page;
