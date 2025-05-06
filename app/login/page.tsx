"use client";

import { SignInForm } from "@/components/SignInForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-white font-bold text-3xl mb-6">
        Login to your account
      </h1>
      <SignInForm />
      <p className="text-white mt-10 mb-2">Don&apos;t have an account yet?</p>
      <Button
        type="submit"
        className="cursor-pointer bg-white text-black hover:bg-gray-200/90 flex items-center justify-center"
        size="lg"
        onClick={() => router.push("/")}
      >
        Sign Up
      </Button>
    </div>
  );
}
