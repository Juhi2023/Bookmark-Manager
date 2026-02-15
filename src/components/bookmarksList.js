"use client";

import { useEffect, useState } from "react";
import { deleteBookmark, getBookmarks } from "@/actions/bookmarks";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";

export default function BookmarksList({user, supabase}) {
  const [bookmarks, setBookmarks] = useState(null);
  const [loading, setLoading] = useState(true)

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const { data } = await getBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let channel;
  
    const init = async () => {
      if (!user) return;
      await loadBookmarks();
  
      channel = supabase
        .channel("realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Realtime payload:", payload);
  
            if (payload.eventType === "INSERT") {
              setBookmarks((prev) => [payload.new, ...(prev || [])]);
            }
  
            if (payload.eventType === "DELETE") {
              setBookmarks((prev) =>
                prev?.filter((b) => b.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe((status) => {
          console.log("Realtime status:", status);
        });
    };
  
    init();
  
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);
  
  

    const handleDelete = async (id) => {
        
        try {
            await deleteBookmark(id);
            setBookmarks((prev) => prev.filter((b) => b.id !== id));
            toast.success("Bookmark deleted successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete");
            loadBookmarks(); // rollback if failed
        }
  };

  if (bookmarks?.length === 0) {
    return (
      <div className="flex justify-center items-center border border-gray-200 border-[3px] border-dashed p-4 rounded mt-6 h-full">
        <div className="flex flex-col items-center">
          {/* <Bookmark className="w-8 h-8 text-gray-400" /> */}
          <h3 className="text-lg font-semibold text-white">
            No bookmarks yet
          </h3>
          <p className="text-gray-200 max-w-sm mt-2 mb-6">
            You haven't saved any bookmarks. Click the button above to add your
            first link to the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
        {
            (loading && !bookmarks?.length)
            ?
            <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full mt-8 mx-auto!">
            </div>
            :
            <div className=" mt-4">
            {bookmarks?.map((bookmark) => (
                <div
                key={bookmark.id}
                className={`group flex mb-4 flex-col justify-between p-5 bg-gray-100 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200`}
                >
                <div className="w-full">
                        <div className="flex justify-between items-start w-full">
                            <h3
                                className="font-semibold text-gray-900 capitalize truncate pr-2"
                                title={bookmark.title}
                            >
                                {bookmark.title}
                            </h3>
                            <div className="shrink-0 flex items-center gap-2">
                                <FaExternalLinkAlt className="text-blue-600 cursor-pointer" onClick={ ()=>window.open(bookmark.url, "_blank")} />
                                <MdDeleteOutline className="text-[23px] text-red-500 cursor-pointer" onClick={()=>handleDelete(bookmark.id)} />
                            </div>
                        </div>
                        <p className="text-[13px] truncate text-blue-600">
                        {bookmark.url}
                        </p>
                </div>
                </div>
            ))}
            </div>
        }
    </>
  );
}