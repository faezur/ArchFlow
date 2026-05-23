import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function History() {
  const [renders, setRenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    api.get('/renders')
      .then(res => { setRenders(res.data); setLoading(false) })
      .catch(err => { console.log('Error:', err); setLoading(false) })
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
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = 'archflow-render.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.log('Download failed', error)
    }
  }

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-pink-300 border-t-transparent" />
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">Loading history</p>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen px-4 py-12 text-white sm:px-6">
      {selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-5 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img src={selectedImage} alt="Full view" className="max-h-[85vh] max-w-[92vw] rounded-3xl object-contain shadow-2xl" />
            <button onClick={() => setSelectedImage(null)} className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-pink-500 font-black text-white">x</button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-pink-300">Saved work</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Render history</h1>
            <p className="mt-3 text-sm text-zinc-400">{renders.length} render{renders.length !== 1 ? 's' : ''} generated</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Archive</p>
            <p className="mt-1 text-sm text-zinc-400">Original plan and generated output together.</p>
          </div>
        </div>

        {renders.length === 0 ? (
          <div className="soft-card rounded-[2rem] px-6 py-24 text-center">
            <p className="text-xl font-black">No renders yet</p>
            <p className="mt-2 text-sm text-zinc-500">Your generated visuals will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {renders.map((render, i) => (
              <article key={render._id} className="glass-panel overflow-hidden rounded-[2rem]" style={{ animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}>
                <div className="flex flex-col justify-between gap-4 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-black">3D architectural render</p>
                    <p className="mt-1 text-xs text-zinc-500">{new Date(render.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <button onClick={() => handleDelete(render._id)} disabled={deletingId === render._id} className="self-start rounded-full border border-red-300/20 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10 disabled:opacity-50 sm:self-auto">
                    {deletingId === render._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>

                <div className="grid md:grid-cols-2">
                  <button className="group relative min-h-[280px] bg-black/30 p-3 md:border-r md:border-white/10" onClick={() => setSelectedImage(render.imageUrl)}>
                    <img src={render.imageUrl} alt="Original floor plan" className="h-72 w-full rounded-2xl object-contain transition duration-500 group-hover:scale-[1.02]" />
                    <span className="absolute bottom-6 left-6 rounded-full bg-black/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-300">Floor plan</span>
                  </button>
                  <button className="group relative min-h-[280px] bg-black/30 p-3" onClick={() => setSelectedImage(render.generatedImageUrl)}>
                    <img src={render.generatedImageUrl} alt="Generated 3D render" className="h-72 w-full rounded-2xl object-contain transition duration-500 group-hover:scale-[1.02]" />
                    <span className="absolute bottom-6 left-6 rounded-full bg-pink-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">3D render</span>
                  </button>
                </div>

                {render.groqPrompt && (
                  <div className="border-t border-white/10 bg-black/20 p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">AI prompt</p>
                      <button onClick={() => handleCopy(render._id, render.groqPrompt)} className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-white/10">
                        {copiedId === render._id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="max-h-32 overflow-y-auto text-sm leading-6 text-zinc-400">{render.groqPrompt}</p>
                  </div>
                )}

                <div className="flex flex-col justify-between gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center">
                  <button onClick={() => setSelectedImage(render.generatedImageUrl)} className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-200 hover:bg-white/10">View full</button>
                  <button onClick={() => handleDownload(render.generatedImageUrl)} className="rounded-full px-5 py-2 text-sm font-black text-white glow-button">Download</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}
