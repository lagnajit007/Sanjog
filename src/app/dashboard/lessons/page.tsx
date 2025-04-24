import Link from "next/link"
import { BookOpen, Trophy, Search, ChevronRight } from "lucide-react"

export default function LessonsPage() {
  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      {/* Left Sidebar - Removed to prevent double implementation */}
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#191d23]">Lessons</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748b] w-5 h-5" />
            <input
              type="text"
              placeholder="Search lessons..."
              className="pl-10 pr-4 py-2 border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories as tags/buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-[#e3dbfe] text-[#704ee7] rounded-lg font-medium">All Lessons</button>
            <button className="px-4 py-2 bg-white border border-[#d0d5dd] text-[#64748b] rounded-lg hover:border-[#704ee7] hover:text-[#704ee7] transition-colors">
              Alphabets
            </button>
            <button className="px-4 py-2 bg-white border border-[#d0d5dd] text-[#64748b] rounded-lg hover:border-[#704ee7] hover:text-[#704ee7] transition-colors">
              Numbers
            </button>
            <button className="px-4 py-2 bg-white border border-[#d0d5dd] text-[#64748b] rounded-lg hover:border-[#704ee7] hover:text-[#704ee7] transition-colors">
              Common Words
            </button>
            <button className="px-4 py-2 bg-white border border-[#d0d5dd] text-[#64748b] rounded-lg hover:border-[#704ee7] hover:text-[#704ee7] transition-colors">
              Phrases
            </button>
            <button className="px-4 py-2 bg-white border border-[#d0d5dd] text-[#64748b] rounded-lg hover:border-[#704ee7] hover:text-[#704ee7] transition-colors">
              Conversations
            </button>
          </div>
        </div>

        {/* Today's Lesson CTA */}
        <div className="bg-gradient-to-r from-[#704ee7] to-[#684ad6] rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="text-white text-sm font-medium mb-2">TODAY'S LESSON</div>
              <h2 className="text-white text-2xl font-bold mb-2">Learn to Sign "Hello"</h2>
              <p className="text-white text-opacity-80">Practice one of the most common greetings in sign language.</p>
            </div>
            <Link
              href="/dashboard/lessons/interactive"
              className="bg-white text-[#704ee7] px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2"
            >
              Start Today's Lesson
              <div className="bg-[#704ee7] rounded-full w-6 h-6 flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-white" />
              </div>
            </Link>
          </div>
        </div>

        {/* Content section - now full width */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl mb-6">
            <h2 className="text-lg font-bold text-[#191d23] mb-4">Popular Lessons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/dashboard/lessons/alphabets/a"
                className="flex items-center p-3 border border-[#d0d5dd] rounded-lg hover:border-[#704ee7] transition-colors"
              >
                <div className="bg-[#ffe9ac] w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-[#ff2600] text-xl font-bold">A</span>
                </div>
                <div>
                  <div className="font-medium text-[#191d23]">Letter A</div>
                  <div className="text-xs text-[#a0abbb]">Beginner • 2 min</div>
                </div>
              </Link>

              <Link
                href="/dashboard/lessons/numbers/1"
                className="flex items-center p-3 border border-[#d0d5dd] rounded-lg hover:border-[#704ee7] transition-colors"
              >
                <div className="bg-[#e2eaff] w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-[#3874ff] text-xl font-bold">1</span>
                </div>
                <div>
                  <div className="font-medium text-[#191d23]">Number 1</div>
                  <div className="text-xs text-[#a0abbb]">Beginner • 2 min</div>
                </div>
              </Link>

              <Link
                href="/dashboard/lessons/common-words/hello"
                className="flex items-center p-3 border border-[#d0d5dd] rounded-lg hover:border-[#704ee7] transition-colors"
              >
                <div className="bg-[#d5cfff] w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-[#684ad6] text-xl font-bold">Hi</span>
                </div>
                <div>
                  <div className="font-medium text-[#191d23]">Hello</div>
                  <div className="text-xs text-[#a0abbb]">Beginner • 3 min</div>
                </div>
              </Link>

              <Link
                href="/dashboard/lessons/common-words/thank-you"
                className="flex items-center p-3 border border-[#d0d5dd] rounded-lg hover:border-[#704ee7] transition-colors"
              >
                <div className="bg-[#57e371] bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-[#57e371] text-xl font-bold">Ty</span>
                </div>
                <div>
                  <div className="font-medium text-[#191d23]">Thank You</div>
                  <div className="text-xs text-[#a0abbb]">Beginner • 3 min</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl">
            <h2 className="text-lg font-bold text-[#191d23] mb-4">Learning Paths</h2>
            <div className="space-y-4">
              <Link
                href="/dashboard/lessons/alphabets"
                className="block p-4 border border-[#d0d5dd] rounded-lg hover:border-[#704ee7] transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-[#191d23]">Alphabets (A-Z)</div>
                  <div className="text-xs bg-[#e3dbfe] text-[#704ee7] px-2 py-1 rounded-full">26 Lessons</div>
                </div>
                <p className="text-sm text-[#64748b] mb-3">Learn to sign all 26 letters of the alphabet.</p>
                <div className="w-full bg-[#f5f7fb] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#704ee7] h-full rounded-full" style={{ width: "15%" }}></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-[#a0abbb]">Progress</div>
                  <div className="text-xs font-medium text-[#704ee7]">15%</div>
                </div>
              </Link>

              <Link
                href="/dashboard/lessons/numbers"
                className="block p-4 border border-[#d0d5dd] rounded-lg hover:border-[#704ee7] transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-[#191d23]">Numbers (0-9)</div>
                  <div className="text-xs bg-[#e2eaff] text-[#3874ff] px-2 py-1 rounded-full">10 Lessons</div>
                </div>
                <p className="text-sm text-[#64748b] mb-3">Learn to sign numbers from 0 to 9.</p>
                <div className="w-full bg-[#f5f7fb] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#3874ff] h-full rounded-full" style={{ width: "30%" }}></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-[#a0abbb]">Progress</div>
                  <div className="text-xs font-medium text-[#3874ff]">30%</div>
                </div>
              </Link>

              <Link
                href="/dashboard/lessons/common-words"
                className="block p-4 border border-[#d0d5dd] rounded-lg hover:border-[#704ee7] transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-[#191d23]">Common Words</div>
                  <div className="text-xs bg-[#57e371] bg-opacity-20 text-[#57e371] px-2 py-1 rounded-full">
                    20 Lessons
                  </div>
                </div>
                <p className="text-sm text-[#64748b] mb-3">
                  Learn to sign frequently used words in everyday conversations.
                </p>
                <div className="w-full bg-[#f5f7fb] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#57e371] h-full rounded-full" style={{ width: "5%" }}></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-[#a0abbb]">Progress</div>
                  <div className="text-xs font-medium text-[#57e371]">5%</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[300px] bg-white p-6 hidden lg:block sticky top-0 h-screen">
        <h2 className="text-xl font-bold text-[#191d23] mb-6">Your Progress</h2>

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
                strokeDashoffset="240"
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
                15%
              </text>
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#f5f7fb] p-3 rounded-lg">
            <div className="text-sm text-[#64748b]">Completed</div>
            <div className="text-xl font-bold text-[#191d23]">12</div>
            <div className="text-xs text-[#a0abbb]">Lessons</div>
          </div>

          <div className="bg-[#f5f7fb] p-3 rounded-lg">
            <div className="text-sm text-[#64748b]">Remaining</div>
            <div className="text-xl font-bold text-[#191d23]">68</div>
            <div className="text-xs text-[#a0abbb]">Lessons</div>
          </div>

          <div className="bg-[#f5f7fb] p-3 rounded-lg">
            <div className="text-sm text-[#64748b]">Streak</div>
            <div className="text-xl font-bold text-[#191d23]">7</div>
            <div className="text-xs text-[#a0abbb]">Days</div>
          </div>

          <div className="bg-[#f5f7fb] p-3 rounded-lg">
            <div className="text-sm text-[#64748b]">Time Spent</div>
            <div className="text-xl font-bold text-[#191d23]">3.5</div>
            <div className="text-xs text-[#a0abbb]">Hours</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-bold text-[#191d23] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-[#e3dbfe] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <BookOpen className="w-4 h-4 text-[#704ee7]" />
              </div>
              <div>
                <div className="font-medium text-[#191d23]">Completed "Letter A"</div>
                <div className="text-xs text-[#a0abbb]">2 hours ago</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#e3dbfe] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Trophy className="w-4 h-4 text-[#704ee7]" />
              </div>
              <div>
                <div className="font-medium text-[#191d23]">Earned "First Step" badge</div>
                <div className="text-xs text-[#a0abbb]">Yesterday</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#e3dbfe] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <BookOpen className="w-4 h-4 text-[#704ee7]" />
              </div>
              <div>
                <div className="font-medium text-[#191d23]">Completed "Number 1"</div>
                <div className="text-xs text-[#a0abbb]">Yesterday</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
