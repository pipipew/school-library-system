import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>School Library Management System</h1>
      </header>
      <main className="app-main">
        <section className="dashboard">
          <h2>Dashboard</h2>
          <p>Welcome to the School Library Management System</p>
        </section>
      </main>
    </div>
  )
}

export default App
