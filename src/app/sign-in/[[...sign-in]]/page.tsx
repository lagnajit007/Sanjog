import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f5f7fb]">
      {/* Left Image Section */}
      <div className="hidden md:flex md:w-1/2 relative m-3 rounded-lg">
        <Image
          src="/sign-img.png"
          alt="People communicating with sign language"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover rounded-lg"
          priority
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md px-6 py-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Let's level up your learning
            </h1>
            <p className="text-gray-600 text-sm">
              Start learning sign language in minutes
            </p>
          </div>

          {/* SignIn Form */}
          <div className="mb-4">
            <SignIn 
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/dashboard"
              forceRedirectUrl="/dashboard"
              appearance={{
                layout: {
                  logoPlacement: "none",
                  socialButtonsVariant: "iconButton",
                  logoImageUrl: "/sanjog-logo.svg",
                },
                variables: {
                  colorPrimary: "#704ee7",
                  colorText: "#191d23",
                  colorTextSecondary: "#64748b",
                  colorInputText: "#191d23",
                },
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 w-full",
                  header: "hidden",
                  formFieldInput: {
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    "&:focus": {
                      borderColor: "#704ee7",
                      boxShadow: "0 0 0 1px #704ee7",
                    },
                  },
                  formButtonPrimary: {
                    background: "linear-gradient(to right, #704ee7, #8667e8)",
                    "&:hover": {
                      opacity: "0.9",
                    },
                    borderRadius: "0.5rem",
                    fontWeight: "500",
                  },
                  socialButtonsBlockButton: {
                    border: "1px solid #e5e7eb",
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                    },
                  },
                  footerActionLink: {
                    color: "#704ee7",
                    "&:hover": {
                      color: "#8667e8",
                    },
                  },
                },
              }}
            />
          </div>

          {/* Footer Links */}
          <div className="text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-[#704ee7] hover:underline font-medium"
              aria-label="Sign up"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}