import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">Zest</div>
        <nav>
          <div className="nav-item active">Projects</div>
          <div className="nav-item">Calendar</div>
          <div className="nav-item">Settings</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <input className="search" placeholder="Type to search..." />
          <div className="profile">Shawn</div>
        </header>

        <section className="board">
          <div className="column">
            <h3>TODO</h3>
            <Card title="Design App" />
            <Card title="Review & Feedback" />
            <Card title="Reiterate" />
          </div>

          <div className="column">
            <h3>DOING</h3>
            <Card title="Interview & Prototyping" />
            <Card title="UX Copy & Content" />
          </div>

          <div className="column">
            <h3>IN REVIEW</h3>
            <Card title="Flow Identification" />
            <Card title="Create Wireframe" />
            <Card title="Testing MVP Flow" />
          </div>
        </section>
      </main>
    </div>
  );
}

function Card({ title }) {
  return (
    <div className="card">
      <div className="badge">High</div>
      <h4>{title}</h4>
      <div className="card-footer">
        <span>May 10</span>
        <span>•••</span>
      </div>
    </div>
  );

}

export default App
