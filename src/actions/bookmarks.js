"use server";

import { createSupabaseServerClient } from "@/config/supabaseServerClient";

export async function addBookmark({url, title}) {
  if (!url || !title) {
    throw new Error("URL and title are required");
  }

  const supabase = await createSupabaseServerClient();

  // Check user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in");
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: user.id,
      url,
      title,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add bookmark: ${error.message}`);
  }
  return data;
}



export async function getBookmarks() {

  const supabase = await createSupabaseServerClient();
  // Check user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("You must be logged in");
  }

  try{
    const data = await supabase
            .from('bookmarks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
    return data;
  }catch (error) {
    throw new Error(`Failed to add bookmark: ${error.message}`);
  }
}

export async function deleteBookmark(id) {
  const supabase = await createSupabaseServerClient();
  // Check user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("You must be logged in");
  }


  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // extra safety: ensure user owns it

  if (error) {
    throw new Error(`Failed to delete bookmark: ${error.message}`);
  }
}