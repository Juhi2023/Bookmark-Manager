"use client";

import { createContext, useContext, useState } from "react";
import { createSupabaseBrowserClient } from "@/config/supabaseBrowserClient";

const SupabaseContext = createContext(undefined);

export default function SupabaseProvider({ children }) {
  const [supabase] = useState(() => createSupabaseBrowserClient());

  return (
    <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  return useContext(SupabaseContext);
};