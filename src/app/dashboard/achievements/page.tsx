"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Trophy,
  BadgeCheck,
  Star,
  Lock,
  Calendar,
  ChevronRight,
  Info,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  Sparkles,
} from "lucide-react"
import Sidebar from "@/components/sidebar"

export default function AchievementsPage() {
  const [achievementFilter, setAchievementFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [animateItems, setAnimateItems] = useState(false)

  // Achievement data
  const achievements = [
    {
      id: 1,
      name: "First Step",
      description: "Complete your first lesson",
      category: "beginner",
      icon: "🚀",
      color: "from-[#ff9160] to-[#ff6265]",
      earned: true,
      date: "Mar 15, 2023",
      xp: 50,
    },
    {
      id: 2,
      name: "Quick Learner",
      description: "Complete 5 lessons in one day",
      category: "beginner",
      icon: "⚡",
      color: "from-[#704ee7] to-[#684ad6]",
      earned: true,
      date: "Mar 17, 2023",
      xp: 100,
    },
    {
      id: 3,
      name: "Alphabet Master",
      description: "Learn all alphabet signs",
      category: "intermediate",
      icon: "🔤",
      color: "from-[#3874ff] to-[#684ad6]",
      earned: true,
      date: "Mar 25, 2023",
      xp: 200,
    },
    {
      id: 4,
      name: "Number Whiz",
      description: "Learn all number signs",
      category: "intermediate",
      icon: "🔢",
      color: "from-[#57e371] to-[#3acbe8]",
      earned: false,
      progress: 70,
      xp: 200,
    },
    {
      id: 5,
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      category: "commitment",
      icon: "🔥",
      color: "from-[#f0c332] to-[#ff9160]",
      earned: true,
      date: "Apr 1, 2023",
      xp: 150,
    },
    {
      id: 6,
      name: "Perfect Score",
      description: "Get 100% on any practice session",
      category: "advanced",
      icon: "🎯",
      color: "from-[#ff6265] to-[#ff4f5e]",
      earned: false,
      progress: 90,
      xp: 300,
    },
    {
      id: 7,
      name: "Social Butterfly",
      description: "Join 5 community discussions",
      category: "social",
      icon: "🦋",
      color: "from-[#3acbe8] to-[#3874ff]",
      earned: false,
      progress: 40,
      xp: 100,
    },
    {
      id: 8,
      name: "Challenge Champion",
      description: "Complete 10 challenges",
      category: "advanced",
      icon: "🏆",
      color: "from-[#f0c332] to-[#ff9160]",
      earned: false,
      progress: 30,
      xp: 300,
    },
    {
      id: 9,
      name: "Early Bird",
      description: "Complete a lesson before 8 AM",
      category: "commitment",
      icon: "🌅",
      color: "from-[#ff9160] to-[#ff6265]",
      earned: true,
      date: "Mar 20, 2023",
      xp: 50,
    },
    {
      id: 10,
      name: "Night Owl",
      description: "Complete a lesson after 10 PM",
      category: "commitment",
      icon: "🌙",
      color: "from-[#704ee7] to-[#684ad6]",
      earned: true,
      date: "Mar 22, 2023",
      xp: 50,
    },
    {
      id: 11,
      name: "First Conversation",
      description: "Learn all phrases in the basic conversation module",
      category: "advanced",
      icon: "💬",
      color: "from-[#57e371] to-[#3acbe8]",
      earned: false,
      progress: 10,
      xp: 250,
    },
    {
      id: 12,
      name: "Community Helper",
      description: "Answer 5 questions in the community forum",
      category: "social",
      icon: "🤝",
      color: "from-[#704ee7] to-[#684ad6]",
      earned: false,
      progress: 0,
      xp: 150,
    },
  ]

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" },
    { id: "commitment", name: "Commitment" },
    { id: "social", name: "Social" },
  ]

  // Filter achievements based on selected category and search query
  const filteredAchievements = achievements
    .filter((achievement) => {
      // Filter by status (earned, in-progress, locked)
      if (achievementFilter === "earned") return achievement.earned
      if (achievementFilter === "in-progress") return !achievement.earned && (achievement.progress ?? 0) > 0
      if (achievementFilter === "locked")
        return !achievement.earned && (!achievement.progress || achievement.progress === 0)
      return true // "all" filter
    })
    .filter((achievement) => {
      // Filter by category
      if (categoryFilter === "all") return true
      return achievement.category === categoryFilter
    })
    .filter((achievement) => {
      // Filter by search query
      if (!searchQuery) return true
      return (
        achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .sort((a, b) => {
      // Sort based on selected sort option
      if (sortBy === "recent") {
        // Sort by date (for earned) or progress (for unearned)
        if (a.earned && b.earned) {
          return new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
        } else if (!a.earned && !b.earned) {
          return (b.progress || 0) - (a.progress || 0)
        } else {
          return a.earned ? -1 : 1 // Earned first
        }
      } else if (sortBy === "xp-high") {
        return b.xp - a.xp
      } else if (sortBy === "xp-low") {
        return a.xp - b.xp
      } else if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

  // Animation effect when filter changes
  useEffect(() => {
    setAnimateItems(false)
    const timer = setTimeout(() => {
      setAnimateItems(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [achievementFilter, categoryFilter, sortBy, searchQuery])

  // Calculate achievement statistics
  const totalAchievements = achievements.length
  const earnedAchievements = achievements.filter((a) => a.earned).length
  const inProgressAchievements = achievements.filter((a) => !a.earned && (a.progress ?? 0) > 0).length
  const lockedAchievements = achievements.filter((a) => !a.earned && (!a.progress || a.progress === 0)).length
  const totalXP = achievements.filter((a) => a.earned).reduce((sum, a) => sum + a.xp, 0)
  const possibleXP = achievements.reduce((sum, a) => sum + a.xp, 0)

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      {/* Left Sidebar - Removed to prevent double implementation */}
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#191d23] mb-2">Achievements</h1>
              <p className="text-[#64748b]">Track your progress and earn badges as you learn sign language</p>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0abbb] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search achievements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent w-full md:w-64 text-sm"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 ${
                  showFilters ? "bg-[#704ee7] text-white" : "bg-white text-[#64748b]"
                } rounded-lg hover:bg-opacity-90 flex items-center justify-center transition-colors`}
                aria-label="Toggle filters"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 bg-white rounded-xl p-5 shadow-sm border border-[#e2e8f0] animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#191d23] mb-3">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setAchievementFilter("all")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        achievementFilter === "all"
                          ? "bg-[#704ee7] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#e3dbfe] hover:text-[#704ee7]"
                      } transition-colors`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setAchievementFilter("earned")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        achievementFilter === "earned"
                          ? "bg-[#57e371] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#57e371] hover:bg-opacity-20 hover:text-[#57e371]"
                      } transition-colors`}
                    >
                      Earned
                    </button>
                    <button
                      onClick={() => setAchievementFilter("in-progress")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        achievementFilter === "in-progress"
                          ? "bg-[#f0c332] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#f0c332] hover:bg-opacity-20 hover:text-[#f0c332]"
                      } transition-colors`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => setAchievementFilter("locked")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        achievementFilter === "locked"
                          ? "bg-[#64748b] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-gray-200"
                      } transition-colors`}
                    >
                      Locked
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#191d23] mb-3">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setCategoryFilter(category.id)}
                        className={`px-3 py-1.5 rounded-md text-sm ${
                          categoryFilter === category.id
                            ? "bg-[#704ee7] text-white"
                            : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#e3dbfe] hover:text-[#704ee7]"
                        } transition-colors`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#191d23] mb-3">Sort By</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSortBy("recent")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        sortBy === "recent"
                          ? "bg-[#704ee7] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#e3dbfe] hover:text-[#704ee7]"
                      } transition-colors`}
                    >
                      Most Recent
                    </button>
                    <button
                      onClick={() => setSortBy("xp-high")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        sortBy === "xp-high"
                          ? "bg-[#704ee7] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#e3dbfe] hover:text-[#704ee7]"
                      } transition-colors`}
                    >
                      XP (High to Low)
                    </button>
                    <button
                      onClick={() => setSortBy("xp-low")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        sortBy === "xp-low"
                          ? "bg-[#704ee7] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#e3dbfe] hover:text-[#704ee7]"
                      } transition-colors`}
                    >
                      XP (Low to High)
                    </button>
                    <button
                      onClick={() => setSortBy("alphabetical")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        sortBy === "alphabetical"
                          ? "bg-[#704ee7] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#e3dbfe] hover:text-[#704ee7]"
                      } transition-colors`}
                    >
                      Alphabetical
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Achievement Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748b] mb-1">Total Achievements</div>
                <div className="text-2xl font-bold text-[#191d23]">{totalAchievements}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#e3dbfe] flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-[#704ee7]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748b] mb-1">Earned</div>
                <div className="text-2xl font-bold text-[#191d23]">{earnedAchievements}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#57e371] bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <BadgeCheck className="w-6 h-6 text-[#57e371]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748b] mb-1">In Progress</div>
                <div className="text-2xl font-bold text-[#191d23]">{inProgressAchievements}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#f0c332] bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-[#f0c332]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748b] mb-1">Locked</div>
                <div className="text-2xl font-bold text-[#191d23]">{lockedAchievements}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#ff6265] bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-[#ff6265]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0] sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748b] mb-1">Total XP Earned</div>
                <div className="text-2xl font-bold text-[#191d23]">{totalXP}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#704ee7] bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-[#704ee7]" />
              </div>
            </div>
            <div className="mt-2 text-xs text-[#a0abbb]">
              {Math.round((totalXP / possibleXP) * 100)}% of possible XP
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0] mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-[#191d23]">Achievement Progress</h2>
            <div className="text-sm text-[#64748b]">
              {earnedAchievements}/{totalAchievements} Achievements Earned
            </div>
          </div>
          <div className="h-3 bg-[#f5f7fb] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#704ee7] to-[#3874ff] rounded-full transition-all duration-1000"
              style={{ width: `${(earnedAchievements / totalAchievements) * 100}%` }}
            ></div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#f5f7fb] p-3 rounded-lg">
              <div className="text-sm text-[#64748b]">Beginner</div>
              <div className="text-lg font-bold text-[#191d23]">
                {achievements.filter((a) => a.category === "beginner" && a.earned).length}/
                {achievements.filter((a) => a.category === "beginner").length}
              </div>
            </div>
            <div className="bg-[#f5f7fb] p-3 rounded-lg">
              <div className="text-sm text-[#64748b]">Intermediate</div>
              <div className="text-lg font-bold text-[#191d23]">
                {achievements.filter((a) => a.category === "intermediate" && a.earned).length}/
                {achievements.filter((a) => a.category === "intermediate").length}
              </div>
            </div>
            <div className="bg-[#f5f7fb] p-3 rounded-lg">
              <div className="text-sm text-[#64748b]">Advanced</div>
              <div className="text-lg font-bold text-[#191d23]">
                {achievements.filter((a) => a.category === "advanced" && a.earned).length}/
                {achievements.filter((a) => a.category === "advanced").length}
              </div>
            </div>
            <div className="bg-[#f5f7fb] p-3 rounded-lg">
              <div className="text-sm text-[#64748b]">Social</div>
              <div className="text-lg font-bold text-[#191d23]">
                {achievements.filter((a) => a.category === "social" && a.earned).length}/
                {achievements.filter((a) => a.category === "social").length}
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#191d23] mb-4">
            {filteredAchievements.length} {achievementFilter !== "all" ? achievementFilter : ""} Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-white rounded-xl overflow-hidden shadow-sm border border-[#e2e8f0] hover:shadow-md transition-all duration-300 ${
                  animateItems ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${achievement.id * 50}ms` }}
              >
                <div className={`bg-gradient-to-r ${achievement.color} h-2`}></div>
                <div className="p-5">
                  <div className="flex items-start">
                    <div
                      className={`w-14 h-14 bg-gradient-to-b ${achievement.color} rounded-xl flex items-center justify-center text-2xl mr-4 shrink-0`}
                    >
                      <span className="text-white">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-[#191d23] text-lg">{achievement.name}</h3>
                        {achievement.earned && <BadgeCheck className="w-5 h-5 text-[#57e371]" />}
                      </div>
                      <p className="text-sm text-[#64748b] mt-1 line-clamp-2">{achievement.description}</p>

                      {achievement.earned ? (
                        <div className="flex items-center mt-3 text-xs text-[#a0abbb]">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          Earned on {achievement.date}
                        </div>
                      ) : achievement.progress && achievement.progress > 0 ? (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-[#a0abbb] mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-[#f5f7fb] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${achievement.color}`}
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center mt-3 text-xs text-[#a0abbb]">
                          <Lock className="w-3.5 h-3.5 mr-1" />
                          Complete the requirements to unlock
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs font-medium bg-[#e3dbfe] text-[#704ee7] px-2 py-1 rounded-full">
                      +{achievement.xp} XP
                    </div>
                    <button className="text-xs text-[#64748b] flex items-center hover:text-[#704ee7] transition-colors">
                      Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No achievements found */}
        {filteredAchievements.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-[#e2e8f0]">
            <div className="w-16 h-16 bg-[#f5f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-[#64748b]" />
            </div>
            <h3 className="text-lg font-bold text-[#191d23] mb-2">No achievements found</h3>
            <p className="text-[#64748b] mb-4">No achievements match your current filter criteria.</p>
            <button
              onClick={() => {
                setAchievementFilter("all")
                setCategoryFilter("all")
                setSearchQuery("")
              }}
              className="px-4 py-2 bg-[#704ee7] text-white rounded-lg hover:bg-[#684ad6] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-[300px] bg-white p-6 hidden lg:block sticky top-0 h-screen">
        <h2 className="text-xl font-bold text-[#191d23] mb-6">Your Profile</h2>

        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#f0c332]">
              <Image
                src="/Avatar.png"
                alt="User"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#f0c332] rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-xs">10</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[#191d23] mb-1">Jenny Wilson</h3>
          <p className="text-sm text-[#a0abbb]">Level 10 • 4,328 XP</p>
        </div>

        {/* XP Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[#a0abbb]">Next Level</span>
            <span className="text-[#704ee7] font-medium">78%</span>
          </div>
          <div className="h-2 bg-[#f5f7fb] rounded-full overflow-hidden">
            <div className="h-full bg-[#704ee7] rounded-full" style={{ width: "78%" }}></div>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-[#a0abbb]">4,328 XP</span>
            <span className="text-[#a0abbb]">5,000 XP</span>
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#191d23]">Recent Achievements</h3>
            <Link href="/dashboard/profile" className="text-[#704ee7] text-sm flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {achievements
              .filter((a) => a.earned)
              .slice(0, 3)
              .map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center group hover:bg-[#f5f7fb] p-2 rounded-lg transition-colors"
                >
                  <div
                    className={`w-10 h-10 bg-gradient-to-b ${achievement.color} rounded-lg flex items-center justify-center text-base mr-3 shrink-0`}
                  >
                    <span className="text-white">{achievement.icon}</span>
                  </div>
                  <div>
                    <div className="font-medium text-[#191d23] text-sm group-hover:text-[#704ee7] transition-colors">
                      {achievement.name}
                    </div>
                    <div className="text-xs text-[#a0abbb] flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {achievement.date}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              href="/dashboard/challenges"
              className="flex items-center justify-center w-full p-3 text-[#704ee7] border border-[#e3dbfe] bg-[#f8f7fe] rounded-lg hover:bg-[#e3dbfe] transition-colors"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              View Challenges
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
