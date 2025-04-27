'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import Loader from '@/components/Loader';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const people = [
    {
      id: 1,
      name: "Sarah Johnson",
      designation: "Educator",
      image: "/avatar.png",
    },
    {
      id: 2,
      name: "Michael Chen",
      designation: "Developer",
      image: "/avatar.png",
    },
    {
      id: 3,
      name: "Emma Wilson",
      designation: "Student",
      image: "/avatar.png",
    },
    {
      id: 4,
      name: "David Kim",
      designation: "Parent",
      image: "/avatar.png",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simulating a 3-second load time
    return () => clearTimeout(timer);
  }, []);

  return (
    <ClerkProvider>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fff' }}>
          <Loader />
        </div>
      ) : (
        <div className="min-h-screen bg-white">
          {/* Header */}
          <header className="py-4 px-6 flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <Image src="/sanjog-logo.svg" alt="Sanjog Logo" width={120} height={40} className="object-contain" />
            </div>
            <div className="flex items-center gap-3">
              <SignedOut>
                <SignInButton>
                  <button className="px-4 py-2 text-[#704ee7] border border-[#704ee7] rounded-full hover:bg-[#f8f7fe] transition-colors">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#704ee7] to-[#8667e8] text-white rounded-full hover:opacity-90 transition-opacity">
                    Sign up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          {/* Hero Section */}
          <section className="py-16 px-6 md:py-20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-[#191d23] mb-6">
                  The best place to <span className="text-[#704ee7]">learn</span> <br />
                  and <span className="text-[#f0c332]">play</span> for all
                </h1>
                <p className="text-[#64748b] mb-8 max-w-xl mx-auto">
                  Discover thousands of fun and interactive learning activities to support learning progress
                </p>
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="flex flex-row items-center justify-center w-full">
                    <AnimatedTooltip items={people} />
                    <span className="text-[#64748b] text-sm ml-2">+1,000 more</span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-2">Join our community of learners</p>
                </div>
                <SignInButton>
                  <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#704ee7] to-[#8667e8] text-white rounded-full hover:opacity-90 transition-opacity">
                    Get started
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2"
                    >
                      <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor" />
                    </svg>
                  </button>
                </SignInButton>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="transform rotate-[-3deg]">
                  <div className="rounded-3xl overflow-hidden shadow-lg aspect-square">
                    <Image
                      src="/sign-img.png"
                      alt="Learning at home"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="transform translate-y-4">
                  <div className="rounded-3xl overflow-hidden shadow-lg aspect-square">
                    <Image
                      src="/mudra.jpg"
                      alt="Learning together"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="transform rotate-[3deg]">
                  <div className="rounded-3xl overflow-hidden shadow-lg aspect-square">
                    <Image
                      src="/sign-img.png"
                      alt="Learning in class"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 px-6 bg-[#f5f7fb]">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#191d23] flex items-center">
                  Our <span className="text-[#704ee7] ml-2">Interactive</span> Features
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#ffecf0] p-6 rounded-xl">
                  <div className="mb-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xl">🎮</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#191d23] mb-2">Fun Games</h3>
                  <p className="text-[#64748b] text-sm mb-4">
                    Enjoy a variety of interactive games designed to make learning sign language fun and engaging.
                  </p>
                  <div className="text-xs text-[#64748b]">Fun and interactive</div>
                </div>
                <div className="bg-[#704ee7] p-6 rounded-xl text-white">
                  <div className="mb-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xl">🧠</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Cognitive Practicing</h3>
                  <p className="text-sm mb-4 text-white/90">
                    Scientifically designed exercises to help you memorize and recall sign language gestures effectively.
                  </p>
                  <div className="text-xs text-white/80">Improve memory and recall</div>
                </div>
                <div className="bg-[#f0c332] p-6 rounded-xl">
                  <div className="mb-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xl">👥</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#191d23] mb-2">Learn with Friends</h3>
                  <p className="text-[#64748b] text-sm mb-4">
                    Invite friends to join you on your learning journey and practice together in real-time.
                  </p>
                  <div className="text-xs text-[#64748b]">Social learning experience</div>
                </div>
              </div>
              <div className="text-center mt-8">
                <Link href="/features" className="text-[#704ee7] text-sm hover:underline">
                  See the features
                </Link>
              </div>
            </div>
          </section>

          {/* Community Section */}
          <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-[#191d23] mb-6">Join a Thriving Learning Community</h2>
              <p className="text-[#64748b] mb-12 max-w-2xl mx-auto">
                Learn alongside thousands of students from around the world who are mastering sign language with Sanjog
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#704ee7] rounded-full flex items-center justify-center mb-3">
                    <span className="text-white font-bold">3.5M+</span>
                  </div>
                  <div className="text-sm text-[#64748b]">Registered Learners</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#704ee7] rounded-full flex items-center justify-center mb-3">
                    <span className="text-white font-bold">5k+</span>
                  </div>
                  <div className="text-sm text-[#64748b]">Practice Activities</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#704ee7] rounded-full flex items-center justify-center mb-3">
                    <span className="text-white font-bold">800+</span>
                  </div>
                  <div className="text-sm text-[#64748b]">Expert Mentors</div>
                </div>
              </div>
              <Link
                href="/sign-up"
                className="px-8 py-3 bg-gradient-to-r from-[#704ee7] to-[#8667e8] text-white rounded-full hover:opacity-90 transition-opacity inline-block"
              >
                Join Our Community
              </Link>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-16 px-6 bg-[#f5f7fb]">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#191d23]">
                  The <span className="text-[#704ee7]">process</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-10 h-10 bg-[#f0f0f0] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                          stroke="#333"
                          strokeWidth="2"
                        />
                        <path d="M7 7H17M7 12H17M7 17H13" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-[#191d23] mb-1">Large dataset of sign language</h3>
                      <p className="text-sm text-[#64748b]">
                        Our platform is built on a comprehensive dataset of sign language gestures from around the world.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-10 h-10 bg-[#f0f0f0] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 2L2 7L12 12L22 7L12 2Z"
                          stroke="#333"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 17L12 22L22 17"
                          stroke="#333"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 12L12 17L22 12"
                          stroke="#333"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-[#191d23] mb-1">AI-powered blending</h3>
                      <p className="text-sm text-[#64748b]">
                        Our advanced AI algorithms blend multiple recognition techniques for accurate gesture detection.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-10 h-10 bg-[#f0f0f0] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="#333"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 7V12L15 15"
                          stroke="#333"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-[#191d23] mb-1">24/7 chatbot support</h3>
                      <p className="text-sm text-[#64748b]">
                        Get help anytime with our intelligent chatbot that can answer questions and provide guidance.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-10 h-10 bg-[#f0f0f0] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 8V12L15 15"
                          stroke="#333"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19.4 15C20.2 13.5 20.2 11.5 19.4 10C18.6 8.5 17.1 7.6 15.5 7.5C14.5 5.8 12.8 5 11 5C8.2 5 6 7.2 6 10C6 10.3 6 10.7 6.1 11C4.8 11.2 3.8 12 3.3 13C2.8 14 2.8 15.2 3.3 16.2C3.8 17.2 4.8 18 6.1 18.2H16.6C17.7 18.1 18.8 17.4 19.4 16.2"
                          stroke="#333"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-[#191d23] mb-1">Real time learning</h3>
                      <p className="text-sm text-[#64748b]">
                        Get instant feedback on your sign language gestures to improve your skills faster.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#e8eaf6] p-4 rounded-xl">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md">
                    <Image
                      src="/hero-img.png"
                      alt="Sanjog App Interface Demo"
                      width={500}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#f5f7fb] py-8 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Image src="/sanjog-logo.svg" alt="Sanjog Logo" width={120} height={32} className="object-contain" />
                </div>
                <p className="text-[#64748b]">Learn sign language with AI-powered gesture recognition.</p>
              </div>
              <div>
                <h3 className="font-bold text-[#191d23] mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/features" className="text-[#64748b] hover:text-[#704ee7]">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-[#64748b] hover:text-[#704ee7]">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/testimonials" className="text-[#64748b] hover:text-[#704ee7]">
                      Testimonials
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#191d23] mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-[#64748b] hover:text-[#704ee7]">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-[#64748b] hover:text-[#704ee7]">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-[#64748b] hover:text-[#704ee7]">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#191d23] mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className="text-[#64748b] hover:text-[#704ee7]">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-[#64748b] hover:text-[#704ee7]">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-200">
              <p className="text-[#64748b] text-center">© {new Date().getFullYear()} Sanjog. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )}
    </ClerkProvider>
  );
}