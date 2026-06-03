import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api'

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [books, setBooks] = useState([])
  const [tickets, setTickets] = useState([])
  const [subject, setSubject] = useState('')
  const [desc, setDesc] = useState('')

  const login = async () => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password })
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const loadData = async () => {
    if (!user) return
    const config = { headers: { Authorization: `Bearer ${user.token}` } }
    const [booksRes, ticketsRes] = await Promise.all([
      axios.get(`${API}/portal/my-books`, config),
      axios.get(`${API}/portal/tickets`, config)
    ])
    setBooks(booksRes.data)
    setTickets(ticketsRes.data)
  }

  const submitTicket = async () => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } }
    const ai = await axios.post(`${API}/ai/process`, { subject, description: desc })
    await axios.post(`${API}/portal/tickets`, {
      subject,
      description: desc,
      category: ai.data.category,
      priority: ai.data.priority,
      aiDraft: ai.data.draft
    }, config)
    setSubject(''); setDesc(''); loadData()
  }

  const updateStatus = async (id, status) => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } }
    await axios.put(`${API}/portal/tickets/${id}`, { status }, config)
    loadData()
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [user])

  if (!user) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">BookLeaf Login</h1>
        <input className="w-full p-2 border rounded mb-4" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded mb-4" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded" onClick={login}>Login</button>
        <p className="text-xs mt-4 text-gray-500">Author: author@test.com / password123<br/>Admin: admin@test.com / password123</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">BookLeaf Portal - {user.role}</h1>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={logout}>Logout</button>
        </div>

        {user.role === 'author' && <>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">My Books</h2>
            <table className="w-full">
              <thead><tr className="border-b"><th className="text-left p-2">Title</th><th>ISBN</th><th>MRP</th><th>Royalty</th><th>Status</th></tr></thead>
              <tbody>{books.map(b => (
                <tr key={b._id} className="border-b">
                  <td className="p-2">{b.title}</td>
                  <td className="text-center">{b.isbn}</td>
                  <td className="text-center">₹{b.mrp}</td>
                  <td className="text-center">₹{b.lifetimeRoyalty}</td>
                  <td className="text-center">{b.status}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Submit Ticket</h2>
            <input className="w-full p-2 border rounded mb-2" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
            <textarea className="w-full p-2 border rounded mb-2" rows="4" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={submitTicket}>Submit with AI</button>
          </div>
        </>}

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">{user.role === 'admin'? 'All Tickets' : 'My Tickets'}</h2>
          {tickets.map(t => (
            <div key={t._id} className="border rounded p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-bold">{t.subject}</span>
                <span className={`px-2 py-1 rounded text-xs ${t.priority === 'Critical'? 'bg-red-500 text-white' : t.priority === 'High'? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>{t.priority}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{t.description}</p>
              <p className="text-xs"><b>Category:</b> {t.category} | <b>Status:</b> {t.status}</p>
              {user.role === 'admin' && <>
                <p className="text-sm mt-2 bg-gray-100 p-2 rounded"><b>AI Draft:</b> {t.aiDraft}</p>
                <select className="mt-2 p-1 border rounded" value={t.status} onChange={e => updateStatus(t._id, e.target.value)}>
                  <option>Open</option><option>In Progress</option><option>Resolved</option>
                </select>
              </>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App