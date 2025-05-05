import { SignInForm } from "@/components/SignInForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-white font-bold text-3xl mb-6">
        Login to your account
      </h1>
      <SignInForm />
    </div>
  );
}
