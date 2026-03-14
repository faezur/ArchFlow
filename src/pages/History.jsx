import { useEffect, useState } from 'react'
import api from '../api/axios'
import ImageCompare from "../components/ImageCompare"

export default function History() {
  const [renders, setRenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    api.get('/renders')
      .then(res => { setRenders(res.data); setLoading(false) })
      .catch(err => { console.log("Error:", err); setLoading(false) })
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this render?')
    if (!confirmed) return
    setDeletingId(id)
    try {
      await api.delete(`/renders/${id}`)
      setRenders(prev => prev.filter(r => r._id !== id))
    } catch (error) {
      console.log(error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = "archflow-render.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.log("Download failed", error)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm tracking-widest uppercase">Loading</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-4 right-4 w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white text-lg">✕</button>
          <img
            src={selectedImage}
            alt="Full view"
            className="w-full max-w-4xl max-h-[90vh] object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold">
            Render <span className="text-amber-400">History</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            {renders.length} render{renders.length !== 1 ? 's' : ''} generated
          </p>
        </div>

        {/* Empty State */}
        {renders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-5xl">📐</span>
            <p className="text-zinc-400 text-sm">No renders yet</p>
          </div>
        )}

        {/* Render Cards — 1 col mobile, 2 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {renders.map((render) => (
            <div
              key={render._id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4 hover:border-amber-400/30 transition"
            >
              {/* Meta */}
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <span className="text-amber-400 font-semibold text-sm">
                  {render.bhk || 'Floor Plan'}
                </span>
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="text-zinc-500 text-xs">
                    {new Date(render.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                  <button
                    onClick={() => handleDelete(render._id)}
                    disabled={deletingId === render._id}
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    {deletingId === render._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>

              {/* Compare Slider */}
              <div className="rounded-lg overflow-hidden">
                <ImageCompare
                  before={render.imageUrl}
                  after={render.generatedImageUrl}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-3 md:mt-4">
                <button
                  onClick={() => setSelectedImage(render.generatedImageUrl)}
                  className="text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1"
                >
                  View Full
                </button>
                <button
                  onClick={() => handleDownload(render.generatedImageUrl)}
                  className="text-xs bg-amber-400 text-black px-3 py-1.5 rounded-lg hover:bg-amber-300 transition-colors font-medium"
                >
                  ↓ Download
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}