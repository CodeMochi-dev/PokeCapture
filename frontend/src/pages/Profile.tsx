import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { Creature } from '../types'

export default function Profile({ 
  user, 
  collection, 
  onLogout 
}: { 
  user: string | null, 
  collection: Creature[], 
  onLogout: () => void 
}) {
  const navigate = useNavigate()

  if (!user) {
    return (
      <div style={{ padding: 48, textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>❓</div>
        <h2 style={{ color: 'var(--text-main)', marginBottom: 24 }}>No has iniciado sesión</h2>
        <button 
          onClick={() => navigate('/login')} 
          style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
        >
          Ir al Login
        </button>
      </div>
    )
  }

  // Cálculos de estadísticas
  const uniqueCaught = new Set(collection.map(c => c.id.split('-')[0])).size
  const legendaries = collection.filter(c => c.rarity === 'legendary').length

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
      <div style={{ 
        background: 'var(--panel-bg)', 
        border: '2px solid var(--panel-border)', 
        borderRadius: 24, 
        padding: 32, 
        textAlign: 'center',
        boxShadow: '0 16px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), #f5a623)',
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          boxShadow: '0 8px 24px rgba(255, 209, 102, 0.4)'
        }}>
          👤
        </div>
        
        <h2 style={{ margin: '0 0 8px', fontSize: 32, color: 'var(--text-main)' }}>
          {user}
        </h2>
        <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 18, marginBottom: 32 }}>
          Entrenador Pokémon
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <div style={{ background: 'var(--input-bg)', padding: '16px 24px', borderRadius: 16, border: '1px solid var(--panel-border)', flex: '1 1 120px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>{uniqueCaught} / 151</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Pokédex</div>
          </div>
          <div style={{ background: 'var(--input-bg)', padding: '16px 24px', borderRadius: 16, border: '1px solid var(--panel-border)', flex: '1 1 120px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>{collection.length}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Capturas Totales</div>
          </div>
          <div style={{ background: 'var(--input-bg)', padding: '16px 24px', borderRadius: 16, border: '1px solid var(--panel-border)', flex: '1 1 120px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f5a623' }}>{legendaries}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Legendarios</div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          style={{
            padding: '12px 32px',
            borderRadius: 12,
            border: '2px solid #ef4444',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444' }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
