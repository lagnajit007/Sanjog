import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const user = await currentUser();

  // Mock data - replace with your actual data sources
  const stats = [
    { id: 1, title: "Daily Streak", value: "7 Days", progress: 86, color: "bg-[#3acbe8]" },
    { id: 2, title: "Lessons Completed", value: "12", progress: 45, color: "bg-[#ff9160]" },
    { id: 3, title: "Points Earned", value: "1,240", progress: 32, color: "bg-[#57e371]" }
  ];

  const courses = [
    { id: 1, title: "Alphabets", subtitle: "Beginner's Guide to Learn Alphabets (A-Z)", color: "bg-[#ffe9ac]", textColor: "text-[#ff2600]", tagColor: "bg-[#e2eaff]", tagText: "ALPHABETS", value: "A-Z" },
    { id: 2, title: "Numbers", subtitle: "Beginner's Guide to Learn Numbers (0-9)", color: "bg-[#e2eaff]", textColor: "text-[#3874ff]", tagColor: "bg-[#e2eaff]", tagText: "NUMBERS", value: "0-9" },
    { id: 3, title: "Letters", subtitle: "Beginner's Guide to Learn Letters", color: "bg-[#d5cfff]", textColor: "text-[#684ad6]", tagColor: "bg-[#ebeafc]", tagText: "LETTERS", value: "A" }
  ];

  const badges = [
    { id: 1, gradient: "from-[#ff9160] to-[#ff6265]", title: "Confident", subtitle: "Reader" },
    { id: 2, gradient: "from-[#704ee7] to-[#684ad6]", title: "Fast", subtitle: "Learner" },
    { id: 3, gradient: "from-[#3874ff] to-[#684ad6]", title: "Dedicated", subtitle: "Student" }
  ];

  const leaderboard = [
    { id: 1, name: "John Doe", points: "118,487", level: 10, avatar: "/Avatar.png" },
    { id: 2, name: "Jane Smith", points: "98,245", level: 9, avatar: "/Avatar.png" },
    { id: 3, name: "Alex Johnson", points: "87,112", level: 8, avatar: "/Avatar.png" }
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* User Auth Info */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">{user?.firstName || "Guest"}</span>
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "shadow-lg"
                }
              }}
            />
          </div>
        </div>
        
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#704ee7] to-[#8667e8] rounded-3xl p-8 mb-8 text-white">
          <div className="text-sm font-medium mb-2 opacity-90">ONLINE COURSE</div>
          <h1 className="text-3xl font-bold mb-6 leading-tight">
            Learn Sign Language with Fun<br />Gestures!
          </h1>
          <Link
            href="/dashboard/lessons"
            className="bg-black text-white rounded-full px-6 py-3 flex items-center gap-2 hover:bg-opacity-90 transition-all w-fit"
            aria-label="Start Learning"
          >
            Start Learning
            <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-black" />
            </div>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.id} className={`${stat.color} rounded-2xl p-4 text-white`}>
              <div className="flex items-center mb-2">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                  <div className="text-white">🔥</div>
                </div>
                <div>
                  <div className="text-sm">{stat.title}</div>
                  <div className="text-xl font-bold">{stat.value}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{stat.progress}%</span>
                </div>
                <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full" 
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Learning Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#191d23]">Continue Learning</h2>
            <div className="flex gap-2">
              <button 
                className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Previous"
              >
                <ChevronRight className="w-4 h-4 text-[#64748b] rotate-180" />
              </button>
              <button 
                className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 text-[#64748b]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/dashboard/lessons/${course.title.toLowerCase()}`}
                className="bg-white rounded-xl overflow-hidden block hover:shadow-md transition-all duration-200"
                aria-label={`Learn ${course.title}`}
              >
                <div className={`${course.color} h-32 flex items-center justify-center`}>
                  <span className={`${course.textColor} text-4xl font-bold`}>{course.value}</span>
                </div>
                <div className="p-4">
                  <div className={`inline-block px-3 py-1 ${course.tagColor} text-[#3874ff] text-xs rounded-full mb-3`}>
                    {course.tagText}
                  </div>
                  <h3 className="font-medium text-[#191d23]">{course.subtitle}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[300px] bg-white p-6 hidden lg:block border-l border-gray-100">
        <h2 className="text-xl font-bold text-[#191d23] mb-6">Statistics</h2>

        {/* Progress Circle */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg className="w-36 h-36" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#ebeafc" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#704ee7"
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset="192"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="30" textAnchor="middle" fill="#704ee7" fontSize="12" fontWeight="bold">
                32%
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#f0c332]">
                <Image
                  src={user?.imageUrl || "/Avatar.png"}
                  alt={user?.firstName || "User avatar"}
                  width={96}
                  height={96}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[#191d23] mb-1">
            Good {getTimeOfDay()}, {user?.firstName || "Jenny"} 🔥
          </h3>
          <p className="text-sm text-[#a0abbb]">Continue your learning to achieve your target!</p>
        </div>

        {/* Badges */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-end gap-1">
              <h3 className="text-lg font-bold text-[#191d23]">Badges</h3>
              <span className="text-[#704ee7] font-bold">06</span>
              <span className="text-[#a0abbb]">/60</span>
            </div>
            <Link 
              href="/dashboard/badges" 
              className="text-[#704ee7] text-sm flex items-center hover:underline"
              aria-label="View all badges"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center">
                <div className={`bg-gradient-to-b ${badge.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-2`}>
                  <div className="text-white">🏆</div>
                </div>
                <div className="text-xs text-center">
                  <div className="font-medium text-[#191d23]">{badge.title}</div>
                  <div className="text-[#a0abbb]">{badge.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <h3 className="text-lg font-bold text-[#191d23] mb-4">Leaderboard</h3>

          <div className="space-y-4">
            {leaderboard.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={user.avatar}
                      alt={`${user.name}'s avatar`}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-[#191d23]">{user.name}</div>
                    <div className="text-xs text-[#a0abbb]">{user.points}pts</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-[#a0abbb]">Lvl {user.level}</div>
                  {index === 0 && <div className="text-[#f0c332]">👑</div>}
                </div>
              </div>
            ))}

            <div className="text-center mt-4">
              <Link 
                href="/dashboard/leaderboard" 
                className="text-[#704ee7] text-sm hover:underline"
                aria-label="View full leaderboard"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get time of day greeting
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}