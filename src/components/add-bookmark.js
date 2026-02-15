'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Button from './button'
import { HiPlus } from 'react-icons/hi'
import InputField from './input-field'
import { addBookmark } from '@/actions/bookmarks'

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

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      toast.error('Please add valid URL')
      return
    }

    setLoading(true)
    try {
      const { data } = await addBookmark({ url, title })
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
    <div className='border rounded-xl p-4 mt-5 bg-white border-gray-200'>
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
              loading={loading}
              disabled={loading}
              text="Add Bookmark"
              icon={<HiPlus/>}
              />
          </div>
        </form>
      </div>
    </div>
  )
}
