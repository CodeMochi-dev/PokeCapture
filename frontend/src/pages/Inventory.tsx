import React from 'react'
import type { Creature } from '../types'
import CreatureCard from '../components/CreatureCard'
import { useNavigate } from 'react-router-dom'

import confetti from 'canvas-confetti'

export default function Inventory({ collection, onRelease }: { collection: Creature[], onRelease: (id: string) => void }) {
  const navigate = useNavigate()

  // Sonido de liberación
  const playReleaseSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'triangle'
      o.frequency.setValueAtTime(300, ctx.currentTime)
      o.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3)
      o.connect(g)
      g.connect(ctx.destination)
      g.gain.setValueAtTime(0.2, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3)
      o.start()
      setTimeout(()=>{ o.stop(); ctx.close() }, 350)
    } catch { /* ignore */ }
  }

  const handleRelease = (c: Creature) => {
    if(confirm(`¿Estás seguro de que quieres liberar a ${c.name}?`)) {
      playReleaseSound()
      onRelease(c.id)
    }
  }

  if (collection.length === 0) {
    return (
      <div style={{
        padding: 64, textAlign: 'center', color: '#94a3b8',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
      }}>
        <div style={{ fontSize: 64, opacity: 0.5 }}>🎒</div>
        <h2>Tu mochila está vacía</h2>
        <p style={{ maxWidth: 400, lineHeight: 1.6 }}>Aún no tienes ningún Pokémon en tu colección. ¡Sal al mapa y captura algunos!</p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #06d6a0, #04a67a)',
            border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(6,214,160,0.3)'
          }}
        >
          Explorar ahora
        </button>
      </div>
    )
  }

  // Calcular estadísticas de la colección
  const totalHp = collection.reduce((sum, c) => sum + c.stats.hp, 0)
  const strongest = [...collection].sort((a,b) => b.level - a.level)[0]

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ margin: 0, fontSize: 28 }}>Tu Colección</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #0b1120)', border: '1px solid #1e293b',
            color: '#cbd5e1', padding: '6px 16px', borderRadius: 20, fontSize: 14
          }}>
            💪 Más fuerte: <strong style={{color:'#fff'}}>{strongest?.name} (Nv {strongest?.level})</strong>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #ffd166, #f5a623)',
            color: '#1a1a2e', padding: '6px 16px', borderRadius: 20, fontWeight: 800,
            boxShadow: '0 4px 12px rgba(255,209,102,0.3)'
          }}>
            {collection.length} Pokémon
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
        {collection.map(c => (
          <CreatureCard
            key={c.id}
            creature={c}
            hideCapture={true}
            onRelease={handleRelease}
            onDetails={(cr) => navigate(`/detail/${cr.id.replace(/-.*$/, '')}`)}
          />
        ))}
      </div>
    </div>
  )
}
