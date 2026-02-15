"use client";

import { AddBookmarkForm } from "@/components/add-bookmark";
import BookmarksList from "@/components/bookmarksList";
import Loader from "@/components/loader";
import { Navbar } from "@/components/navbar";
import { createSupabaseBrowserClient } from "@/config/supabaseBrowserClient";
import { useEffect, useState } from "react";

const Home = () => {
  const [user, setUser] = useState(null)
  const [supabase, setSupabase] = useState(createSupabaseBrowserClient())

  useEffect(() => {

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null)
      })()
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      );
    }


    return (
      <>
        <Navbar
          user={user}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AddBookmarkForm/>
          <div className="text-2xl font-semibold text-white mt-[60px]">
            Bookmarks....
          </div>
          <BookmarksList supabase={supabase}/>
        </div>
      </>
    );
  };
  
  export default Home;
  