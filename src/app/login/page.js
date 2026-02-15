"use client";

import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { MdBookmarks } from "react-icons/md";
import Loader from "@/components/loader";
import { useSupabase } from "@/components/supabase-provider";

function Login() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabase();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false); // ✅ stop loading after checking
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-md mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-slate-900 rounded-full">
            <MdBookmarks fontSize={'25px'} color="white" />

            </div>
          </div>
          <div className="text-3xl font-bold">Smart Bookmarks</div>
          <div className="text-base">
            Save and organize your favorite links in one place
          </div>
        </div>

        <Auth
          supabaseClient={supabase}
          providers={["google"]}
          onlyThirdPartyProviders
          appearance={{ theme: ThemeSupa }}
          
        />

        <p className="text-sm text-muted-foreground text-center mt-4">
          Let's start saving your bookmarks
        </p>
      </div>
    </div>
  );
}

export default Login;
