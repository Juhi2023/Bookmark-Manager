'use client'

import { HiOutlineLogout, HiUser } from "react-icons/hi";
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";
import { MdBookmarks } from "react-icons/md";
import { useSupabase } from "./supabase-provider";

export function Navbar({ user }) {
  const router = useRouter()
  const supabase = useSupabase();

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    toast.success('Signed out successfully')
  }

  const userInitials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'Juhi'

  return (
    <nav className="sticky top-0 z-50 w-full bg-white backdrop-blur-md border-b border-gray-200 py-2">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex  items-center gap-2">
            <div className="flex justify-center my-auto">
              <div className="p-2 bg-slate-900 rounded-full">
                <MdBookmarks fontSize={'20px'} color="white" />
              </div>
            </div>
            <span className="font-bold text-xl">Bookmark Manager</span>
          </div>
          <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-gray-700">
                  {user.user_metadata?.full_name || "User"}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {user.email}
                </span>
              </div>

              <div className="h-9 w-9 relative rounded-full ring-2 ring-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <HiUser className="w-5 h-5 text-gray-400" />
                )}
              </div>
              

              <div className="h-6 w-px bg-gray-200 mx-1"></div>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 flex items-center gap-2 shrink-0 w-[100px] hover:text-red-600 hover:text-gray-900 cursor-pointer"
              >
                <HiOutlineLogout className="w-5 h-5" />
                Log Out
              </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
