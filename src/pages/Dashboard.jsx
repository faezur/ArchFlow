import { useEffect, useState } from 'react'
import api from '../api/axios'

function Dashboard() {
  const [renders, setRenders] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    api.get('/renders')
      .then(response => {
        setRenders(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.log("Error:", error)
        setLoading(false)
      })
  }, [])

  if(loading) {
  return <h2>Loading...</h2>
  }

 return (
  <div>
    <h1>Dashboard</h1>
    {renders.map((render, index) => (
      <li key={index}>{render.name}</li>
    ))}
  </div>
)
}

export default Dashboard