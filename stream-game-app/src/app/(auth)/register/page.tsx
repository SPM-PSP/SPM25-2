import RegisterForm from "@/components/auth/register/RegisterForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <RegisterForm></RegisterForm>
    </div>
  );
}
