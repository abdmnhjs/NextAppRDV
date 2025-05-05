"use client";

import { SignUpForm } from "@/components/SignUpForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-white font-bold text-3xl mb-6">Create an account</h1>
      <SignUpForm />
      <p className="text-white mt-10 mb-2">Already have an account ?</p>
      <Button
        type="submit"
        className="cursor-pointer bg-white text-black hover:bg-gray-200/90 flex items-center justify-center"
        size="lg"
        onClick={() => router.push("/login")}
      >
        Sign In
      </Button>
    </div>
  );
}
