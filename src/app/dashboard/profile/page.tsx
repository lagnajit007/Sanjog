"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Calendar,
  Clock,
  Edit,
  Award,
  Settings,
  BarChart3,
  Lock,
  Bell,
  MessageSquare,
  LogOut,
  Camera,
  BadgeCheck,
  ShieldCheck,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Crown,
  Star,
  Sparkles,
} from "lucide-react"
import Sidebar from "@/components/sidebar"

// Avatar data with unlocking thresholds
const avatars = [
  {
    id: 1,
    name: "Default",
    image: "/Avatar.png",
    unlocked: true,
    default: true,
    unlockCriteria: "Default avatar",
  },
  {
    id: 2,
    name: "Beginner",
    image: "/Avatar_b.png",
    unlocked: true,
    default: false,
    unlockCriteria: "Complete 5 lessons",
  },
  {
    id: 3,
    name: "Enthusiast",
    image: "/Avatar_b.png",
    unlocked: true,
    default: false,
    unlockCriteria: "Reach Level 5",
  },
  {
    id: 4,
    name: "Explorer",
    image: "/Avatar_b.png",
    unlocked: false,
    default: false,
    unlockCriteria: "Complete 20 lessons",
    requiredLevel: 8,
  },
  {
    id: 5,
    name: "Champion",
    image: "/placeholder.svg?height=100&width=100&text=5",
    unlocked: false,
    default: false,
    unlockCriteria: "Earn 10 badges",
    requiredLevel: 10,
  },
  {
    id: 6,
    name: "Master",
    image: "/Avatar_b.png",
    unlocked: false,
    default: false,
    unlockCriteria: "Maintain a 30-day streak",
    requiredLevel: 15,
  },
  {
    id: 7,
    name: "Legend",
    image: "/Avatar_b.png",
    unlocked: false,
    default: false,
    unlockCriteria: "Complete all alphabet and number lessons",
    requiredLevel: 20,
  },
  {
    id: 8,
    name: "Guru",
    image: "/Avatar_b.png",
    unlocked: false,
    default: false,
    unlockCriteria: "Achieve 95% accuracy across all lessons",
    requiredLevel: 25,
  },
]

