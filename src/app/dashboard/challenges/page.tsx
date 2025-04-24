"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Puzzle,
  CheckCircle,
  Clock,
  Zap,
  Award,
  TrendingUp,
  ChevronRight,
  Filter,
  Search,
  Calendar,
  ArrowUpRight,
  AlertCircle,
  Sparkles,
  Play,
} from "lucide-react"

export default function ChallengesPage() {
  const [challengeFilter, setChallengeFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("expiring")
  const [animateItems, setAnimateItems] = useState(false)

  // Challenge data
  const challenges = [
    {
      id: 1,
      name: "Alphabet Rush",
      description: "Learn 5 new alphabet signs in one day",
      category: "daily",
      difficulty: "easy",
      icon: "🔤",
      color: "from-[#704ee7] to-[#684ad6]",
      reward: "100 XP",
      timeLeft: "8 hours",
      completed: false,
      progress: 40,
    },
    {
      id: 2,
      name: "Perfect Practice",
      description: "Complete a practice session with 100% accuracy",
      category: "weekly",
      difficulty: "medium",
      icon: "🎯",
      color: "from-[#ff9160] to-[#ff6265]",
      reward: "200 XP + Perfect Badge",
      timeLeft: "3 days",
      completed: false,
      progress: 90,
    },
    {
      id: 3,
      name: "Community Contributor",
      description: "Answer a question in the community forum",
      category: "weekly",
      difficulty: "easy",
      icon: "🤝",
      color: "from-[#57e371] to-[#3acbe8]",
      reward: "150 XP",
      timeLeft: "5 days",
      completed: false,
      progress: 0,
    },
    {
      id: 4,
      name: "7-Day Streak",
      description: "Practice sign language for 7 consecutive days",
      category: "monthly",
      difficulty: "medium",
      icon: "🔥",
      color: "from-[#f0c332] to-[#ff9160]",
      reward: "300 XP + Week Warrior Badge",
      timeLeft: "24 days",
      completed: false,
      progress: 71,
    },
    {
      id: 5,
      name: "Number Master",
      description: "Learn all number signs (0-9)",
      category: "monthly",
      difficulty: "hard",
      icon: "🔢",
      color: "from-[#3874ff] to-[#684ad6]",
      reward: "400 XP + Number Whiz Badge",
      timeLeft: "18 days",
      completed: false,
      progress: 70,
    },
    {
      id: 6,
      name: "Speed Signer",
      description: "Complete 3 lessons in under 30 minutes",
      category: "daily",
      difficulty: "hard",
      icon: "⚡",
      color: "from-[#ff6265] to-[#ff4f5e]",
      reward: "150 XP",
      timeLeft: "Today",
      completed: true,
      completedDate: "Today",
    },
    {
      id: 7,
      name: "Morning Practice",
      description: "Complete a lesson before 9 AM",
      category: "daily",
      difficulty: "easy",
      icon: "🌅",
      color: "from-[#f0c332] to-[#ff9160]",
      reward: "50 XP",
      timeLeft: "Tomorrow",
      completed: true,
      completedDate: "Yesterday",
    },
    {
      id: 8,
      name: "Conversation Starter",
      description: "Learn 10 common phrases",
      category: "weekly",
      difficulty: "medium",
      icon: "💬",
      color: "from-[#3acbe8] to-[#3874ff]",
      reward: "250 XP",
      timeLeft: "2 days",
      completed: false,
      progress: 50,
    },
    {
      id: 9,
      name: "Share Your Progress",
      description: "Share your achievement on social media",
      category: "monthly",
      difficulty: "easy",
      icon: "📱",
      color: "from-[#704ee7] to-[#684ad6]",
      reward: "100 XP + Social Butterfly Badge",
      timeLeft: "28 days",
      completed: false,
      progress: 0,
    },
  ]

  // Calculate challenge statistics
  const totalChallenges = challenges.length
  const activeChallenges = challenges.filter((c) => !c.completed).length
  const completedChallenges = challenges.filter((c) => c.completed).length
  const expiringChallenges = challenges.filter(
    (c) => !c.completed && (c.timeLeft === "Today" || c.timeLeft === "8 hours"),
  ).length
  const totalXP = challenges.reduce((sum, c) => sum + Number.parseInt(c.reward.split(" ")[0]), 0)

  // Apply filters and sorting
  const filteredChallenges = challenges
    .filter((challenge) => {
      // Filter by status
      if (challengeFilter === "active") return !challenge.completed
      if (challengeFilter === "completed") return challenge.completed
      if (challengeFilter === "daily") return challenge.category === "daily"
      if (challengeFilter === "weekly") return challenge.category === "weekly"
      if (challengeFilter === "monthly") return challenge.category === "monthly"
      return true // "all" filter
    })
    .filter((challenge) => {
      // Filter by difficulty
      if (difficultyFilter === "all") return true
      return challenge.difficulty === difficultyFilter
    })
    .filter((challenge) => {
      // Filter by search query
      if (!searchQuery) return true
      return (
        challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .sort((a, b) => {
      // Sort based on selected sort option
      if (sortBy === "expiring") {
        // Sort by time left (for active) or completion date (for completed)
        if (!a.completed && !b.completed) {
          // Both active - sort by time left
          if (a.timeLeft === "Today" && b.timeLeft !== "Today") return -1
          if (a.timeLeft !== "Today" && b.timeLeft === "Today") return 1
          if (a.timeLeft === "Tomorrow" && b.timeLeft !== "Tomorrow") return -1
          if (a.timeLeft !== "Tomorrow" && b.timeLeft === "Tomorrow") return 1
          // Extract numeric values from timeLeft strings
          const aTime = Number.parseInt(a.timeLeft.split(" ")[0]) || 100
          const bTime = Number.parseInt(b.timeLeft.split(" ")[0]) || 100
          return aTime - bTime
        } else if (a.completed && b.completed) {
          // Both completed - sort by completion date (most recent first)
          if (a.completedDate === "Today" && b.completedDate !== "Today") return -1
          if (a.completedDate !== "Today" && b.completedDate === "Today") return 1
          if (a.completedDate === "Yesterday" && b.completedDate !== "Yesterday") return -1
          if (a.completedDate !== "Yesterday" && b.completedDate === "Yesterday") return 1
          return 0
        } else {
          // One active, one completed
          return a.completed ? 1 : -1 // Active first
        }
      } else if (sortBy === "reward-high") {
        // Sort by reward (high to low)
        const aReward = Number.parseInt(a.reward.split(" ")[0])
        const bReward = Number.parseInt(b.reward.split(" ")[0])
        return bReward - aReward
      } else if (sortBy === "progress") {
        // Sort by progress (high to low)
        const aProgress = a.completed ? 100 : a.progress || 0
        const bProgress = b.completed ? 100 : b.progress || 0
        return bProgress - aProgress
      } else if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

  // Difficulty color mapping
  const difficultyColor = {
    easy: "text-[#57e371]",
    medium: "text-[#f0c332]",
    hard: "text-[#ff6265]",
  }

  const difficultyBgColor = {
    easy: "bg-[#57e371] bg-opacity-10",
    medium: "bg-[#f0c332] bg-opacity-10",
    hard: "bg-[#ff6265] bg-opacity-10",
  }

  // Animation effect when filter changes
  useEffect(() => {
    setAnimateItems(false)
    const timer = setTimeout(() => {
      setAnimateItems(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [challengeFilter, difficultyFilter, sortBy, searchQuery])

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      {/* Left Sidebar */}
      {/* <Sidebar activePage="challenges" /> */}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#191d23] mb-2">Challenges</h1>
              <p className="text-[#64748b]">Complete challenges to earn XP and badges</p>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0abbb] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent w-full md:w-64 text-sm"
                />
              </div>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`p-2 ${
                  filtersOpen ? "bg-[#704ee7] text-white" : "bg-white text-[#64748b]"
                } rounded-lg hover:bg-opacity-90 flex items-center justify-center transition-colors`}
                aria-label="Toggle filters"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {filtersOpen && (
            <div className="mt-4 bg-white rounded-xl p-5 shadow-sm border border-[#e2e8f0] animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#191d23] mb-3">Challenge Type</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setChallengeFilter("all")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        challengeFilter === "all"
                          ? "bg-[#704ee7] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#e3dbfe] hover:text-[#704ee7]"
                      } transition-colors`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setChallengeFilter("active")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        challengeFilter === "active"
                          ? "bg-[#57e371] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#57e371] hover:bg-opacity-20 hover:text-[#57e371]"
                      } transition-colors`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setChallengeFilter("completed")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        challengeFilter === "completed"
                          ? "bg-[#3874ff] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#3874ff] hover:bg-opacity-20 hover:text-[#3874ff]"
                      } transition-colors`}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => setChallengeFilter("daily")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        challengeFilter === "daily"
                          ? "bg-[#f0c332] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#f0c332] hover:bg-opacity-20 hover:text-[#f0c332]"
                      } transition-colors`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setChallengeFilter("weekly")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        challengeFilter === "weekly"
                          ? "bg-[#ff9160] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#ff9160] hover:bg-opacity-20 hover:text-[#ff9160]"
                      } transition-colors`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => setChallengeFilter("monthly")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        challengeFilter === "monthly"
                          ? "bg-[#3acbe8] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#3acbe8] hover:bg-opacity-20 hover:text-[#3acbe8]"
                      } transition-colors`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#191d23] mb-3">Difficulty</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setDifficultyFilter("all")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        difficultyFilter === "all"
                          ? "bg-[#704ee7] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#e3dbfe] hover:text-[#704ee7]"
                      } transition-colors`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setDifficultyFilter("easy")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        difficultyFilter === "easy"
                          ? "bg-[#57e371] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#57e371] hover:bg-opacity-20 hover:text-[#57e371]"
                      } transition-colors`}
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => setDifficultyFilter("medium")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        difficultyFilter === "medium"
                          ? "bg-[#f0c332] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#f0c332] hover:bg-opacity-20 hover:text-[#f0c332]"
                      } transition-colors`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => setDifficultyFilter("hard")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        difficultyFilter === "hard"
                          ? "bg-[#ff6265] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#ff6265] hover:bg-opacity-20 hover:text-[#ff6265]"
                      } transition-colors`}
                    >
                      Hard
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#191d23] mb-3">Sort By</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSortBy("expiring")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        sortBy === "expiring"
                          ? "bg-[#704ee7] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#e3dbfe] hover:text-[#704ee7]"
                      } transition-colors`}
                    >
                      Expiring Soon
                    </button>
                    <button
                      onClick={() => setSortBy("reward-high")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        sortBy === "reward-high"
                          ? "bg-[#704ee7] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#e3dbfe] hover:text-[#704ee7]"
                      } transition-colors`}
                    >
                      Highest Reward
                    </button>
                    <button
                      onClick={() => setSortBy("progress")}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        sortBy === "progress"
                          ? "bg-[#704ee7] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-[#e3dbfe] hover:text-[#704ee7]"
                      } transition-colors`}
                    >
                      Most Progress
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

        {/* Challenge Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748b] mb-1">Active Challenges</div>
                <div className="text-2xl font-bold text-[#191d23]">{activeChallenges}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#e3dbfe] flex items-center justify-center flex-shrink-0">
                <Puzzle className="w-6 h-6 text-[#704ee7]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748b] mb-1">Completed</div>
                <div className="text-2xl font-bold text-[#191d23]">{completedChallenges}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#57e371] bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-[#57e371]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748b] mb-1">Expiring Soon</div>
                <div className="text-2xl font-bold text-[#191d23]">{expiringChallenges}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#ff6265] bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[#ff6265]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748b] mb-1">Total XP Available</div>
                <div className="text-2xl font-bold text-[#191d23]">{totalXP}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#704ee7] bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-[#704ee7]" />
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Progress Overview */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0] mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#191d23]">Challenge Progress</h2>
            <div className="text-sm text-[#64748b]">
              {completedChallenges}/{totalChallenges} Completed
            </div>
          </div>

          <div className="h-3 bg-[#f5f7fb] rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-[#704ee7] to-[#3874ff] rounded-full transition-all duration-1000"
              style={{ width: `${(completedChallenges / totalChallenges) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#f5f7fb] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-[#f0c332] flex-shrink-0" />
                <div className="text-sm text-[#64748b]">Daily Challenges</div>
              </div>
              <div className="text-lg font-bold text-[#191d23]">
                {challenges.filter((c) => c.category === "daily" && c.completed).length}/
                {challenges.filter((c) => c.category === "daily").length}
              </div>
            </div>

            <div className="bg-[#f5f7fb] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-[#ff9160] flex-shrink-0" />
                <div className="text-sm text-[#64748b]">Weekly Challenges</div>
              </div>
              <div className="text-lg font-bold text-[#191d23]">
                {challenges.filter((c) => c.category === "weekly" && c.completed).length}/
                {challenges.filter((c) => c.category === "weekly").length}
              </div>
            </div>

            <div className="bg-[#f5f7fb] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-[#3acbe8] flex-shrink-0" />
                <div className="text-sm text-[#64748b]">Monthly Challenges</div>
              </div>
              <div className="text-lg font-bold text-[#191d23]">
                {challenges.filter((c) => c.category === "monthly" && c.completed).length}/
                {challenges.filter((c) => c.category === "monthly").length}
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#191d23] mb-4">
            {filteredChallenges.length} {challengeFilter !== "all" ? challengeFilter : ""} Challenges
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`bg-white rounded-xl overflow-hidden shadow-sm border border-[#e2e8f0] hover:shadow-md transition-all duration-300 ${
                  animateItems ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${challenge.id * 50}ms` }}
              >
                <div className={`bg-gradient-to-r ${challenge.color} h-2`}></div>
                <div className="p-5">
                  <div className="flex items-start">
                    <div
                      className={`w-14 h-14 bg-gradient-to-b ${challenge.color} rounded-xl flex items-center justify-center text-2xl mr-4 shrink-0`}
                    >
                      <span className="text-white">{challenge.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-[#191d23] text-lg">{challenge.name}</h3>
                        <div
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor[challenge.difficulty as keyof typeof difficultyColor]} ${difficultyBgColor[challenge.difficulty as keyof typeof difficultyBgColor]} capitalize`}
                        >
                          {challenge.difficulty}
                        </div>
                      </div>
                      <p className="text-sm text-[#64748b] mt-1 line-clamp-2">{challenge.description}</p>

                      {challenge.completed ? (
                        <div className="flex items-center mt-3 text-xs text-[#57e371]">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Completed {challenge.completedDate}
                        </div>
                      ) : challenge.progress && challenge.progress > 0 ? (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-[#a0abbb] mb-1">
                            <span>Progress</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-[#f5f7fb] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${challenge.color}`}
                              style={{ width: `${challenge.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center mt-3 text-xs text-[#a0abbb]">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          Time left: {challenge.timeLeft}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs font-medium bg-[#e3dbfe] text-[#704ee7] px-2 py-1 rounded-full">
                      {challenge.reward}
                    </div>
                    {!challenge.completed && (
                      <Link
                        href={`/dashboard/challenges/${challenge.id}`}
                        className="text-xs text-[#64748b] flex items-center hover:text-[#704ee7] transition-colors"
                      >
                        Start Now <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No challenges found */}
        {filteredChallenges.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-[#e2e8f0]">
            <div className="w-16 h-16 bg-[#f5f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-[#64748b]" />
            </div>
            <h3 className="text-lg font-bold text-[#191d23] mb-2">No challenges found</h3>
            <p className="text-[#64748b] mb-4">No challenges match your current filters.</p>
            <button
              onClick={() => {
                setChallengeFilter("all")
                setDifficultyFilter("all")
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
      <div className="w-[300px] bg-white p-6 hidden lg:block sticky top-0 h-screen ">
        <h2 className="text-xl font-bold text-[#191d23] mb-6">Challenge Stats</h2>

        {/* XP Earned */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-[#64748b]">XP from Challenges</div>
            <div className="text-xl font-bold text-[#191d23]">1,250</div>
          </div>
          <div className="h-2 bg-[#f5f7fb] rounded-full overflow-hidden">
            <div className="h-full bg-[#704ee7] rounded-full" style={{ width: "65%" }}></div>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-[#a0abbb]">This Month</span>
            <span className="text-[#a0abbb]">1,250 / 2,000 XP</span>
          </div>
        </div>

        {/* Challenge Categories */}
        <div className="mb-6">
          <div className="text-lg font-bold text-[#191d23] mb-4">Categories</div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#f5f7fb] rounded-lg hover:bg-[#f0eefe] transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#f0c332] bg-opacity-20 flex items-center justify-center mr-3">
                  <Zap className="w-4 h-4 text-[#f0c332]" />
                </div>
                <div className="text-sm text-[#191d23]">Daily</div>
              </div>
              <div className="text-sm font-medium text-[#64748b]">
                {challenges.filter((c) => c.category === "daily").length}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#f5f7fb] rounded-lg hover:bg-[#f0eefe] transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#57e371] bg-opacity-20 flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 text-[#57e371]" />
                </div>
                <div className="text-sm text-[#191d23]">Weekly</div>
              </div>
              <div className="text-sm font-medium text-[#64748b]">
                {challenges.filter((c) => c.category === "weekly").length}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#f5f7fb] rounded-lg hover:bg-[#f0eefe] transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#3874ff] bg-opacity-20 flex items-center justify-center mr-3">
                  <TrendingUp className="w-4 h-4 text-[#3874ff]" />
                </div>
                <div className="text-sm text-[#191d23]">Monthly</div>
              </div>
              <div className="text-sm font-medium text-[#64748b]">
                {challenges.filter((c) => c.category === "monthly").length}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Challenges */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#191d23]">Upcoming</h3>
            <button className="text-[#704ee7] text-sm">View All</button>
          </div>

          <div className="space-y-3">
            {challenges
              .filter((c) => !c.completed && c.timeLeft === "Tomorrow")
              .slice(0, 2)
              .map((challenge) => (
                <div key={challenge.id} className="bg-[#f5f7fb] p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-b ${challenge.color} rounded-lg flex items-center justify-center text-base shrink-0`}
                    >
                      <span className="text-white">{challenge.icon}</span>
                    </div>
                    <div>
                      <div className="font-medium text-[#191d23] text-sm">{challenge.name}</div>
                      <div className="text-xs text-[#a0abbb] flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Available {challenge.timeLeft}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-bold text-[#191d23] mb-4">Recent Activity</h3>

          <div className="space-y-4">
            {challenges
              .filter((c) => c.completed)
              .slice(0, 3)
              .map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-start gap-3 group hover:bg-[#f5f7fb] p-2 rounded-lg transition-colors"
                >
                  <div className="bg-[#e3dbfe] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-[#704ee7]" />
                  </div>
                  <div>
                    <div className="font-medium text-[#191d23] text-sm group-hover:text-[#704ee7] transition-colors">
                      Completed "{challenge.name}"
                    </div>
                    <div className="text-xs text-[#a0abbb]">{challenge.completedDate}</div>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              href="/dashboard/achievements"
              className="flex items-center justify-center w-full p-3 text-[#704ee7] border border-[#e3dbfe] bg-[#f8f7fe] rounded-lg hover:bg-[#e3dbfe] transition-colors"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              View Achievements
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
