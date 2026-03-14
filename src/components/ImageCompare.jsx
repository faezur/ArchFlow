import { useState } from "react"

export default function ImageCompare({ before, after }) {

const [position, setPosition] = useState(50)

return (

<div
className="relative w-full aspect-[4/3] overflow-hidden rounded-xl"
onMouseMove={(e) => {
const rect = e.currentTarget.getBoundingClientRect()
const x = e.clientX - rect.left
const percent = (x / rect.width) * 100
setPosition(percent)
}}
>

<img
src={before}
className="absolute inset-0 w-full h-full object-contain"
/>

<img
src={after}
style={{ clipPath: `inset(0 ${100-position}% 0 0)` }}
className="absolute inset-0 w-full h-full object-contain"
/>

<div
style={{ left: `${position}%` }}
className="absolute top-0 bottom-0 w-1 bg-white"
/>

</div>

)
}