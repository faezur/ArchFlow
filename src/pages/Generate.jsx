import { useEffect, useState, useRef } from 'react'
import api from '../api/axios'

// ── Typewriter Hook ───────────────────────────────────────────────────────────
function useTypewriter(text, speed = 22) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!text) { setDisplayed(''); setDone(false); return }
    setDisplayed('')
    setDone(false)
    let i = 0
    intervalRef.current = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(intervalRef.current)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(intervalRef.current)
  }, [text])

  return { displayed, done }
}

const STEPS = [
  { id: 'upload',  label: 'Uploading floor plan to cloud' },
  { id: 'analyze', label: 'Groq AI analyzing layout & spaces' },
  { id: 'render',  label: 'Stability AI rendering 3D view' },
  { id: 'save',    label: 'Saving render to your history' },
]

export default function Generate() {
  const [renders, setRenders]             = useState([])
  const [loading, setLoading]             = useState(true)
  const [generating, setGenerating]       = useState(false)
  const [activeStep, setActiveStep]       = useState(-1)
  const [doneSteps, setDoneSteps]         = useState([])
  const [file, setFile]                   = useState(null)
  const [preview, setPreview]             = useState(null)
  const [drag, setDrag]                   = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [newRenderId, setNewRenderId]     = useState(null)
  const [livePrompt, setLivePrompt]       = useState('')
  const [promptVisible, setPromptVisible] = useState(false)
  const [copied, setCopied]               = useState(false)

  const fileInputRef = useRef()
  const { displayed: typedPrompt, done: typingDone } = useTypewriter(livePrompt, 20)

  useEffect(() => {
    api.get('/renders')
      .then(r => { setRenders(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const pickFile = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) pickFile(f)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(livePrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerate = async () => {
    if (!file) { alert('Please upload a floor plan first.'); return }

    setGenerating(true)
    setLivePrompt('')
    setPromptVisible(false)
    setActiveStep(-1)
    setDoneSteps([])

    try {
      setActiveStep(0)
      const formData1 = new FormData()
      formData1.append('image', file)

      const analyzeRes = await api.post('/renders/analyze', formData1, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const { uploadedImageUrl, groqPrompt } = analyzeRes.data

      setDoneSteps([0])
      setActiveStep(1)
      await new Promise(r => setTimeout(r, 600))
      setDoneSteps([0, 1])
      setActiveStep(2)

      // Typewriter starts — prompt appears on right side
      setLivePrompt(groqPrompt)
      setPromptVisible(true)

      const formData2 = new FormData()
      formData2.append('image', file)
      formData2.append('uploadedImageUrl', uploadedImageUrl)
      formData2.append('groqPrompt', groqPrompt)

      const generateRes = await api.post('/renders', formData2, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setDoneSteps([0, 1, 2, 3])
      setActiveStep(-1)
      await new Promise(r => setTimeout(r, 300))
      setNewRenderId(generateRes.data._id)
      setRenders(prev => [generateRes.data, ...prev])

    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Render failed. Please try again.')
    } finally {
      setGenerating(false)
      setActiveStep(-1)
      setDoneSteps([])
      setFile(null)
      setPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-500 text-xs tracking-widest font-mono">LOADING WORKSPACE</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative">

      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-mono tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded mb-5">
            ARCHFLOW AI
          </span>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Generate <span className="text-amber-400">3D Render</span>
          </h1>
          <p className="text-zinc-500 text-sm font-mono tracking-wide">
            Upload a 2D floor plan → AI analyzes → 3D architectural view
          </p>
        </div>

        {/* ── 2 Column Layout ── */}
        <div className={`grid gap-6 transition-all duration-500 ${promptVisible ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>

          {/* ── LEFT: Upload Card ── */}
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            {/* Corner brackets */}
            <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400/50 rounded-tl-2xl" />
            <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400/50 rounded-tr-2xl" />
            <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400/50 rounded-bl-2xl" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400/50 rounded-br-2xl" />

            {/* Drop zone */}
            <div
              onClick={() => !generating && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              className={`
                relative h-52 rounded-xl border-2 border-dashed overflow-hidden
                flex flex-col items-center justify-center gap-3 transition-all duration-300
                ${generating ? 'cursor-default' : 'cursor-pointer'}
                ${drag ? 'border-amber-400 bg-amber-400/5'
                  : preview ? 'border-amber-400/50 bg-amber-400/5'
                  : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30'}
              `}
            >
              {generating && (
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                  style={{ animation: 'scan 1.8s linear infinite' }} />
              )}
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
              ) : (
                <>
                  <div className="w-14 h-14 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-2xl">📐</div>
                  <p className="text-zinc-400 text-sm">{drag ? 'Drop it here!' : 'Click or drag & drop your floor plan'}</p>
                  <p className="text-zinc-600 text-xs font-mono">PNG · JPG · WEBP</p>
                </>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*"
              onChange={(e) => pickFile(e.target.files[0])} className="hidden" />

            {file && !generating && (
              <div className="flex items-center justify-between mt-3">
                <p className="text-amber-400 text-xs font-mono">✓ {file.name}</p>
                <button onClick={() => { setFile(null); setPreview(null) }}
                  className="text-zinc-500 hover:text-white text-xs transition-colors">
                  ✕ Remove
                </button>
              </div>
            )}

            {/* AI Pipeline Steps */}
            {generating && (
              <div className="mt-5 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <p className="text-amber-400 text-xs font-mono tracking-widest mb-3">AI PIPELINE RUNNING</p>
                <div className="flex flex-col gap-3">
                  {STEPS.map((step, i) => {
                    const isDone   = doneSteps.includes(i)
                    const isActive = activeStep === i
                    return (
                      <div key={step.id} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300
                          ${isDone   ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                          : isActive ? 'bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                          :            'bg-zinc-700'}`} />
                        <span className={`text-xs font-mono transition-colors duration-300
                          ${isDone ? 'text-green-400' : isActive ? 'text-amber-400' : 'text-zinc-600'}`}>
                          {isDone ? '✓ ' : isActive ? '› ' : '  '}{step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !file}
              className="w-full mt-5 py-3.5 rounded-xl font-bold text-sm tracking-widest
                bg-amber-400 text-zinc-950
                hover:bg-amber-300 hover:-translate-y-0.5
                hover:shadow-[0_0_28px_rgba(245,158,11,0.4)]
                active:translate-y-0 transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed
                disabled:hover:translate-y-0 disabled:hover:shadow-none
                flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  RENDERING...
                </>
              ) : 'GENERATE 3D RENDER →'}
            </button>

            <p className="text-center text-zinc-600 text-xs font-mono mt-3 leading-relaxed">
              One floor plan per upload · Complex drawings may reduce accuracy
            </p>
          </div>

          {/* ── RIGHT: Typewriter Prompt — only visible when generating ── */}
          {promptVisible && livePrompt && (
            <div
              className="bg-zinc-900 border border-amber-400/20 rounded-2xl overflow-hidden flex flex-col"
              style={{ animation: 'slideIn 0.4s ease both' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  {!typingDone
                    ? <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    : <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  }
                  <span className="text-xs font-mono tracking-widest text-amber-400">
                    {typingDone ? 'AI PROMPT READY' : 'AI WRITING PROMPT...'}
                  </span>
                </div>
                {typingDone && (
                  <button
                    onClick={handleCopy}
                    className={`text-xs font-mono px-3 py-1 rounded-lg border transition-all duration-200
                      ${copied
                        ? 'text-green-400 border-green-400/40 bg-green-400/5'
                        : 'text-zinc-400 border-zinc-700 hover:text-amber-400 hover:border-amber-400/40 hover:bg-amber-400/5'
                      }`}
                  >
                    {copied ? '✓ COPIED' : 'COPY PROMPT'}
                  </button>
                )}
              </div>

              {/* Typewriter text — scrollable */}
              <div className="flex-1 px-5 py-4 overflow-y-auto">
                <p className="text-zinc-300 text-sm font-mono leading-relaxed">
                  {typedPrompt}
                  {!typingDone && (
                    <span
                      className="inline-block w-0.5 h-4 bg-amber-400 ml-0.5 align-middle"
                      style={{ animation: 'blink 0.7s step-end infinite' }}
                    />
                  )}
                </p>

                {typingDone && (
                  <p className="text-zinc-600 text-xs font-mono mt-4 pt-3 border-t border-zinc-800">
                    Use this prompt on Gemini, Midjourney, DALL·E, or any AI image tool for 100% Accurate Result
                  </p>
                )}
              </div>

              {/* Bottom — waiting indicator while Stability generates */}
              {!typingDone || generating ? (
                <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/50">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />
                    <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" style={{ animationDelay: '0.4s' }} />
                    <span className="text-zinc-600 text-xs font-mono ml-1">AI rendering your 3D view...</span>
                  </div>
                </div>
              ) : (
                <div className="px-5 py-3 border-t border-zinc-800 bg-green-400/5">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-xs">✓</span>
                    <span className="text-green-400 text-xs font-mono">Render complete — check below!</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Recent Renders ── */}
        {renders.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-bold whitespace-nowrap">Recent Renders</h2>
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded whitespace-nowrap">
                {renders.length} TOTAL
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {renders.map((render, i) => (
                <div
                  key={render._id || i}
                  className={`bg-zinc-900 rounded-2xl overflow-hidden border transition-all duration-300
                    hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                    ${render._id === newRenderId
                      ? 'border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                      : 'border-zinc-800 hover:border-zinc-700'}`}
                  style={{ animation: `fadeUp 0.45s ease ${i * 0.07}s both` }}
                >
                  <div className="flex items-stretch">
                    <div className="w-28 flex-shrink-0 overflow-hidden cursor-pointer relative"
                      onClick={() => setSelectedImage(render.generatedImageUrl)}>
                      <img src={render.generatedImageUrl} alt="Generated render"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/70 pointer-events-none" />
                    </div>
                    <div className="flex-1 px-4 py-3 flex flex-col justify-between">
                      <div>
                        {render._id === newRenderId && (
                          <span className="inline-block mb-1.5 text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">NEW</span>
                        )}
                        <p className="font-semibold text-sm mb-1">3D Architectural Render</p>
                        <p className="text-zinc-500 text-xs font-mono">
                          {new Date(render.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <button onClick={() => setSelectedImage(render.generatedImageUrl)}
                        className="self-start mt-2 px-3 py-1 rounded-lg text-xs font-mono text-amber-400
                          border border-zinc-700 hover:border-amber-400/40 hover:bg-amber-400/5
                          transition-all duration-200 tracking-wide">
                        VIEW FULL →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {renders.length === 0 && (
          <div className="mt-12 text-center border border-zinc-800 bg-zinc-900 rounded-2xl py-12 px-6 max-w-2xl mx-auto">
            <p className="text-4xl mb-3">🏗️</p>
            <p className="font-semibold mb-1">No renders yet</p>
            <p className="text-zinc-500 text-xs font-mono">Upload your first floor plan to get started</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img src={selectedImage} alt="Full render"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
            <button onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-amber-400 text-zinc-950 font-bold text-sm flex items-center justify-center hover:bg-amber-300 transition-colors">
              ✕
            </button>
            <a href={selectedImage} download target="_blank" rel="noreferrer"
              className="block text-center mt-3 text-amber-400 text-xs font-mono tracking-widest hover:text-amber-300 transition-colors">
              ↓ DOWNLOAD RENDER
            </a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan    { from { top: 0%; } to { top: 100%; } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink   { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  )
}