"use client";

import { useEffect, useState, useRef } from "react";
import { deleteBookmark, getBookmarks } from "@/actions/bookmarks";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";

export default function BookmarksList({ user, supabase }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const channelRef = useRef(null);     // stores active channel
  const subscribedRef = useRef(false); // prevents duplicate subscription

  // -------------------------
  // Load Initial Data
  // -------------------------
  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const { data } = await getBookmarks();
      setBookmarks(data || []);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadBookmarks();
  }, [user]);

  // -------------------------
  // Stable Realtime Setup
  // -------------------------
  useEffect(() => {
    if (!user || !supabase) return;
    if (subscribedRef.current) return; // 🚫 prevent re-subscribing

    let isMounted = true;

    const setup = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !isMounted) return;

      const channel = supabase
        .channel(`bookmarks-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Realtime:", payload);

            setBookmarks((prev) => {
              if (payload.eventType === "INSERT") {
                if (prev.some((b) => b.id === payload.new.id)) return prev;
                return [payload.new, ...prev];
              }

              if (payload.eventType === "DELETE") {
                return prev.filter((b) => b.id !== payload.old.id);
              }

              if (payload.eventType === "UPDATE") {
                return prev.map((b) =>
                  b.id === payload.new.id ? payload.new : b
                );
              }

              return prev;
            });
          }
        )
        .subscribe((status) => {
          console.log("Realtime status:", status);
        });

      channelRef.current = channel;
      subscribedRef.current = true;
    };

    setup();

    return () => {
      isMounted = false;

      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      subscribedRef.current = false;
    };
  }, [user, supabase]);

  // -------------------------
  // Delete
  // -------------------------
  const handleDelete = async (id) => {
    try {
      await deleteBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
      loadBookmarks();
    }
  };

  // -------------------------
  // UI
  // -------------------------
  if (loading && !bookmarks.length) {
    return (
      <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full mt-8 mx-auto" />
    );
  }

  if (!bookmarks.length) {
    return <p className="text-center mt-6">No bookmarks yet</p>;
  }

  return (
    <div className="mt-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="mb-4 p-5 bg-gray-100 rounded-xl shadow-sm"
        >
          <div className="flex justify-between">
            <h3 className="font-semibold truncate">
              {bookmark.title}
            </h3>
            <div className="flex gap-3">
              <FaExternalLinkAlt
                className="text-blue-600 cursor-pointer"
                onClick={() =>
                  window.open(bookmark.url, "_blank")
                }
              />
              <MdDeleteOutline
                className="text-red-500 cursor-pointer"
                onClick={() => handleDelete(bookmark.id)}
              />
            </div>
          </div>
          <p className="text-sm text-blue-600 truncate">
            {bookmark.url}
          </p>
        </div>
      ))}
    </div>
  );
}