export default function ProfilePage() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedAvatar, setSelectedAvatar] = useState(1)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [avatarPage, setAvatarPage] = useState(0)
  const avatarsPerPage = 4

  // User data
  const userData = {
    name: "Jenny Wilson",
    email: "jenny.wilson@example.com",
    level: 10,
    xp: 4328,
    nextLevelXp: 5000,
    joinedDate: "March 15, 2023",
    streakDays: 7,
    totalLessonsCompleted: 39,
    accuracy: "87%",
    timeSpent: "24h 45m",
    bio: "Learning sign language to communicate better with my cousin who is deaf. I'm enjoying the journey and the Sanjog platform has been really helpful!",
    socialLinks: {
      twitter: "jennyW",
      instagram: "jenny.wilson",
      linkedin: "jennyWilson",
    },
    achievements: [
      {
        id: 1,
        name: "First Step",
        icon: "🚀",
        color: "from-[#ff9160] to-[#ff6265]",
        date: "Mar 15, 2023",
      },
      {
        id: 2,
        name: "Quick Learner",
        icon: "⚡",
        color: "from-[#704ee7] to-[#684ad6]",
        date: "Mar 17, 2023",
      },
      {
        id: 3,
        name: "Alphabet Master",
        icon: "🔤",
        color: "from-[#3874ff] to-[#684ad6]",
        date: "Mar 25, 2023",
      },
      {
        id: 5,
        name: "Week Warrior",
        icon: "🔥",
        color: "from-[#f0c332] to-[#ff9160]",
        date: "Apr 1, 2023",
      },
      {
        id: 9,
        name: "Early Bird",
        icon: "🌅",
        color: "from-[#ff9160] to-[#ff6265]",
        date: "Mar 20, 2023",
      },
      {
        id: 10,
        name: "Night Owl",
        icon: "🌙",
        color: "from-[#704ee7] to-[#684ad6]",
        date: "Mar 22, 2023",
      },
    ],
    recentLessons: [
      {
        id: 1,
        name: "Letter K",
        category: "Alphabets",
        date: "Today",
        accuracy: "95%",
        icon: "🔤",
        iconBg: "bg-[#ffe9ac]",
        iconColor: "text-[#ff2600]",
      },
      {
        id: 2,
        name: "Numbers 1-5",
        category: "Numbers",
        date: "Yesterday",
        accuracy: "90%",
        icon: "🔢",
        iconBg: "bg-[#e2eaff]",
        iconColor: "text-[#3874ff]",
      },
      {
        id: 3,
        name: "Common Greetings",
        category: "Phrases",
        date: "2 days ago",
        accuracy: "85%",
        icon: "👋",
        iconBg: "bg-[#d5cfff]",
        iconColor: "text-[#684ad6]",
      },
    ],
    certificates: [
      {
        id: 1,
        name: "ASL Alphabet Mastery",
        issueDate: "April 5, 2023",
        image: "/placeholder.svg?height=100&width=200",
      },
      {
        id: 2,
        name: "Sign Language Basics",
        issueDate: "March 30, 2023",
        image: "/placeholder.svg?height=100&width=200",
      },
    ],
    progressStats: [
      { label: "Alphabets", completed: 14, total: 26, color: "bg-[#704ee7]" },
      { label: "Numbers", completed: 8, total: 10, color: "bg-[#3874ff]" },
      { label: "Common Words", completed: 12, total: 50, color: "bg-[#57e371]" },
      { label: "Phrases", completed: 5, total: 30, color: "bg-[#ff9160]" },
    ],
  }

  // Calculate total pages for avatar pagination
  const totalAvatarPages = Math.ceil(avatars.length / avatarsPerPage)

  // Get current page avatars
  const currentAvatars = avatars.slice(avatarPage * avatarsPerPage, (avatarPage + 1) * avatarsPerPage)

  // Handle avatar page navigation
  const nextAvatarPage = () => {
    if (avatarPage < totalAvatarPages - 1) {
      setAvatarPage(avatarPage + 1)
    }
  }

  const prevAvatarPage = () => {
    if (avatarPage > 0) {
      setAvatarPage(avatarPage - 1)
    }
  }

  // Handle avatar selection
  const handleAvatarSelect = (id: number) => {
    const avatar = avatars.find((a) => a.id === id)
    if (avatar && avatar.unlocked) {
      setSelectedAvatar(id)
    }
  }

  // Close modal when avatar is selected
  useEffect(() => {
    if (showAvatarModal) {
      // Keep modal open
    } else {
      // Reset to first page when modal is closed
      setAvatarPage(0)
    }
  }, [showAvatarModal])

  const handleSignOut = () => {
    signOut(() => router.push("/"));
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <div
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#f0c332] cursor-pointer"
                onClick={() => setShowAvatarModal(true)}
              >
                <Image
                  src={avatars.find((a) => a.id === selectedAvatar)?.image || "/placeholder.svg?height=96&width=96"}
                  alt="User Avatar"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#f0c332] rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-xs">{userData.level}</span>
              </div>
              <button
                className="absolute bottom-0 right-0 bg-[#704ee7] rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-[#684ad6]"
                onClick={() => setShowAvatarModal(true)}
                aria-label="Change avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#191d23] mb-1">{userData.name}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-[#64748b]">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {userData.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {userData.joinedDate}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-[#704ee7] text-white rounded-lg hover:bg-[#684ad6] text-sm">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button className="flex items-center justify-center w-9 h-9 bg-[#f5f7fb] rounded-lg hover:bg-gray-200">
                    <Settings className="w-5 h-5 text-[#64748b]" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#a0abbb]">Level Progress</span>
                  <span className="text-[#704ee7] font-medium">
                    {userData.xp}/{userData.nextLevelXp} XP ({Math.round((userData.xp / userData.nextLevelXp) * 100)}%)
                  </span>
                </div>
                <div className="h-2 bg-[#f5f7fb] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#704ee7] rounded-full"
                    style={{ width: `${(userData.xp / userData.nextLevelXp) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#f0c332] bg-opacity-20 flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-[#f0c332]" />
              </div>
              <div>
                <div className="text-sm text-[#64748b]">Streak</div>
                <div className="text-lg font-bold text-[#191d23]">{userData.streakDays} days</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#57e371] bg-opacity-20 flex items-center justify-center mr-3">
                <Award className="w-5 h-5 text-[#57e371]" />
              </div>
              <div>
                <div className="text-sm text-[#64748b]">Lessons</div>
                <div className="text-lg font-bold text-[#191d23]">{userData.totalLessonsCompleted}</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#3874ff] bg-opacity-20 flex items-center justify-center mr-3">
                <BarChart3 className="w-5 h-5 text-[#3874ff]" />
              </div>
              <div>
                <div className="text-sm text-[#64748b]">Accuracy</div>
                <div className="text-lg font-bold text-[#191d23]">{userData.accuracy}</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#ff9160] bg-opacity-20 flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-[#ff9160]" />
              </div>
              <div>
                <div className="text-sm text-[#64748b]">Time Spent</div>
                <div className="text-lg font-bold text-[#191d23]">{userData.timeSpent}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="bg-white rounded-t-xl p-1 flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg ${
              activeTab === "overview" ? "bg-[#e3dbfe] text-[#704ee7]" : "text-[#64748b] hover:bg-gray-100"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg ${
              activeTab === "achievements" ? "bg-[#e3dbfe] text-[#704ee7]" : "text-[#64748b] hover:bg-gray-100"
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab("avatars")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg ${
              activeTab === "avatars" ? "bg-[#e3dbfe] text-[#704ee7]" : "text-[#64748b] hover:bg-gray-100"
            }`}
          >
            Avatars
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg ${
              activeTab === "progress" ? "bg-[#e3dbfe] text-[#704ee7]" : "text-[#64748b] hover:bg-gray-100"
            }`}
          >
            Progress
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg ${
              activeTab === "settings" ? "bg-[#e3dbfe] text-[#704ee7]" : "text-[#64748b] hover:bg-gray-100"
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              {/* Bio Section */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-[#191d23] mb-4">About Me</h2>
                <p className="text-[#64748b]">{userData.bio}</p>
              </div>

              {/* Achievements Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#191d23]">Achievements</h2>
                  <button
                    onClick={() => setActiveTab("achievements")}
                    className="text-[#704ee7] text-sm flex items-center"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {userData.achievements.slice(0, 6).map((achievement) => (
                    <div key={achievement.id} className="flex flex-col items-center">
                      <div
                        className={`bg-gradient-to-b ${achievement.color} w-16 h-16 rounded-xl flex items-center justify-center mb-2`}
                      >
                        <div className="text-white text-xl">{achievement.icon}</div>
                      </div>
                      <div className="text-xs text-center">
                        <div className="font-medium text-[#191d23]">{achievement.name}</div>
                        <div className="text-[#a0abbb]">{achievement.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avatar Collection Preview */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#191d23]">Avatar Collection</h2>
                  <button onClick={() => setActiveTab("avatars")} className="text-[#704ee7] text-sm flex items-center">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {avatars
                    .filter((avatar) => avatar.unlocked)
                    .slice(0, 4)
                    .map((avatar) => (
                      <div
                        key={avatar.id}
                        className={`flex flex-col items-center p-3 rounded-lg ${
                          selectedAvatar === avatar.id ? "bg-[#e3dbfe]" : "bg-[#f5f7fb]"
                        } cursor-pointer hover:bg-[#e3dbfe] transition-colors`}
                        onClick={() => handleAvatarSelect(avatar.id)}
                      >
                        <div className="relative mb-2">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                            <Image
                              src={avatar.image || "/placeholder.svg"}
                              alt={avatar.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          {selectedAvatar === avatar.id && (
                            <div className="absolute -bottom-1 -right-1 bg-[#57e371] rounded-full w-6 h-6 flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-medium text-center text-[#191d23]">{avatar.name}</div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Recent Lessons */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#191d23]">Recent Lessons</h2>
                  <Link href="/dashboard/lessons" className="text-[#704ee7] text-sm flex items-center">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {userData.recentLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center bg-[#f5f7fb] p-4 rounded-lg">
                      <div className={`w-12 h-12 ${lesson.iconBg} rounded-lg flex items-center justify-center mr-4`}>
                        <span className={`${lesson.iconColor} text-xl`}>{lesson.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-[#191d23]">{lesson.name}</h3>
                            <div className="text-xs text-[#a0abbb]">
                              {lesson.category} • {lesson.date}
                            </div>
                          </div>
                          <div className="bg-white text-xs font-medium px-2 py-1 rounded-full text-[#57e371]">
                            {lesson.accuracy}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#191d23]">Certificates</h2>
                  <Link href="/dashboard/certificates" className="text-[#704ee7] text-sm flex items-center">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userData.certificates.map((certificate) => (
                    <div
                      key={certificate.id}
                      className="border border-gray-100 rounded-lg p-4 hover:border-[#704ee7] transition-colors"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#e3dbfe] flex items-center justify-center mr-3">
                          <Award className="w-5 h-5 text-[#704ee7]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#191d23]">{certificate.name}</h3>
                          <div className="text-xs text-[#a0abbb]">Issued on {certificate.issueDate}</div>
                        </div>
                      </div>
                      <div className="bg-[#f5f7fb] rounded-lg overflow-hidden h-24 relative">
                        <Image
                          src={certificate.image || "/placeholder.svg"}
                          alt={certificate.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button className="text-xs font-medium text-[#704ee7] hover:underline">View Certificate</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div>
              {/* Achievement Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#f5f7fb] p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-[#64748b]">Total Achievements</div>
                      <div className="text-2xl font-bold text-[#191d23]">{userData.achievements.length}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#e3dbfe] flex items-center justify-center">
                      <Award className="w-5 h-5 text-[#704ee7]" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5f7fb] p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-[#64748b]">Total XP</div>
                      <div className="text-2xl font-bold text-[#191d23]">{userData.xp}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#f0c332] bg-opacity-20 flex items-center justify-center">
                      <BadgeCheck className="w-5 h-5 text-[#f0c332]" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5f7fb] p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-[#64748b]">Current Level</div>
                      <div className="text-2xl font-bold text-[#191d23]">{userData.level}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#704ee7] bg-opacity-20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-[#704ee7]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* All Achievements */}
              <h2 className="text-lg font-bold text-[#191d23] mb-4">All Achievements</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {userData.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-white rounded-xl border border-gray-100 p-4 hover:border-[#704ee7] transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`bg-gradient-to-b ${achievement.color} w-16 h-16 rounded-xl flex items-center justify-center mb-3`}
                      >
                        <div className="text-white text-xl">{achievement.icon}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-[#191d23]">{achievement.name}</div>
                        <div className="text-xs text-[#a0abbb] mt-1">Earned on {achievement.date}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Locked Achievements (examples) */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 opacity-50">
                  <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-b from-[#a0abbb] to-[#64748b] w-16 h-16 rounded-xl flex items-center justify-center mb-3">
                      <div className="text-white text-xl">🏆</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-[#191d23]">Perfect Score</div>
                      <div className="text-xs text-[#a0abbb] mt-1">Get 100% on any lesson</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4 opacity-50">
                  <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-b from-[#a0abbb] to-[#64748b] w-16 h-16 rounded-xl flex items-center justify-center mb-3">
                      <div className="text-white text-xl">🌟</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-[#191d23]">30-Day Streak</div>
                      <div className="text-xs text-[#a0abbb] mt-1">Practice for 30 consecutive days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Avatars Tab */}
          {activeTab === "avatars" && (
            <div>
              {/* Avatar Collection */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#191d23] mb-4">Your Avatar Collection</h2>
                <p className="text-[#64748b] mb-4">
                  Unlock new avatars by completing lessons, earning badges, and reaching higher levels. Select an avatar
                  to use it on your profile.
                </p>

                <div className="bg-[#f5f7fb] p-4 rounded-xl mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#704ee7] bg-opacity-20 flex items-center justify-center mr-3">
                      <Sparkles className="w-5 h-5 text-[#704ee7]" />
                    </div>
                    <div>
                      <div className="font-medium text-[#191d23]">Currently Using</div>
                      <div className="text-sm text-[#64748b]">
                        {avatars.find((a) => a.id === selectedAvatar)?.name || "Default"} Avatar
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unlocked Avatars */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#191d23]">Unlocked Avatars</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevAvatarPage}
                      disabled={avatarPage === 0}
                      className={`p-1 rounded-full ${
                        avatarPage === 0 ? "text-gray-300 cursor-not-allowed" : "text-[#64748b] hover:bg-gray-100"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-[#64748b]">
                      {avatarPage + 1} / {totalAvatarPages}
                    </span>
                    <button
                      onClick={nextAvatarPage}
                      disabled={avatarPage >= totalAvatarPages - 1}
                      className={`p-1 rounded-full ${
                        avatarPage >= totalAvatarPages - 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-[#64748b] hover:bg-gray-100"
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {currentAvatars.map((avatar) => (
                    <div
                      key={avatar.id}
                      className={`relative flex flex-col items-center p-4 rounded-lg ${
                        avatar.unlocked
                          ? selectedAvatar === avatar.id
                            ? "bg-[#e3dbfe]"
                            : "bg-white border border-gray-100 hover:border-[#704ee7]"
                          : "bg-gray-100 opacity-70"
                      } transition-colors ${avatar.unlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
                      onClick={() => avatar.unlocked && handleAvatarSelect(avatar.id)}
                    >
                      <div className="relative mb-3">
                        <div
                          className={`w-20 h-20 rounded-full overflow-hidden ${
                            avatar.unlocked ? "border-2 border-white" : "border-2 border-gray-200"
                          }`}
                        >
                          <Image
                            src={avatar.image || "/placeholder.svg"}
                            alt={avatar.name}
                            width={80}
                            height={80}
                            className={`object-cover ${!avatar.unlocked && "grayscale"}`}
                          />
                        </div>
                        {selectedAvatar === avatar.id && (
                          <div className="absolute -bottom-1 -right-1 bg-[#57e371] rounded-full w-6 h-6 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {!avatar.unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center">
                              <Lock className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-[#191d23] mb-1">{avatar.name}</div>
                        {avatar.unlocked ? (
                          <div className="text-xs text-[#57e371] flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Unlocked
                          </div>
                        ) : (
                          <div className="text-xs text-[#64748b]">
                            {avatar.requiredLevel ? `Requires Level ${avatar.requiredLevel}` : avatar.unlockCriteria}
                          </div>
                        )}
                      </div>

                      {avatar.default && (
                        <div className="absolute top-2 left-2 bg-[#f0c332] text-white text-xs px-2 py-0.5 rounded-full">
                          Default
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Avatar Unlocking Progress */}
              <div>
                <h3 className="font-bold text-[#191d23] mb-4">Avatar Unlocking Progress</h3>
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-[#191d23]">Avatars Unlocked</div>
                    <div className="text-sm text-[#64748b]">
                      {avatars.filter((a) => a.unlocked).length}/{avatars.length}
                    </div>
                  </div>
                  <div className="h-2 bg-[#f5f7fb] rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-[#704ee7] rounded-full"
                      style={{ width: `${(avatars.filter((a) => a.unlocked).length / avatars.length) * 100}%` }}
                    ></div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#e3dbfe] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Crown className="w-4 h-4 text-[#704ee7]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#191d23]">Next Avatar: Explorer</div>
                        <div className="text-sm text-[#64748b] mb-2">Complete 20 lessons to unlock</div>
                        <div className="flex items-center text-xs text-[#a0abbb]">
                          <div className="flex-1 h-1.5 bg-[#f5f7fb] rounded-full overflow-hidden mr-2">
                            <div
                              className="h-full bg-[#704ee7] rounded-full"
                              style={{ width: `${(userData.totalLessonsCompleted / 20) * 100}%` }}
                            ></div>
                          </div>
                          <span>
                            {userData.totalLessonsCompleted}/20 (
                            {Math.round((userData.totalLessonsCompleted / 20) * 100)}
                            %)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-[#f0c332] bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Star className="w-4 h-4 text-[#f0c332]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#191d23]">Champion Avatar</div>
                        <div className="text-sm text-[#64748b] mb-2">Earn 10 badges to unlock</div>
                        <div className="flex items-center text-xs text-[#a0abbb]">
                          <div className="flex-1 h-1.5 bg-[#f5f7fb] rounded-full overflow-hidden mr-2">
                            <div
                              className="h-full bg-[#f0c332] rounded-full"
                              style={{ width: `${(userData.achievements.length / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span>
                            {userData.achievements.length}/10 ({Math.round((userData.achievements.length / 10) * 100)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === "progress" && (
            <div>
              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#f5f7fb] p-4 rounded-xl">
                  <h3 className="text-lg font-bold text-[#191d23] mb-4">Overall Completion</h3>
                  <div className="flex justify-center mb-4">
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
                          strokeDashoffset="170"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                        <text
                          x="50"
                          y="50"
                          textAnchor="middle"
                          fill="#704ee7"
                          fontSize="16"
                          fontWeight="bold"
                          dominantBaseline="middle"
                        >
                          40%
                        </text>
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[#64748b]">39 out of 80 lessons completed</p>
                  </div>
                </div>

                <div className="bg-[#f5f7fb] p-4 rounded-xl">
                  <h3 className="text-lg font-bold text-[#191d23] mb-4">Learning Categories</h3>
                  <div className="space-y-4">
                    {userData.progressStats.map((stat, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <div className="text-sm font-medium text-[#191d23]">{stat.label}</div>
                          <div className="text-sm text-[#64748b]">
                            {stat.completed}/{stat.total} ({Math.round((stat.completed / stat.total) * 100)}%)
                          </div>
                        </div>
                        <div className="h-2 bg-white rounded-full overflow-hidden">
                          <div
                            className={`h-full ${stat.color} rounded-full`}
                            style={{ width: `${(stat.completed / stat.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="bg-[#f5f7fb] p-4 rounded-xl mb-6">
                <h3 className="text-lg font-bold text-[#191d23] mb-4">Weekly Activity</h3>
                <div className="flex items-end justify-between h-40">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                    // Generate random height for demo
                    const height = [35, 60, 45, 80, 65, 90, 30][index]

                    return (
                      <div key={day} className="flex flex-col items-center">
                        <div
                          className="w-12 bg-[#704ee7] bg-opacity-20 rounded-t-md hover:bg-opacity-30 transition-all cursor-pointer"
                          style={{ height: `${height}%` }}
                        >
                          <div
                            className="w-full bg-[#704ee7] rounded-t-md transition-all"
                            style={{ height: `${height * 0.7}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs text-[#64748b]">{day}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Learning Time Distribution */}
              <div className="bg-[#f5f7fb] p-4 rounded-xl">
                <h3 className="text-lg font-bold text-[#191d23] mb-4">Learning Time Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#704ee7] bg-opacity-20 flex items-center justify-center mr-2">
                        <Clock className="w-4 h-4 text-[#704ee7]" />
                      </div>
                      <div className="text-sm text-[#64748b]">Morning</div>
                    </div>
                    <div className="text-xl font-bold text-[#191d23]">6h 45m</div>
                    <div className="text-xs text-[#a0abbb]">27% of total time</div>
                  </div>

                  <div className="bg-white p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#f0c332] bg-opacity-20 flex items-center justify-center mr-2">
                        <Clock className="w-4 h-4 text-[#f0c332]" />
                      </div>
                      <div className="text-sm text-[#64748b]">Afternoon</div>
                    </div>
                    <div className="text-xl font-bold text-[#191d23]">10h 30m</div>
                    <div className="text-xs text-[#a0abbb]">42% of total time</div>
                  </div>

                  <div className="bg-white p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#3874ff] bg-opacity-20 flex items-center justify-center mr-2">
                        <Clock className="w-4 h-4 text-[#3874ff]" />
                      </div>
                      <div className="text-sm text-[#64748b]">Evening</div>
                    </div>
                    <div className="text-xl font-bold text-[#191d23]">7h 30m</div>
                    <div className="text-xs text-[#a0abbb]">31% of total time</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              {/* Settings Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Settings */}
                <div className="bg-[#f5f7fb] p-4 rounded-xl">
                  <h3 className="text-lg font-bold text-[#191d23] mb-4">Account Settings</h3>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-[#704ee7] mr-3" />
                          <span className="text-[#191d23]">Personal Information</span>
                        </div>
                        <button className="text-xs text-[#704ee7] hover:underline">Edit</button>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-[#704ee7] mr-3" />
                          <span className="text-[#191d23]">Email & Password</span>
                        </div>
                        <button className="text-xs text-[#704ee7] hover:underline">Edit</button>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell className="w-5 h-5 text-[#704ee7] mr-3" />
                          <span className="text-[#191d23]">Notifications</span>
                        </div>
                        <button className="text-xs text-[#704ee7] hover:underline">Edit</button>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Lock className="w-5 h-5 text-[#704ee7] mr-3" />
                          <span className="text-[#191d23]">Privacy Settings</span>
                        </div>
                        <button className="text-xs text-[#704ee7] hover:underline">Edit</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-[#f5f7fb] p-4 rounded-xl">
                  <h3 className="text-lg font-bold text-[#191d23] mb-4">Preferences</h3>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Settings className="w-5 h-5 text-[#f0c332] mr-3" />
                          <span className="text-[#191d23]">Learning Preferences</span>
                        </div>
                        <button className="text-xs text-[#704ee7] hover:underline">Edit</button>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MessageSquare className="w-5 h-5 text-[#f0c332] mr-3" />
                          <span className="text-[#191d23]">Community Settings</span>
                        </div>
                        <button className="text-xs text-[#704ee7] hover:underline">Edit</button>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell className="w-5 h-5 text-[#f0c332] mr-3" />
                          <span className="text-[#191d23]">Notification Preferences</span>
                        </div>
                        <button className="text-xs text-[#704ee7] hover:underline">Edit</button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center text-[#ff6265] hover:text-[#ff4f5e]"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#191d23]">Choose Your Avatar</h2>
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-[#64748b]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-[#64748b]">
                  Select an avatar to represent you across the platform. Unlock more avatars by completing lessons and
                  earning achievements.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`relative flex flex-col items-center p-4 rounded-lg ${
                      avatar.unlocked
                        ? selectedAvatar === avatar.id
                          ? "bg-[#e3dbfe]"
                          : "bg-white border border-gray-100 hover:border-[#704ee7]"
                        : "bg-gray-100 opacity-70"
                    } transition-colors ${avatar.unlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
                    onClick={() => avatar.unlocked && handleAvatarSelect(avatar.id)}
                  >
                    <div className="relative mb-3">
                      <div
                        className={`w-20 h-20 rounded-full overflow-hidden ${
                          avatar.unlocked ? "border-2 border-white" : "border-2 border-gray-200"
                        }`}
                      >
                        <Image
                          src={avatar.image || "/Avatar.png"}
                          alt={avatar.name}
                          width={80}
                          height={80}
                          className={`object-cover ${!avatar.unlocked && "grayscale"}`}
                        />
                      </div>
                      {selectedAvatar === avatar.id && (
                        <div className="absolute -bottom-1 -right-1 bg-[#57e371] rounded-full w-6 h-6 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {!avatar.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-[#191d23] mb-1">{avatar.name}</div>
                      {avatar.unlocked ? (
                        <div className="text-xs text-[#57e371] flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Unlocked
                        </div>
                      ) : (
                        <div className="text-xs text-[#64748b]">{avatar.unlockCriteria}</div>
                      )}
                    </div>

                    {avatar.default && (
                      <div className="absolute top-2 left-2 bg-[#f0c332] text-white text-xs px-2 py-0.5 rounded-full">
                        Default
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 border border-[#d0d5dd] text-[#64748b] rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 bg-[#704ee7] text-white rounded-lg hover:bg-[#684ad6]"
                >
                  Save Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
