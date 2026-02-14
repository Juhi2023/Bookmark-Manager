"use client";

import { AddBookmarkForm } from "@/components/add-bookmark";
import Loader from "@/components/loader";
import { Navbar } from "@/components/navbar";
import { createSupabaseBrowserClient } from "@/config/supabaseBrowserClient";
import { useEffect, useState } from "react";

const Home = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {

    const getUser = async () => {
      const { data: { user } } = await createSupabaseBrowserClient.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: { subscription } } = createSupabaseBrowserClient.auth.onAuthStateChange((_event, session) => {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AddBookmarkForm/>
        </div>
      </>
    );
  };
  
  export default Home;
  