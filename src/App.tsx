import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './components/HomePage'
import AgentProfile from './components/AgentProfile'
import SynthesisGrid from './components/SynthesisGrid'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/synthesis" element={<SynthesisGrid />} />
        <Route path="/:tokenId" element={<AgentProfile />} />
      </Routes>
    </Layout>
  )
}
