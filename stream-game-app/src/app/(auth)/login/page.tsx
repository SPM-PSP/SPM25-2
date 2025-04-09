import LoginForm from "@/components/auth/login/LoginForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoginForm></LoginForm>
    </div>
  );
}
