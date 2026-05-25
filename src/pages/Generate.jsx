import { useEffect, useState, useRef } from 'react'
import api from '../api/axios'

function useTypewriter(text, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!text) {
      setDisplayed('')
      setDone(false)
      return
    }
    setDisplayed('')
    setDone(false)
    let i = 0
    intervalRef.current = setInterval(() => {
      i += 1
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(intervalRef.current)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(intervalRef.current)
  }, [text, speed])

  return { displayed, done }
}

const STEPS = [
  { id: 'upload', label: 'Uploading plan' },
  { id: 'analyze', label: 'Analyzing rooms' },
  { id: 'render', label: 'Rendering 3D view' },
  { id: 'save', label: 'Saving to history' },
]

export default function Generate() {
  const [renders, setRenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)
  const [doneSteps, setDoneSteps] = useState([])
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [drag, setDrag] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [newRenderId, setNewRenderId] = useState(null)
  const [livePrompt, setLivePrompt] = useState('')
  const [promptVisible, setPromptVisible] = useState(false)
  const [copied, setCopied] = useState(false)

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
    if (!file) {
      alert('Please upload a floor plan first.')
      return
    }

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
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const { uploadedImageUrl, groqPrompt } = analyzeRes.data
      setDoneSteps([0])
      setActiveStep(1)
      await new Promise(r => setTimeout(r, 600))
      setDoneSteps([0, 1])
      setActiveStep(2)
      setLivePrompt(groqPrompt)
      setPromptVisible(true)

      const formData2 = new FormData()
      formData2.append('image', file)
      formData2.append('uploadedImageUrl', uploadedImageUrl)
      formData2.append('groqPrompt', groqPrompt)

      const generateRes = await api.post('/renders', formData2, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-pink-300 border-t-transparent" />
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">Loading workspace... This may take a few seconds as we fine-tune our system</p>
    </div>
  )

  return (
    <main className="min-h-screen px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-pink-300">ArchFlow AI</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Generate 3D render</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Upload a 2D plan, let AI read the layout, then receive a client-ready top-down visualization.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-3xl border border-white/10 bg-white/5 p-3">
            {['Upload', 'Analyze', 'Render'].map((item) => <span key={item} className="rounded-2xl bg-black/25 px-4 py-2 text-center text-xs font-bold text-zinc-300">{item}</span>)}
          </div>
        </div>

        <div className={`grid gap-6 transition-all duration-500 ${promptVisible ? 'lg:grid-cols-[0.9fr_1.1fr]' : 'mx-auto max-w-3xl'}`}>
          <section className="glass-panel rounded-[2rem] p-5 sm:p-6">
            <div
              onClick={() => !generating && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              className={`relative flex min-h-[330px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed p-5 text-center transition ${drag ? 'border-pink-300 bg-pink-400/10' : preview ? 'border-cyan-300/50 bg-cyan-400/5' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
            >
              {generating && <div className="absolute inset-x-0 top-0 h-1 animate-[scan_1.8s_linear_infinite] bg-gradient-to-r from-transparent via-pink-300 to-transparent" />}
              {preview ? (
                <img src={preview} alt="Preview" className="h-full max-h-[430px] w-full rounded-2xl object-contain" />
              ) : (
                <>
                  <div className="mb-5 grid h-20 w-20 place-items-center rounded-3xl border border-white/10 bg-white/10 text-3xl">+</div>
                  <p className="text-lg font-black">{drag ? 'Drop your plan here' : 'Upload floor plan'}</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">Click or drag an image file. JPG, PNG, and WEBP plans work best.</p>
                </>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => pickFile(e.target.files[0])} className="hidden" />

            {file && !generating && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="truncate text-sm text-zinc-300">{file.name}</p>
                <button onClick={() => { setFile(null); setPreview(null) }} className="text-sm font-bold text-pink-300">Remove</button>
              </div>
            )}

            {generating && (
              <div className="mt-5 rounded-3xl border border-white/10 bg-black/25 p-4">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-pink-300">Pipeline running</p>
                <div className="grid gap-3 sm:grid-cols-4">
                  {STEPS.map((step, i) => {
                    const isDone = doneSteps.includes(i)
                    const isActive = activeStep === i
                    return (
                      <div key={step.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <span className={`block h-2 w-2 rounded-full ${isDone ? 'bg-emerald-300' : isActive ? 'bg-pink-300' : 'bg-zinc-700'}`} />
                        <p className={`mt-3 text-xs font-bold ${isDone ? 'text-emerald-300' : isActive ? 'text-pink-300' : 'text-zinc-500'}`}>{step.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <button onClick={handleGenerate} disabled={generating || !file} className="mt-5 flex w-full items-center justify-center rounded-full px-5 py-4 text-sm font-black text-white glow-button disabled:cursor-not-allowed disabled:opacity-45">
              {generating ? 'Rendering...' : 'Generate 3D render'}
            </button>
          </section>

          {promptVisible && livePrompt && (
            <section className="glass-panel flex min-h-[520px] flex-col rounded-[2rem]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">{typingDone ? 'Prompt ready' : 'Writing prompt'}</p>
                  <p className="mt-1 text-sm text-zinc-500">AI interpretation of your floor plan</p>
                </div>
                {typingDone && <button onClick={handleCopy} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white">{copied ? 'Copied' : 'Copy'}</button>}
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">{typedPrompt}{!typingDone && <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-pink-300 align-middle" />}</p>
              </div>
              <div className="border-t border-white/10 px-5 py-4 text-xs text-zinc-500">
                Use this prompt in your favorite image tool for alternate render explorations.
              </div>
            </section>
          )}
        </div>

        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black">Recent renders</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-zinc-400">{renders.length} total</span>
          </div>

          {renders.length === 0 ? (
            <div className="soft-card rounded-[2rem] px-6 py-16 text-center">
              <p className="text-lg font-black">No renders yet</p>
              <p className="mt-2 text-sm text-zinc-500">Upload your first floor plan to begin.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {renders.map((render, i) => (
                <article key={render._id || i} className={`group overflow-hidden rounded-3xl border bg-white/5 transition hover:border-pink-300/40 ${render._id === newRenderId ? 'border-pink-300/60' : 'border-white/10'}`}>
                  <button onClick={() => setSelectedImage(render.generatedImageUrl)} className="block h-56 w-full overflow-hidden bg-black/30">
                    <img src={render.generatedImageUrl} alt="Generated render" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </button>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black">3D architectural render</p>
                        <p className="mt-1 text-xs text-zinc-500">{new Date(render.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      {render._id === newRenderId && <span className="rounded-full bg-pink-500 px-2 py-1 text-xs font-black">NEW</span>}
                    </div>
                    <button onClick={() => setSelectedImage(render.generatedImageUrl)} className="mt-4 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-white/10">
                      View full
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-5 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img src={selectedImage} alt="Full render" className="max-h-[85vh] max-w-[92vw] rounded-3xl object-contain shadow-2xl" />
            <button onClick={() => setSelectedImage(null)} className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-pink-500 font-black text-white">x</button>
            <a href={selectedImage} download target="_blank" rel="noreferrer" className="mt-3 block text-center text-xs font-bold uppercase tracking-[0.2em] text-pink-300">Download render</a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan { from { transform: translateY(0); } to { transform: translateY(330px); } }
      `}</style>
    </main>
  )
}
