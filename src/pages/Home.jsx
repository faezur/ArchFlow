import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const samples = [
  { url: 'https://res.cloudinary.com/dnekdeqgw/image/upload/v1773174686/jlq4grxl5j1bubvocmao_xh2wlv.png', desc: 'Modern 2 BHK apartment' },
  { url: 'https://res.cloudinary.com/dnekdeqgw/image/upload/v1773175055/1772298643692_2_k7i9dj.jpg', desc: 'Compact urban layout' },
  { url: 'https://res.cloudinary.com/dnekdeqgw/image/upload/v1773175062/file_000000005db47209a5017ffe3e4cc660_shjhpx.png', desc: 'Luxury exterior concept' },
  { url: 'https://res.cloudinary.com/dnekdeqgw/image/upload/v1773172206/archflow/generated/jiyqo5fsnryuduouak89.png', desc: 'Family home visualization' },
]

const plans = [
  { name: 'Free', price: '$0', note: 'Forever free', features: ['3 renders per month', 'Basic render quality', 'Watermark included'] },
  { name: 'Pro', price: '$9', note: 'per month', featured: true, features: ['50 renders per month', 'High quality output', 'No watermark', 'Priority support'] },
  { name: 'Studio', price: '$29', note: 'per month', features: ['Unlimited renders', 'Highest quality', 'API access', 'Dedicated support'] },
]

export default function Home() {
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <main className="min-h-screen overflow-hidden text-white">
      <section id="home" className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:pb-28">
        <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_50%_36%,rgba(236,72,153,0.38),transparent_28rem)]" />
        <div className="mx-auto overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 p-5 shadow-2xl shadow-pink-950/30 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.92fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-zinc-200">
                <span className="h-2 w-2 rounded-full bg-pink-400 shadow-[0_0_18px_rgba(244,114,182,0.9)]" />
                AI floor plan to premium 3D render
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                Turn flat plans into <span className="accent-text">cinematic spaces.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                Upload a 2D floor plan and ArchFlow creates a polished top-down architectural visualization for client previews, portfolios, and fast design checks.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to={user ? '/generate' : '/signup'} className="rounded-full px-7 py-3 text-center text-sm font-black text-white glow-button">
                  Start rendering
                </Link>
                <a href="#samples" className="rounded-full border border-white/10 bg-white/5 px-7 py-3 text-center text-sm font-bold text-zinc-100 hover:bg-white/10">
                  View samples
                </a>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                {['Layout scan', 'AI prompt', '3D output'].map((item, i) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xl font-black text-white">0{i + 1}</p>
                    <p className="mt-1 text-xs text-zinc-400">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="image-frame relative rounded-[1.75rem] p-3">
              <div className="absolute inset-x-8 -top-4 h-10 rounded-full bg-pink-500/50 blur-2xl" />
              <div className="overflow-hidden rounded-[1.25rem] bg-[#070912]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-pink-400" />
                    <span className="h-3 w-3 rounded-full bg-violet-400" />
                    <span className="h-3 w-3 rounded-full bg-cyan-300" />
                  </div>
                  <span className="text-xs text-zinc-500">ArchFlow Studio</span>
                </div>
                <div className="subtle-grid p-4">
                  <img src={samples[0].url} alt="Generated architectural render" className="h-[360px] w-full rounded-2xl object-cover sm:h-[430px]" />
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-white/10 p-3">
                  {['3D render', 'Client-ready', 'Saved history'].map((label) => (
                    <div key={label} className="rounded-xl bg-white/5 px-3 py-2 text-center text-xs text-zinc-300">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="samples" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-pink-300">Gallery</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Sample renders</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-400">
            Clean visual direction, rich materials, and presentation-ready outputs generated from simple floor plan inputs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {samples.map((item) => (
            <button key={item.url} onClick={() => setSelectedImage(item)} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left shadow-xl shadow-black/20">
              <div className="h-64 overflow-hidden">
                <img src={item.url} alt={item.desc} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <p className="font-semibold text-white">{item.desc}</p>
                <p className="mt-1 text-xs text-zinc-500">Tap to inspect</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-300">Pricing</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">Choose your render flow</h2>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-3xl p-6 ${plan.featured ? 'image-frame shadow-2xl shadow-pink-950/30' : 'soft-card'}`}>
              {plan.featured && <span className="absolute -top-3 left-6 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">POPULAR</span>}
              <h3 className="text-xl font-black">{plan.name}</h3>
              <div className="mt-4 flex items-end gap-2">
                <p className="text-4xl font-black">{plan.price}</p>
                <p className="pb-1 text-sm text-zinc-500">{plan.note}</p>
              </div>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <p key={feature} className="text-sm text-zinc-300">
                    <span className="mr-2 text-pink-300">+</span>{feature}
                  </p>
                ))}
              </div>
              <Link to={user ? '/generate' : '/signup'} className={`mt-8 block rounded-full px-5 py-3 text-center text-sm font-black ${plan.featured ? 'text-white glow-button' : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'}`}>
                {plan.name === 'Studio' ? 'Contact studio' : 'Get started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-5 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
          <div className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.url} alt={selectedImage.desc} className="max-h-[82vh] w-full rounded-3xl object-contain" />
            <p className="mt-3 text-center text-sm text-zinc-300">{selectedImage.desc}</p>
          </div>
        </div>
      )}

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-zinc-500">
        Copyright 2026 ArchFlow. All rights reserved.
      </footer>
    </main>
  )
}
