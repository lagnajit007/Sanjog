"use client"

import Image from "next/image"
import Link from "next/link"
import { Bell, Settings, ChevronRight } from "lucide-react"
import { useState } from "react"

type NotificationSettingsType = {
  allDiscussions: boolean;
  mentions: boolean;
  events: boolean;
}

interface RightSidebarProps {
  notificationSettings?: NotificationSettingsType;
  onNotificationToggle?: (setting: keyof NotificationSettingsType) => void;
}

export default function RightSidebar({ 
  notificationSettings = {
    allDiscussions: true,
    mentions: true,
    events: true
  },
  onNotificationToggle
}: RightSidebarProps) {
  
  // Handle notification toggle with fallback if not provided
  const handleToggle = (setting: keyof NotificationSettingsType) => {
    if (onNotificationToggle) {
      onNotificationToggle(setting);
    }
  };
  
  return (
    <div className="w-[300px] bg-white p-6 hidden lg:block">
      <h2 className="text-xl font-bold text-[#191d23] mb-6">Community Hub</h2>

      {/* User Stats */}
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#f0c332]">
              <Image
                src="/Avatar.png"
                alt="User"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#f0c332] rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-xs">10</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-[#191d23] mb-1">Jenny Wilson</h3>
          <p className="text-sm text-[#a0abbb]">Active Member • Joined 3 months ago</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#f5f7fb] p-2 rounded-lg">
            <div className="text-lg font-bold text-[#191d23]">12</div>
            <div className="text-xs text-[#a0abbb]">Posts</div>
          </div>
          <div className="bg-[#f5f7fb] p-2 rounded-lg">
            <div className="text-lg font-bold text-[#191d23]">35</div>
            <div className="text-xs text-[#a0abbb]">Comments</div>
          </div>
          <div className="bg-[#f5f7fb] p-2 rounded-lg">
            <div className="text-lg font-bold text-[#191d23]">3</div>
            <div className="text-xs text-[#a0abbb]">Groups</div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#191d23]">Notification Settings</h3>
          <Settings className="w-4 h-4 text-[#64748b]" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#704ee7]" />
              <span className="text-sm text-[#64748b]">All Discussions</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationSettings.allDiscussions}
                onChange={() => handleToggle('allDiscussions')} 
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#704ee7]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#704ee7]" />
              <span className="text-sm text-[#64748b]">Mentions</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationSettings.mentions}
                onChange={() => handleToggle('mentions')} 
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#704ee7]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#704ee7]" />
              <span className="text-sm text-[#64748b]">Events</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationSettings.events}
                onChange={() => handleToggle('events')} 
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#704ee7]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div>
        <h3 className="text-sm font-bold text-[#191d23] mb-4">Trending Topics</h3>

        <div className="space-y-3">
          <Link href="/dashboard/community/tag/alphabet" className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#e3dbfe] flex items-center justify-center">
                <span className="text-[#704ee7] text-xs">#</span>
              </div>
              <div>
                <div className="text-sm text-[#191d23] group-hover:text-[#704ee7]">alphabet</div>
                <div className="text-xs text-[#a0abbb]">32 discussions</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748b] group-hover:text-[#704ee7]" />
          </Link>

          <Link href="/dashboard/community/tag/practice" className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#e3dbfe] flex items-center justify-center">
                <span className="text-[#704ee7] text-xs">#</span>
              </div>
              <div>
                <div className="text-sm text-[#191d23] group-hover:text-[#704ee7]">practice</div>
                <div className="text-xs text-[#a0abbb]">28 discussions</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748b] group-hover:text-[#704ee7]" />
          </Link>

          <Link href="/dashboard/community/tag/beginners" className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#e3dbfe] flex items-center justify-center">
                <span className="text-[#704ee7] text-xs">#</span>
              </div>
              <div>
                <div className="text-sm text-[#191d23] group-hover:text-[#704ee7]">beginners</div>
                <div className="text-xs text-[#a0abbb]">24 discussions</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748b] group-hover:text-[#704ee7]" />
          </Link>
        </div>
      </div>
    </div>
  )
} 