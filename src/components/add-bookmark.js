'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { createSupabaseBrowserClient } from '@/config/supabaseBrowserClient'
import Button from './button'
import { HiPlus } from 'react-icons/hi'
import InputField from './input-field'

export function AddBookmarkForm({ userId }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!url || !title) {
      toast.error('Please fill in all fields')
      return
    }

    let finalUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url
      toast.error('Please add valid URL')
      return
    }

    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase
        .from('bookmarks')
        .insert([{ user_id: userId, url: finalUrl, title }])

      if (error) throw error

      toast.success('Bookmark added successfully')
      setUrl('')
      setTitle('')
    } catch (error) {
      console.error('Error adding bookmark:', error)
      toast.error('Failed to add bookmark')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='border rounded p-4 mt-5 bg-white border-gray-200'>
      <div className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
            <InputField
              type="text"
              placeholder="URL (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className='flex justify-end'>
            <Button 
              text="Add Bookmark"
              icon={<HiPlus/>}
              />
          </div>
        </form>
      </div>
    </div>
  )
}
