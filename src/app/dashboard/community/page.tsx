"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Users,
  Search,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  Filter,
  Bell,
  Settings,
  Plus,
  Clock,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    allDiscussions: true,
    mentions: true,
    events: true
  })
  const [categoryPage, setCategoryPage] = useState(0)
  const categoriesPerPage = 3

  // Community discussion data
  const discussions = [
    {
      id: 1,
      title: "Tips for learning the alphabet signs faster?",
      content:
        "I'm struggling to remember all the alphabet signs. Does anyone have any good memory techniques or practice strategies they can share?",
      author: {
        name: "Alex Johnson",
        avatar: "/Avatar.png",
        level: 8,
      },
      category: "learning-tips",
      tags: ["alphabet", "beginners", "memory-techniques"],
      comments: 12,
      likes: 24,
      createdAt: "2 hours ago",
      isPopular: true,
    },
    {
      id: 2,
      title: "Weekly challenge: Record yourself signing a simple sentence",
      content:
        "This week's community challenge is to record yourself signing a simple sentence using the signs we've learned so far. Share your videos and get feedback!",
      author: {
        name: "Sarah Miller",
        avatar: "/Avatar.png",
        level: 15,
        isModerator: true,
      },
      category: "challenges",
      tags: ["practice", "community-challenge", "video"],
      comments: 32,
      likes: 45,
      createdAt: "1 day ago",
      isPinned: true,
    },
    {
      id: 3,
      title: "Just completed all number signs! Here's what helped me",
      content:
        "After two weeks of practice, I finally mastered all the number signs from 0-9! I wanted to share some of the practice techniques that really helped me...",
      author: {
        name: "David Chen",
        avatar: "/Avatar.png",
        level: 10,
      },
      category: "success-stories",
      tags: ["numbers", "achievement", "practice-methods"],
      comments: 8,
      likes: 19,
      createdAt: "2 days ago",
    },
    {
      id: 4,
      title: "Difference between ASL and BSL - good resources to understand both?",
      content:
        "I'm learning ASL through Sanjog, but I have friends who use BSL. Can anyone recommend good resources to understand the differences?",
      author: {
        name: "Emma Watson",
        avatar: "/Avatar.png",
        level: 12,
      },
      category: "resources",
      tags: ["ASL", "BSL", "comparison"],
      comments: 15,
      likes: 13,
      createdAt: "3 days ago",
    },
    {
      id: 5,
      title: "Struggling with hand positioning for letters J and Z",
      content:
        "I'm having trouble with the movement required for letters J and Z. My hand positioning feels awkward. Does anyone have tips or videos showing the correct form?",
      author: {
        name: "Michael Brown",
        avatar: "/Avatar.png",
        level: 6,
      },
      category: "help-needed",
      tags: ["alphabet", "technique", "help"],
      comments: 20,
      likes: 8,
      createdAt: "1 week ago",
    },
  ]

  // Community events data
  const events = [
    {
      id: 1,
      title: "Live Practice Session - Common Greetings",
      description:
        "Join our expert instructor for a live practice session focusing on common greetings and conversational phrases.",
      date: "June 15, 2023",
      time: "7:00 PM - 8:00 PM EST",
      attendees: 56,
      image: "/Avatar.png",
      host: "Maria Rodriguez",
      isUpcoming: true,
    },
    {
      id: 2,
      title: "Q&A with a Deaf Community Member",
      description:
        "An opportunity to ask questions and learn from someone who uses sign language every day. Great for cultural understanding.",
      date: "June 20, 2023",
      time: "6:30 PM - 8:00 PM EST",
      attendees: 42,
      image: "/Avatar.png",
      host: "James Wilson",
      isUpcoming: true,
    },
    {
      id: 3,
      title: "Sign Language Movie Club: 'CODA' Discussion",
      description:
        "Let's watch CODA and discuss it together! Practice signing while talking about this award-winning film.",
      date: "June 25, 2023",
      time: "8:00 PM - 10:00 PM EST",
      attendees: 38,
      image: "/Avatar.png",
      host: "Taylor Swift",
      isUpcoming: true,
    },
  ]

  // Popular groups data
  const groups = [
    {
      id: 1,
      name: "Beginner's Circle",
      description: "A supportive community for those just starting their sign language journey.",
      members: 342,
      image: "/Avatar.png",
      activity: "Very Active",
    },
    {
      id: 2,
      name: "Sign Language for Kids",
      description: "Parents and educators sharing resources for teaching sign language to children.",
      members: 218,
      image: "/Avatar.png",
      activity: "Active",
    },
    {
      id: 3,
      name: "Professional Interpreters",
      description: "Discussion group for those using sign language professionally or aspiring to do so.",
      members: 156,
      image: "/Avatar.png",
      activity: "Moderate",
    },
  ]

  // Categories
  const categories = [
    { id: "all", name: "All Topics", count: discussions.length },
    {
      id: "learning-tips",
      name: "Learning Tips",
      count: discussions.filter((d) => d.category === "learning-tips").length,
    },
    { id: "help-needed", name: "Help Needed", count: discussions.filter((d) => d.category === "help-needed").length },
    {
      id: "success-stories",
      name: "Success Stories",
      count: discussions.filter((d) => d.category === "success-stories").length,
    },
    { id: "resources", name: "Resources", count: discussions.filter((d) => d.category === "resources").length },
    { id: "challenges", name: "Challenges", count: discussions.filter((d) => d.category === "challenges").length },
  ]

  // Filter discussions based on selected category
  const filteredDiscussions =
    selectedCategory === "all"
      ? discussions
      : discussions.filter((discussion) => discussion.category === selectedCategory)

  // Handler for notification toggles
  const handleNotificationToggle = (setting: 'allDiscussions' | 'mentions' | 'events') => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#191d23] mb-1">Community</h1>
          <p className="text-[#64748b]">Connect, learn, and share with fellow sign language learners</p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748b] w-5 h-5" />
            <input
              type="text"
              placeholder="Search discussions..."
              className="pl-10 pr-4 py-2 border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent w-full md:w-64"
            />
          </div>

          <Link
            href="/dashboard/community/new"
            className="p-2 bg-[#704ee7] text-white rounded-lg hover:bg-[#684ad6] flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-t-xl p-1 flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("discussions")}
          className={`flex-1 py-3 text-sm font-medium rounded-lg ${
            activeTab === "discussions" ? "bg-[#e3dbfe] text-[#704ee7]" : "text-[#64748b] hover:bg-gray-100"
          }`}
        >
          Discussions
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`flex-1 py-3 text-sm font-medium rounded-lg ${
            activeTab === "events" ? "bg-[#e3dbfe] text-[#704ee7]" : "text-[#64748b] hover:bg-gray-100"
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`flex-1 py-3 text-sm font-medium rounded-lg ${
            activeTab === "groups" ? "bg-[#e3dbfe] text-[#704ee7]" : "text-[#64748b] hover:bg-gray-100"
          }`}
        >
          Groups
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="bg-white rounded-b-xl p-6">
        {/* Discussions Tab */}
        {activeTab === "discussions" && (
          <div>
            {/* Categories */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center justify-between w-full mb-4">
                <button 
                  onClick={() => setCategoryPage(prev => Math.max(0, prev - 1))}
                  className={`p-2 rounded-full hover:bg-gray-100 ${categoryPage === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                  disabled={categoryPage === 0}
                >
                  <ChevronLeft className="w-5 h-5 text-[#64748b]" />
                </button>
                
                <div className="flex items-center gap-3">
                  {categories.slice(categoryPage * categoriesPerPage, (categoryPage + 1) * categoriesPerPage).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                        selectedCategory === category.id
                          ? "bg-[#704ee7] text-white"
                          : "bg-[#f5f7fb] text-[#64748b] hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-xs ${
                          selectedCategory === category.id
                            ? "bg-white bg-opacity-20 text-white"
                            : "bg-white text-[#64748b]"
                        }`}
                      >
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCategoryPage(prev => Math.min(Math.ceil(categories.length / categoriesPerPage) - 1, prev + 1))}
                    className={`p-2 rounded-full hover:bg-gray-100 ${
                      categoryPage >= Math.ceil(categories.length / categoriesPerPage) - 1 ? 'opacity-30 cursor-not-allowed' : ''
                    }`}
                    disabled={categoryPage >= Math.ceil(categories.length / categoriesPerPage) - 1}
                  >
                    <ChevronRight className="w-5 h-5 text-[#64748b]" />
                  </button>
                  
                  <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="p-2 bg-[#f5f7fb] rounded-lg hover:bg-gray-200 flex items-center justify-center"
                  >
                    <Filter className="w-5 h-5 text-[#64748b]" />
                  </button>
                </div>
              </div>
              
              {/* Pagination dots */}
              <div className="flex items-center gap-2 mt-1">
                {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }).map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCategoryPage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      categoryPage === index 
                        ? "bg-[#704ee7] w-6" 
                        : "bg-[#e3dbfe]"
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Filter panel */}
            {filtersOpen && (
              <div className="bg-[#f5f7fb] rounded-xl p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#191d23] mb-2">Sort By</div>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 rounded-md text-sm bg-[#704ee7] text-white">Newest</button>
                      <button className="px-3 py-1.5 rounded-md text-sm bg-white text-[#64748b] hover:bg-gray-200">
                        Most Popular
                      </button>
                      <button className="px-3 py-1.5 rounded-md text-sm bg-white text-[#64748b] hover:bg-gray-200">
                        Most Comments
                      </button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#191d23] mb-2">Time Period</div>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 rounded-md text-sm bg-[#704ee7] text-white">All Time</button>
                      <button className="px-3 py-1.5 rounded-md text-sm bg-white text-[#64748b] hover:bg-gray-200">
                        Today
                      </button>
                      <button className="px-3 py-1.5 rounded-md text-sm bg-white text-[#64748b] hover:bg-gray-200">
                        This Week
                      </button>
                      <button className="px-3 py-1.5 rounded-md text-sm bg-white text-[#64748b] hover:bg-gray-200">
                        This Month
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Discussions List */}
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className={`border border-gray-100 hover:border-[#704ee7] rounded-xl p-5 transition-colors ${
                    discussion.isPinned ? "bg-[#f5f7fb]" : "bg-white"
                  }`}
                >
                  {discussion.isPinned && (
                    <div className="bg-[#704ee7] text-white text-xs px-2 py-1 rounded-full inline-block mb-3">
                      Pinned by Moderator
                    </div>
                  )}
                  {discussion.isPopular && (
                    <div className="bg-[#f0c332] text-white text-xs px-2 py-1 rounded-full inline-block mb-3">
                      Hot Topic
                    </div>
                  )}

                  <Link href={`/dashboard/community/discussions/${discussion.id}`}>
                    <h3 className="text-lg font-bold text-[#191d23] hover:text-[#704ee7] mb-2">{discussion.title}</h3>
                  </Link>

                  <p className="text-[#64748b] mb-4 line-clamp-2">{discussion.content}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {discussion.tags.map((tag, index) => (
                      <Link
                        key={index}
                        href={`/dashboard/community/tag/${tag}`}
                        className="bg-[#e3dbfe] text-[#704ee7] text-xs px-2 py-1 rounded-full hover:bg-[#d5cfff]"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        <Image
                          src={discussion.author.avatar || "/Avatar.png"}
                          alt={discussion.author.name}
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-[#f0c332] text-xs text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
                          {discussion.author.level}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <div className="font-medium text-[#191d23] text-sm">{discussion.author.name}</div>
                          {discussion.author.isModerator && (
                            <div className="ml-2 bg-[#57e371] bg-opacity-20 text-[#57e371] text-xs px-2 py-0.5 rounded-full">
                              Mod
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-[#a0abbb]">{discussion.createdAt}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-[#64748b] text-sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {discussion.comments}
                      </div>
                      <div className="flex items-center text-[#64748b] text-sm">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {discussion.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-full hover:bg-gray-100">
                          <Bookmark className="w-4 h-4 text-[#64748b]" />
                        </button>
                        <button className="p-1.5 rounded-full hover:bg-gray-100">
                          <Share2 className="w-4 h-4 text-[#64748b]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredDiscussions.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#f5f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-[#64748b]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#191d23] mb-2">No discussions found</h3>
                  <p className="text-[#64748b] mb-4">Be the first to start a discussion on this topic!</p>
                  <Link
                    href="/dashboard/community/new"
                    className="px-4 py-2 bg-[#704ee7] text-white rounded-lg inline-block"
                  >
                    Start a New Discussion
                  </Link>
                </div>
              )}
            </div>

            {filteredDiscussions.length > 0 && (
              <div className="flex justify-center mt-6">
                <button className="px-4 py-2 border border-[#d0d5dd] text-[#64748b] rounded-lg hover:bg-gray-50">
                  Load More
                </button>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#191d23]">Upcoming Events</h2>
              <Link href="/dashboard/community/events/calendar" className="text-[#704ee7] text-sm flex items-center">
                View Calendar
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-100 rounded-xl overflow-hidden hover:border-[#704ee7] transition-colors"
                >
                  <div className="relative h-40 bg-gray-100">
                    <Image src={event.image || "/Avatar.png"} alt={event.title} fill className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <div className="bg-[#704ee7] text-white text-xs px-2 py-1 rounded-full inline-block">
                        Live Event
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <Link href={`/dashboard/community/events/${event.id}`}>
                      <h3 className="font-bold text-[#191d23] hover:text-[#704ee7] mb-2">{event.title}</h3>
                    </Link>

                    <p className="text-sm text-[#64748b] mb-3 line-clamp-2">{event.description}</p>

                    <div className="flex items-center text-xs text-[#a0abbb] mb-3">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {event.date} • {event.time}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {[1, 2, 3].map((num) => (
                            <div key={num} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                              <Image
                                src="/Avatar.png"
                                alt={`Attendee ${num}`}
                                width={24}
                                height={24}
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-[#64748b]">{event.attendees} attending</div>
                      </div>

                      <button className="text-xs font-medium bg-[#e3dbfe] text-[#704ee7] px-2 py-1 rounded-lg hover:bg-[#d5cfff]">
                        Attend
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Link
                href="/dashboard/community/events"
                className="px-4 py-2 border border-[#d0d5dd] text-[#64748b] rounded-lg hover:bg-gray-50"
              >
                See All Events
              </Link>
            </div>
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === "groups" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#191d23]">Popular Groups</h2>
              <Link href="/dashboard/community/groups/browse" className="text-[#704ee7] text-sm flex items-center">
                Browse All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-100 rounded-xl p-5 hover:border-[#704ee7] transition-colors"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg mr-3 overflow-hidden">
                      <Image
                        src={group.image || "/Avatar.png"}
                        alt={group.name}
                        width={60}
                        height={60}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#191d23]">{group.name}</h3>
                      <div className="flex items-center text-xs text-[#a0abbb]">
                        <Users className="w-3.5 h-3.5 mr-1" />
                        {group.members} members
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#64748b] mb-4 line-clamp-2">{group.description}</p>

                  <div className="flex items-center justify-between">
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        group.activity === "Very Active"
                          ? "bg-[#57e371] bg-opacity-20 text-[#57e371]"
                          : group.activity === "Active"
                            ? "bg-[#f0c332] bg-opacity-20 text-[#f0c332]"
                            : "bg-[#a0abbb] bg-opacity-20 text-[#a0abbb]"
                      }`}
                    >
                      {group.activity}
                    </div>

                    <button className="text-xs font-medium bg-[#e3dbfe] text-[#704ee7] px-3 py-1 rounded-lg hover:bg-[#d5cfff]">
                      Join Group
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link
                href="/dashboard/community/groups/create"
                className="px-4 py-2 bg-[#704ee7] text-white rounded-lg inline-block"
              >
                Create a New Group
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
