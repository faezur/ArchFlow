import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function History() {
  const [renders, setRenders]             = useState([])
  const [loading, setLoading]             = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [deletingId, setDeletingId]       = useState(null)
  const [copiedId, setCopiedId]           = useState(null)

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

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-xs tracking-widest font-mono">LOADING HISTORY</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── Lightbox ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img src={selectedImage} alt="Full view"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
            <button onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400 text-zinc-950 font-bold rounded-full flex items-center justify-center hover:bg-amber-300 transition-colors">
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">

        {/* ── Header ── */}
        <div className="mb-10">
          <span className="inline-block text-xs font-mono tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded mb-4">
            ARCHFLOW AI
          </span>
          <h1 className="text-3xl font-bold tracking-tight">
            Render <span className="text-amber-400">History</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-mono">
            {renders.length} render{renders.length !== 1 ? 's' : ''} generated
          </p>
        </div>

        {/* ── Empty State ── */}
        {renders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 border border-zinc-800 rounded-2xl bg-zinc-900">
            <span className="text-5xl">🏗️</span>
            <p className="text-zinc-400 text-sm font-mono">No renders yet</p>
          </div>
        )}

        {/* ── Render Cards ── */}
        <div className="flex flex-col gap-6">
          {renders.map((render, i) => (
            <div
              key={render._id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-400/30 transition-all duration-300"
              style={{ animation: `fadeUp 0.45s ease ${i * 0.07}s both` }}
            >
              {/* ── Card Header ── */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-amber-400 font-semibold text-sm font-mono">
                    3D Architectural Render
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 text-xs font-mono">
                    {new Date(render.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                  <button
                    onClick={() => handleDelete(render._id)}
                    disabled={deletingId === render._id}
                    className="text-xs text-zinc-600 hover:text-red-400 transition-colors disabled:opacity-50 font-mono"
                  >
                    {deletingId === render._id ? '...' : '✕ Delete'}
                  </button>
                </div>
              </div>

              {/* ── Side by Side Images ── */}
              <div className="grid grid-cols-2">

                {/* Left — Floor Plan */}
                <div className="relative bg-zinc-950 cursor-pointer group border-r border-zinc-800"
                  onClick={() => setSelectedImage(render.imageUrl)}>
                  <img src={render.imageUrl} alt="Original floor plan"
                    className="w-full h-64 object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                    <span className="text-xs font-mono text-zinc-400 tracking-widest">FLOOR PLAN</span>
                  </div>
                </div>

                {/* Right — 3D Render */}
                <div className="relative bg-zinc-950 cursor-pointer group"
                  onClick={() => setSelectedImage(render.generatedImageUrl)}>
                  <img src={render.generatedImageUrl} alt="Generated 3D render"
                    className="w-full h-64 object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                    <span className="text-xs font-mono text-amber-400 tracking-widest">3D RENDER</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="text-xs font-mono text-amber-400 bg-black/70 backdrop-blur-sm border border-amber-400/30 px-2 py-0.5 rounded">
                      AI
                    </span>
                  </div>
                </div>
              </div>

              {/* ── AI Prompt — always visible below images ── */}
              {render.groqPrompt && (
                <div className="px-4 py-4 border-t border-zinc-800 bg-zinc-950/50">

                  {/* Prompt label */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1 h-1 rounded-full bg-amber-400/60" />
                    <span className="text-xs font-mono text-zinc-500 tracking-widest">AI PROMPT</span>
                  </div>

                  {/* Prompt text */}
                  <p className="text-zinc-400 text-xs font-mono leading-relaxed">
                    {render.groqPrompt}
                  </p>

                  {/* Copy hint */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/60">
                    <p className="text-zinc-700 text-xs font-mono">
                      Use on Midjourney · DALL·E · Stable Diffusion
                    </p>
                    <button
                      onClick={() => handleCopy(render._id, render.groqPrompt)}
                      className={`text-xs font-mono px-3 py-1 rounded-lg border transition-all duration-200
                        ${copiedId === render._id
                          ? 'text-green-400 border-green-400/30 bg-green-400/5'
                          : 'text-zinc-500 border-zinc-700 hover:text-amber-400 hover:border-amber-400/30 hover:bg-amber-400/5'
                        }`}
                    >
                      {copiedId === render._id ? '✓ COPIED' : 'COPY →'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Card Footer ── */}
              <div className="flex justify-between items-center px-4 py-3 border-t border-zinc-800">
                <button
                  onClick={() => setSelectedImage(render.generatedImageUrl)}
                  className="text-xs text-zinc-500 hover:text-white transition-colors font-mono tracking-wide"
                >
                  VIEW FULL →
                </button>
                <button
                  onClick={() => handleDownload(render.generatedImageUrl)}
                  className="text-xs bg-amber-400 text-zinc-950 px-4 py-1.5 rounded-lg hover:bg-amber-300 transition-colors font-bold tracking-wide"
                >
                  ↓ DOWNLOAD
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}