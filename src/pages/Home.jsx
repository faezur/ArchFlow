import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'   // ✅ FIX

export default function Home() {
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState(null) // ✅ FIX

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Home Section */}
      <section id="home" className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <div className="inline-block bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs px-4 py-1.5 rounded-full mb-6">
          AI Powered Floor Plan Visualizer
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Transform Your <br />
          <span className="text-amber-400">2D Floor Plans</span> into <br />
          3D Renders
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mb-10">
          Upload your architectural floor plan and let our AI generate a stunning 3D top-down visualization in seconds.
        </p>
        <div className="flex gap-4">
          <Link to="/generate" className="px-8 py-3 bg-amber-400 text-zinc-950 font-bold rounded-full hover:bg-amber-300 transition-colors">
            Generate Now
          </Link>
          <a href="#samples" className="px-8 py-3 border border-zinc-700 text-zinc-300 rounded-full hover:border-amber-400 hover:text-amber-400 transition-colors">
            View Samples
          </a>
        </div>
      </section>

      {/* Samples Section */}
      <section id="samples" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            Sample <span className="text-amber-400">Renders</span>
          </h2>
          <p className="text-zinc-400 text-sm">
            AI-Generated Architectural Visualizations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { url: 'https://res.cloudinary.com/dnekdeqgw/image/upload/v1773174686/jlq4grxl5j1bubvocmao_xh2wlv.png', desc: '2 BHK Modern Apartment' },
            { url: 'https://res.cloudinary.com/dnekdeqgw/image/upload/v1773175055/1772298643692_2_k7i9dj.jpg', desc: '2 BHK Compact Layout' },
            { url: 'https://res.cloudinary.com/dnekdeqgw/image/upload/v1773175062/file_000000005db47209a5017ffe3e4cc660_shjhpx.png', desc: 'Luxury Garage Exterior (Coming Soon)' },
            { url: 'https://res.cloudinary.com/dnekdeqgw/image/upload/v1773172206/archflow/generated/jiyqo5fsnryuduouak89.png', desc: '1 BHK Family Home' },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => setSelectedImage(item)}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-amber-400/50 transition-colors cursor-pointer"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.desc}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="text-zinc-400 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-4xl w-full px-4"
            onClick={(e) => e.stopPropagation()} // ✅ FIX
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.desc}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <p className="text-center text-white mt-3 text-sm">
              {selectedImage.desc}
            </p>
          </div>
        </div>
      )}

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            Simple <span className="text-amber-400">Pricing</span>
          </h2>
          <p className="text-zinc-400 text-sm">
            Start free, upgrade when you need more
          </p>
        </div>

        {/* (rest same as your code — no issue here) */}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-600 text-sm">
        © 2026 ArchFlow. All rights reserved.
      </footer>

    </div>
  )
}