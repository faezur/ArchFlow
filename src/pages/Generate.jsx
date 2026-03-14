import { useEffect, useState, useRef } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Generate() {
  const [renders, setRenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [dots, setDots] = useState('')
  const [errorMsg, setErrorMsg] = useState('')  // ✅ andar hai
  const fileInputRef = useRef(null)
  const { user } = useAuth()

  // Animated dots
  useEffect(() => {
    if (!generating) return
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [generating])

  useEffect(() => {
    api.get('/renders')
      .then(res => { setRenders(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setErrorMsg('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.type.startsWith('image/')) {
      setFile(dropped)
      setPreview(URL.createObjectURL(dropped))
      setErrorMsg('')
    }
  }

  const handleGenerate = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    setGenerating(true)
    setErrorMsg('')
    try {
      const res = await api.post('/renders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setRenders(prev => [res.data, ...prev])
      setFile(null)
      setPreview(null)
    } catch (err) {
      // ✅ alert() hataya — toast use karo
      setErrorMsg(err.response?.data?.message || 'Render failed. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleRemoveFile = (e) => {
    e.stopPropagation()
    setFile(null)
    setPreview(null)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        <p className="text-zinc-500 text-sm tracking-widest uppercase">Loading</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12 fade-in">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-amber-400 text-xs tracking-widest uppercase font-medium">AI Powered</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
            Generate <span className="text-amber-400">3D Render</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-md">
            Upload your 2D floor plan and our AI will generate a photorealistic 3D top-down architectural render.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left — Upload Panel */}
          <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5">

            <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
              <div className="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center">
                <span className="text-amber-400 text-sm">📐</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Floor Plan Upload</p>
                <p className="text-xs text-zinc-500">PNG, JPG supported</p>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className={`relative w-full rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
                ${dragOver ? 'border-amber-400 bg-amber-400/5 scale-[1.01]' : preview ? 'border-amber-400/50 bg-zinc-800/40' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800/20'}`}
              style={{ minHeight: '220px' }}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
            >
              {preview ? (
                <div className="relative w-full h-full">
                  <img src={preview} alt="Preview" className="w-full object-contain rounded-xl" style={{ maxHeight: '220px' }} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <p className="text-white text-xs">Click to change</p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-red-500/80 transition-all text-sm z-10"
                  >✕</button>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragOver ? 'bg-amber-400/20 scale-110' : 'bg-zinc-800'}`}>
                    <span className="text-3xl">📁</span>
                  </div>
                  <div className="text-center">
                    <p className="text-zinc-300 text-sm font-medium">
                      {dragOver ? 'Drop it here!' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-zinc-600 text-xs mt-1">Floor plan image only</p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {file && (
              <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
                <span className="text-amber-400 text-xs">✓</span>
                <p className="text-amber-400 text-xs font-medium truncate">{file.name}</p>
              </div>
            )}

            {/* ✅ Toast Error — alert() ki jagah */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-red-400 text-xs">{errorMsg}</p>
                <button onClick={() => setErrorMsg('')} className="text-red-400 hover:text-red-300 text-sm ml-3 shrink-0">✕</button>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !file}
              className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2
                ${generating || !file
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-amber-400 text-zinc-950 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20 active:scale-[0.98]'
                }`}
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
                  <span className="text-zinc-400">Analyzing & Rendering{dots}</span>
                </>
              ) : (
                <>
                  <span>✦</span>
                  Generate 3D Render
                </>
              )}
            </button>

            <p className="text-[11px] text-zinc-600 leading-relaxed text-center">
              *Upload one floor plan per image for accurate results.
            </p>
          </div>

          {/* Right — Info / Generating State */}
          <div className="flex flex-col gap-5">

            {generating ? (
              <div className="bg-zinc-900/60 backdrop-blur border border-amber-400/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-6 h-full min-h-[300px]">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-2 border-amber-400/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold mb-2">AI is working{dots}</p>
                  <div className="flex flex-col gap-1.5">
                    {['Analyzing floor plan', 'Generating prompt', 'Creating 3D render'].map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-zinc-600 text-xs">This may take 20-40 seconds</p>
              </div>
            ) : (
              <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-6">
                <p className="text-sm font-semibold text-white mb-4">How it works</p>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: '📐', step: '01', title: 'Upload Floor Plan', desc: 'Upload your 2D architectural floor plan image' },
                    { icon: '🤖', step: '02', title: 'AI Analysis', desc: 'Our AI analyzes rooms, dimensions and layout' },
                    { icon: '✨', step: '03', title: '3D Render Generated', desc: 'Photorealistic top-down render generated instantly' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-9 h-9 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-amber-400 text-xs font-mono">{item.step}</span>
                          <p className="text-white text-sm font-medium">{item.title}</p>
                        </div>
                        <p className="text-zinc-500 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-4">
                <p className="text-2xl font-bold text-amber-400">{renders.length}</p>
                <p className="text-zinc-500 text-xs mt-0.5">Total Renders</p>
              </div>
              <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-4">
                <p className="text-2xl font-bold text-amber-400">AI</p>
                <p className="text-zinc-500 text-xs mt-0.5">AI Powered Renders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Renders */}
        {renders.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Renders</h2>
              <span className="text-zinc-500 text-xs">{renders.length} render{renders.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {renders.map((render, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={render.generatedImageUrl}
                      alt="Generated Render"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => setSelectedImage(render.generatedImageUrl)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <button
                        onClick={() => setSelectedImage(render.generatedImageUrl)}
                        className="text-xs text-white bg-white/20 backdrop-blur rounded-lg px-3 py-1.5 hover:bg-white/30 transition-colors"
                      >
                        View Full
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={render.imageUrl}
                        alt="Original"
                        className="w-8 h-8 rounded-lg object-cover border border-zinc-700"
                      />
                      <div>
                        <p className="text-white text-xs font-medium">Floor Plan</p>
                        <p className="text-zinc-500 text-xs">{new Date(render.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full" title="Completed" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all text-lg"
            onClick={() => setSelectedImage(null)}
          >✕</button>
          <img
            src={selectedImage}
            alt="Full view"
            className="max-w-4xl max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        .fade-in { animation: fadeIn 0.6s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

export default Generate