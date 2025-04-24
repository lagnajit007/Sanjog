"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Award,
  BookOpen,
  BarChart2,
  Filter,
  Download,
} from "lucide-react"

// Custom ProgressBar component
const ProgressBar = ({ value, max, color }: { value: number, max: number, color: string }) => {
  const percentage = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="h-2 bg-[#f5f7fb] rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  )
}

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Calculate date range for display
  const getDateRangeText = () => {
    const today = new Date(currentDate)
    const options = { month: "short", day: "numeric" }

    if (timeRange === "week") {
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      
    } else if (timeRange === "month") {
      return today.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    } else {
      return today.getFullYear().toString()
    }
  }

  // Navigation handler
  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate)

    if (timeRange === "week") {
      newDate.setDate(newDate.getDate() + direction * 7)
    } else if (timeRange === "month") {
      newDate.setMonth(newDate.getMonth() + direction)
    } else {
      newDate.setFullYear(newDate.getFullYear() + direction)
    }

    setCurrentDate(newDate)
  }

  // Activity data
  const activityData = [
    { day: "Mon", value: 35 },
    { day: "Tue", value: 60 },
    { day: "Wed", value: 45 },
    { day: "Thu", value: 80 },
    { day: "Fri", value: 65 },
    { day: "Sat", value: 90 },
    { day: "Sun", value: 30 },
  ]

  // Completion data
  const completionData = [
    { id: 1, name: "Alphabets", total: 26, completed: 14, color: "bg-[#704ee7]" },
    { id: 2, name: "Numbers", total: 10, completed: 8, color: "bg-[#3874ff]" },
    { id: 3, name: "Common Words", total: 50, completed: 12, color: "bg-[#57e371]" },
    { id: 4, name: "Phrases", total: 30, completed: 5, color: "bg-[#ff9160]" },
    { id: 5, name: "Greetings", total: 15, completed: 10, color: "bg-[#f0c332]" },
  ]

  // Weekly stats
  const weeklyStats = [
    { label: "XP Earned", value: 850, previousValue: 720, color: "text-[#704ee7]", icon: Award },
    { label: "Lessons Completed", value: 12, previousValue: 8, color: "text-[#57e371]", icon: BookOpen },
    { label: "Time Spent", value: "4h 20m", previousValue: "3h 45m", color: "text-[#f0c332]", icon: Clock },
    { label: "Accuracy", value: "87%", previousValue: "82%", color: "text-[#ff9160]", icon: BarChart2 },
  ]

  // Recent activity
  const recentActivity = [
    {
      id: 1,
      type: "lesson",
      name: "Completed Letter K",
      date: "Today",
      time: "2 hours ago",
      category: "alphabets",
      icon: BookOpen,
      color: "bg-[#e3dbfe]",
      iconColor: "text-[#704ee7]",
    },
    {
      id: 2,
      type: "practice",
      name: "Practiced Numbers 1-5",
      date: "Today",
      time: "4 hours ago",
      category: "numbers",
      icon: Clock,
      color: "bg-[#e2eaff]",
      iconColor: "text-[#3874ff]",
    },
    {
      id: 3,
      type: "achievement",
      name: "Earned 'Quick Learner' Badge",
      date: "Yesterday",
      time: "11:45 AM",
      category: "achievements",
      icon: Award,
      color: "bg-[#57e371] bg-opacity-20",
      iconColor: "text-[#57e371]",
    },
    {
      id: 4,
      type: "challenge",
      name: "Completed 'Alphabet Rush' Challenge",
      date: "Yesterday",
      time: "9:30 AM",
      category: "challenges",
      icon: TrendingUp,
      color: "bg-[#ffe9ac]",
      iconColor: "text-[#f0c332]",
    },
    {
      id: 5,
      type: "practice",
      name: "Practiced Common Greetings",
      date: "2 days ago",
      time: "3:15 PM",
      category: "phrases",
      icon: Clock,
      color: "bg-[#ff9160] bg-opacity-20",
      iconColor: "text-[#ff9160]",
    },
  ]

  // Filter recent activity
  const filteredActivity =
    selectedCategory === "all"
      ? recentActivity
      : recentActivity.filter((activity) => activity.category === selectedCategory)

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      {/* Left Sidebar */}
      {/* Remove duplicate sidebar component since it's already in layout */}
      {/* <Sidebar activePage="progress" /> */}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#191d23] mb-1">Your Progress</h1>
            <p className="text-[#64748b]">Track your learning journey and achievements</p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-2">
            <div className="bg-white rounded-lg p-1 flex gap-2">
              <button
                onClick={() => setTimeRange("week")}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  timeRange === "week" ? "bg-[#704ee7] text-white" : "text-[#64748b] hover:bg-gray-100"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange("month")}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  timeRange === "month" ? "bg-[#704ee7] text-white" : "text-[#64748b] hover:bg-gray-100"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange("year")}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  timeRange === "year" ? "bg-[#704ee7] text-white" : "text-[#64748b] hover:bg-gray-100"
                }`}
              >
                Year
              </button>
            </div>

            <button className="p-2 bg-white rounded-lg hover:bg-gray-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-[#64748b]" />
            </button>
          </div>
        </div>

        {/* Date navigation */}
        <div className="bg-white rounded-xl p-4 mb-6 flex items-center justify-between">
          <button onClick={() => navigateDate(-1)} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5 text-[#64748b]" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#704ee7]" />
            <span className="font-medium text-[#191d23]">{getDateRangeText()}</span>
          </div>

          <button onClick={() => navigateDate(1)} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-5 h-5 text-[#64748b]" />
          </button>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {weeklyStats.map((stat, index) => {
            const isIncreased = stat.value > stat.previousValue
            const percentChange =
              typeof stat.value === "number" && typeof stat.previousValue === "number"
                ? Math.round(((stat.value - stat.previousValue) / stat.previousValue) * 100)
                : null

            return (
              <div key={index} className="bg-white p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-[#64748b]">{stat.label}</div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#191d23] mb-2">{stat.value}</div>
                {percentChange !== null && (
                  <div className="flex items-center text-xs">
                    <div className={`flex items-center ${isIncreased ? "text-[#57e371]" : "text-[#ff6265]"} mr-2`}>
                      {isIncreased ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                      {Math.abs(percentChange)}%
                    </div>
                    <div className="text-[#a0abbb]">vs. previous {timeRange}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Activity Chart - Professional Curve */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#191d23]">Activity</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#704ee7] mr-2"></div>
                  <span className="text-sm text-[#64748b]">Time Spent (minutes)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#f0c332] mr-2"></div>
                  <span className="text-sm text-[#64748b]">Target</span>
                </div>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="w-full h-64 relative">
              {/* Grid Lines */}
              <div className="absolute inset-0">
                {[0, 1, 2, 3, 4].map((line) => (
                  <div 
                    key={line} 
                    className="absolute w-full h-px bg-gray-100" 
                    style={{ top: `${line * 25}%` }}
                  ></div>
                ))}
              </div>

              {/* Y-axis Labels */}
              <div className="absolute left-0 inset-y-0 w-10 flex flex-col justify-between text-xs text-[#64748b]">
                <div className="-mt-2">100</div>
                <div>75</div>
                <div>50</div>
                <div>25</div>
                <div className="-mb-2">0</div>
              </div>

              {/* Chart Area */}
              <div className="absolute left-10 right-0 top-0 bottom-0">
                <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="xMidYMid meet">
                  {/* Data Curve Path */}
                  <path
                    d={`M 0 ${200 - activityData[0].value * 2} 
                        C 100 ${200 - activityData[0].value * 2}, 
                        50 ${200 - activityData[1].value * 2}, 
                        116.67 ${200 - activityData[1].value * 2} 
                        C 183.33 ${200 - activityData[1].value * 2}, 
                        166.67 ${200 - activityData[2].value * 2}, 
                        233.33 ${200 - activityData[2].value * 2} 
                        C 300 ${200 - activityData[2].value * 2}, 
                        283.33 ${200 - activityData[3].value * 2}, 
                        350 ${200 - activityData[3].value * 2} 
                        C 416.67 ${200 - activityData[3].value * 2}, 
                        400 ${200 - activityData[4].value * 2}, 
                        466.67 ${200 - activityData[4].value * 2} 
                        C 533.33 ${200 - activityData[4].value * 2}, 
                        516.67 ${200 - activityData[5].value * 2}, 
                        583.33 ${200 - activityData[5].value * 2} 
                        C 650 ${200 - activityData[5].value * 2}, 
                        633.33 ${200 - activityData[6].value * 2}, 
                        700 ${200 - activityData[6].value * 2}`}
                    fill="none"
                    stroke="#704ee7"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Target Line */}
                  <path
                    d="M 0 100 L 700 100"
                    stroke="#f0c332"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />

                  {/* Data Points with Tooltips */}
                  {activityData.map((data, index) => (
                    <g key={index} transform={`translate(${index * 116.67 + (index === 0 ? 0 : 0)}, ${200 - data.value * 2})`}>
                      <circle 
                        cx="0" 
                        cy="0" 
                        r="4" 
                        fill="white" 
                        stroke="#704ee7" 
                        strokeWidth="1.5"
                        className="hover:opacity-90 transition-all cursor-pointer"
                      />
                      <title>{`${data.day}: ${data.value} minutes`}</title>
                    </g>
                  ))}

                  {/* Fill area under the curve */}
                  <path
                    d={`M 0 ${200 - activityData[0].value * 2} 
                        C 100 ${200 - activityData[0].value * 2}, 
                        50 ${200 - activityData[1].value * 2}, 
                        116.67 ${200 - activityData[1].value * 2} 
                        C 183.33 ${200 - activityData[1].value * 2}, 
                        166.67 ${200 - activityData[2].value * 2}, 
                        233.33 ${200 - activityData[2].value * 2} 
                        C 300 ${200 - activityData[2].value * 2}, 
                        283.33 ${200 - activityData[3].value * 2}, 
                        350 ${200 - activityData[3].value * 2} 
                        C 416.67 ${200 - activityData[3].value * 2}, 
                        400 ${200 - activityData[4].value * 2}, 
                        466.67 ${200 - activityData[4].value * 2} 
                        C 533.33 ${200 - activityData[4].value * 2}, 
                        516.67 ${200 - activityData[5].value * 2}, 
                        583.33 ${200 - activityData[5].value * 2} 
                        C 650 ${200 - activityData[5].value * 2}, 
                        633.33 ${200 - activityData[6].value * 2}, 
                        700 ${200 - activityData[6].value * 2}
                        L 700 200 L 0 200 Z`}
                    fill="url(#gradient)"
                    opacity="0.2"
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#704ee7" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#704ee7" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* X-axis Labels */}
              <div className="absolute left-10 right-0 bottom-0 flex justify-between text-xs text-[#64748b] translate-y-6">
                {activityData.map((data, index) => (
                  <div key={index} className="text-center">
                    {data.day}
                    <div className="text-xs font-medium mt-1 text-[#191d23]">{data.value}m</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Average */}
            <div className="mt-12 pt-4 border-t border-gray-100 flex justify-between text-sm">
              <div>
                <span className="text-[#64748b]">Daily Average: </span>
                <span className="font-medium text-[#191d23]">
                  {Math.round(activityData.reduce((acc, curr) => acc + curr.value, 0) / activityData.length)}m
                </span>
              </div>
              <div>
                <span className="text-[#64748b]">Target: </span>
                <span className="font-medium text-[#f0c332]">50m</span>
              </div>
              <div>
                <span className="text-[#64748b]">Best Day: </span>
                <span className="font-medium text-[#57e371]">
                  {activityData.reduce((max, data) => Math.max(max, data.value), 0)}m
                </span>
              </div>
            </div>
          </div>

          {/* Completion Progress */}
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#191d23] mb-6">Completion Progress</h2>

            <div className="space-y-6">
              {completionData.map((category) => {
                const percentage = Math.round((category.completed / category.total) * 100)

                return (
                  <div key={category.id}>
                    <div className="flex justify-between mb-2">
                      <div className="text-sm font-medium text-[#191d23]">{category.name}</div>
                      <div className="text-sm text-[#64748b]">
                        {category.completed}/{category.total} ({percentage}%)
                      </div>
                    </div>
                    <ProgressBar value={category.completed} max={category.total} color={category.color} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#191d23] mb-2 sm:mb-0">Recent Activity</h2>

            <div className="flex gap-2 items-center">
              <select
                className="bg-[#f5f7fb] border-0 rounded-lg px-3 py-2 text-sm text-[#64748b] focus:ring-2 focus:ring-[#704ee7]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Activities</option>
                <option value="alphabets">Alphabets</option>
                <option value="numbers">Numbers</option>
                <option value="phrases">Phrases & Words</option>
                <option value="achievements">Achievements</option>
                <option value="challenges">Challenges</option>
              </select>

              <button className="p-2 bg-[#f5f7fb] rounded-lg hover:bg-gray-200">
                <Filter className="w-5 h-5 text-[#64748b]" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div
                  className={`${activity.color} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-[#191d23]">{activity.name}</div>
                      <div className="text-xs text-[#a0abbb]">
                        {activity.date} • {activity.time}
                      </div>
                    </div>
                    <button className="text-xs text-[#64748b] hover:text-[#704ee7]">Details</button>
                  </div>
                </div>
              </div>
            ))}

            {filteredActivity.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#f5f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-[#64748b]" />
                </div>
                <h3 className="text-lg font-bold text-[#191d23] mb-2">No activities found</h3>
                <p className="text-[#64748b] mb-4">No activities match your current filter.</p>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="px-4 py-2 bg-[#704ee7] text-white rounded-lg"
                >
                  View All Activities
                </button>
              </div>
            )}

            {filteredActivity.length > 0 && (
              <div className="text-center pt-4">
                <button className="px-4 py-2 border border-[#d0d5dd] text-[#64748b] rounded-lg hover:bg-gray-50">
                  View More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Hexagonal with rounded corners */}
      <div className="w-[300px] hidden lg:block sticky top-0 h-screen overflow-hidden">
        <div className="bg-white h-full p-8 rounded-2xl relative" 
          style={{
            clipPath: "polygon(10% 0%, 90% 0%, 100% 25%, 100% 75%, 90% 100%, 10% 100%, 0% 75%, 0% 25%)",
            borderRadius: "12px",
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.05)"
          }}
        >
          <h2 className="text-xl font-bold text-[#191d23] mb-6">Learning Summary</h2>

          {/* Overall Progress Circle */}
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

          {/* Stats */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium text-[#191d23]">Total Lessons</div>
              <div>
                <span className="font-bold text-[#704ee7]">39</span>
                <span className="text-[#a0abbb]">/80</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium text-[#191d23]">Current Streak</div>
              <div className="font-bold text-[#f0c332] flex items-center">
                7 days
                <span className="ml-1">🔥</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium text-[#191d23]">Badges Earned</div>
              <div className="font-bold text-[#57e371]">6</div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-[#191d23]">Average Accuracy</div>
              <div className="font-bold text-[#ff9160]">85%</div>
            </div>
          </div>

          {/* Learning Recommendations */}
          <div>
            <h3 className="text-lg font-bold text-[#191d23] mb-4">Recommendations</h3>

            <div className="space-y-4">
              <div className="bg-[#f5f7fb] p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-[#704ee7]" />
                  <div className="font-medium text-[#191d23] text-sm">Practice Numbers</div>
                </div>
                <p className="text-xs text-[#64748b]">
                  Your accuracy with number signs has dropped. Practice to improve.
                </p>
                <Link
                  href="/dashboard/lessons/numbers"
                  className="text-xs text-[#704ee7] flex items-center mt-2 hover:underline"
                >
                  Practice Now <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              <div className="bg-[#f5f7fb] p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#57e371]" />
                  <div className="font-medium text-[#191d23] text-sm">Complete Challenge</div>
                </div>
                <p className="text-xs text-[#64748b]">
                  You're close to completing "Number Whiz" challenge. Just 3 more to go!
                </p>
                <Link
                  href="/dashboard/challenges"
                  className="text-xs text-[#704ee7] flex items-center mt-2 hover:underline"
                >
                  View Challenge <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
