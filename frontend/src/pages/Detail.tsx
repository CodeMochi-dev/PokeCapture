import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Creature } from '../types'

// Color por tipo de Pokémon
const TYPE_COLORS: Record<string, string> = {
  Fuego:     '#ff6b35',
  Planta:    '#56ab2f',
  Agua:      '#2196f3',
  Eléctrico: '#f7c948',
  Psíquico:  '#c45dbf',
  Fantasma:  '#5a4580',
  Dragón:    '#0f60d6',
  Normal:    '#9e9e9e',
  Roca:      '#8d6e63',
  Volador:   '#81d4fa',
  Éter:      '#b39ddb',
  Hielo:     '#80deea',
  Lucha:     '#e53935',
  Veneno:    '#7b1fa2',
  Tierra:    '#8d5524',
  Acero:     '#90a4ae',
  Siniestro: '#37474f',
  Bicho:     '#8bc34a',
  Hada:      '#f48fb1',
}

const RARITY_COLORS: Record<string, string> = {
  common:    '#9e9e9e',
  rare:      '#2196f3',
  epic:      '#9c27b0',
  legendary: '#ff9800',
}

function getPokemonImageUrl(creature: Creature): string {
  const baseId = creature.id.split('-')[0]
  const numericId = baseId.replace(/\D/g, '')
  if (numericId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numericId}.png`
  }
  return creature.img ?? ''
}

export default function Detail({ onBack }: { onBack: () => void }) {
  const { id } = useParams()
  const [creature, setCreature] = useState<Creature | undefined>(undefined)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    fetch('/src/data/creatures.json')
      .then(r => r.json())
      .then((list: Creature[]) => {
        const found = list.find(c => c.id === id || id.startsWith(c.id))
        setCreature(found)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [id])

  if (isLoading) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#fff' }}>
        <div style={{
          width: 40, height: 40,
          border: '4px solid #ffffff22',
          borderTop: '4px solid #ffd166',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        Cargando datos...
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!creature) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#fff' }}>
        <h2>Criatura no encontrada</h2>
        <button
          onClick={onBack}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #ffd166, #f5a623)',
            border: 'none',
            borderRadius: 8,
            color: '#1a1a2e',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: 16
          }}
        >
          Volver
        </button>
      </div>
    )
  }

  const typeColor = TYPE_COLORS[creature.type] ?? '#9e9e9e'
  const rarityColor = RARITY_COLORS[creature.rarity] ?? '#9e9e9e'
  const initials = creature.name.slice(0, 2).toUpperCase()
  const imageUrl = getPokemonImageUrl(creature)

  return (
    <div style={{
      maxWidth: 800,
      margin: '0 auto',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      color: '#fff',
      animation: 'fadeIn 0.4s ease-out'
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
      
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* -- Image Wrapper -- */}
        <div style={{
          position: 'relative',
          width: 260,
          height: 260,
          flexShrink: 0,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #0f172a 0%, #001219 100%)',
          border: `2px solid ${typeColor}55`,
          boxShadow: `0 8px 32px ${typeColor}33`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!imgLoaded && !imgError && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, #1e2a3a 25%, #2e3f55 50%, #1e2a3a 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite'
            }} />
          )}

          {imgError && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 64, fontWeight: 900,
              color: 'rgba(255,255,255,0.9)',
              background: typeColor,
              textShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              {initials}
            </div>
          )}

          {!imgError && (
            <img
              src={imageUrl}
              alt={creature.name}
              style={{
                width: '90%', height: '90%',
                objectFit: 'contain',
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 0.4s ease',
                zIndex: 1,
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))'
              }}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true) }}
              draggable={false}
            />
          )}
        </div>

        {/* -- Content -- */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h1 style={{
              margin: '0 0 8px',
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #fff, #e2e8f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {creature.name}
            </h1>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: typeColor,
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
                boxShadow: `0 2px 8px ${typeColor}55`
              }}>
                {creature.type}
              </span>
              <span style={{
                background: rarityColor,
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: creature.rarity === 'common' ? '#fff' : '#1a1a2e',
                boxShadow: `0 2px 8px ${rarityColor}55`
              }}>
                {creature.rarity}
              </span>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8' }}>
                Nivel {creature.level}
              </span>
            </div>
          </div>

          <p style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: '#cbd5e1',
            margin: 0,
            background: 'rgba(255,255,255,0.03)',
            padding: 16,
            borderRadius: 12,
            borderLeft: `4px solid ${typeColor}`
          }}>
            {creature.desc}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 12,
            marginTop: 8
          }}>
            <StatCard label="HP" value={creature.stats.hp} color="#ef4444" />
            <StatCard label="Ataque" value={creature.stats.attack} color="#f59e0b" />
            <StatCard label="Defensa" value={creature.stats.defense} color="#3b82f6" />
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button
              onClick={onBack}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #334155, #1e293b)',
                border: '1px solid #475569',
                borderRadius: 10,
                color: '#f8fafc',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
            >
              ← Volver al mapa
            </button>
            <button
              onClick={() => {
                const baseId = creature.id.split('-')[0]
                const numericId = baseId.replace(/\D/g, '')
                if (numericId) {
                  window.open(`https://www.pokemon.com/es/pokedex/${numericId}`, '_blank')
                }
              }}
              style={{
                padding: '12px 24px',
                background: `linear-gradient(135deg, ${typeColor}, ${typeColor}dd)`,
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: `0 4px 12px ${typeColor}44`,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 16px ${typeColor}66`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 12px ${typeColor}44`; }}
            >
              📖 Ver en Pokédex
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, #0f172a, #0b1120)',
      padding: '12px 16px',
      borderRadius: 12,
      border: `1px solid ${color}33`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px',
        background: color, borderRadius: '4px 0 0 4px'
      }} />
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8', marginBottom: 4, marginLeft: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginLeft: 8 }}>
        {value}
      </div>
    </div>
  )
}
