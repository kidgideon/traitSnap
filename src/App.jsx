import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './assets/Home' 
import Quizarea from './assets/quiz'
import Card from './assets/cardPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/trait-test" element={<Quizarea/>} />
          <Route path="/trait-card" element={< Card/>} />
      </Routes>
    </Router>
  )
}

export default App
