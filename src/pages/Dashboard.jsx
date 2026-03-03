import { useEffect, useState } from 'react'
import api from '../api/axios'

function Dashboard() {
  const [renders, setRenders] = useState([])

  useEffect(() => {
    api.get('/renders')
      .then(response => {
        setRenders(response.data)
      })
      .catch(error => {
        console.log("Error:", error)
      })
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}

export default Dashboard