import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import SynthesisGrid from './components/SynthesisGrid'
import AgentProfile from './components/AgentProfile'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SynthesisGrid />} />
        <Route path="/:tokenId" element={<AgentProfile />} />
      </Routes>
    </Layout>
  )
}
