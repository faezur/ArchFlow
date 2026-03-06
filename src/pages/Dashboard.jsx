import { useEffect, useState } from 'react'
import api from '../api/axios'
import {useAuth} from '../context/AuthContext'

function Dashboard() {
  const [renders, setRenders] = useState([])
  const [loading, setLoading] = useState(true)
  const {user} = useAuth()
  const [bhk, setBhk] = useState('')
  const [file, setFile] = useState(null)


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

  const handleGenerate = () => {
  if(!file || !bhk ) {
    alert('File & configration must be Selected!')
    return
  }
  console.log('File:', file)
  console.log('BHK:', bhk)
}

 return (
  <div>
    <h3>Welcome {user.name}</h3>
    <h1>Upload Your File</h1>
     <input 
    type="file" 
    accept="image/*"
    onChange={(e) => setFile(e.target.files[0])}
  />
    <select 
    value={bhk} 
    onChange={(e) => setBhk(e.target.value)}
  >
    <option value="">Configuration </option>
    <option value="1BHK">1 BHK</option>
    <option value="2BHK">2 BHK</option>
    <option value="3BHK">3 BHK</option>
    <option value="4BHK">4 BHK</option>
    <option value="5BHK">5 BHK</option>
    <option value="6BHK">6 BHK</option>
  </select>

  <button onClick={handleGenerate}>Generate</button>
    {renders.map((render, index) => (
      <li key={index}>{render.name}</li>
    ))}
  </div>
)
}

export default Dashboard