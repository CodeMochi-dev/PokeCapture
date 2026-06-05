import React, { useEffect, useState } from 'react'
import CreatureCard from '../components/CreatureCard'
import type { Creature } from '../types'

export default function Home({ 
  capturedBaseIds,
  onCapture, 
  onDetails 
}: { 
  capturedBaseIds: Set<string>,
  onCapture: (c: Creature, success: boolean) => void, 
  onDetails: (c: Creature) => void 
}) {
  const [creatures, setCreatures] = useState<Creature[]>([])
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulamos un leve delay para poder apreciar los skeleton loaders
    // como si estuviera cargando de la pokeapi
    setTimeout(() => {
      fetch('/src/data/creatures.json')
        .then(r => r.json())
        .then(data => {
          setCreatures(data)
          setLoading(false)
        })
    }, 800)
  }, [])

  // Filtrado instantáneo
  let processed = creatures.filter(c => {
    const matchesFilter = filter === 'all' || c.type === filter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Ordenamiento
  if (sortBy === 'levelDesc') processed.sort((a, b) => b.level - a.level)
  else if (sortBy === 'levelAsc') processed.sort((a, b) => a.level - b.level)
  else if (sortBy === 'atkDesc') processed.sort((a, b) => b.stats.attack - a.stats.attack)
  else if (sortBy === 'hpDesc') processed.sort((a, b) => b.stats.hp - a.stats.hp)

  const uniqueTypes = Array.from(new Set(creatures.map(c => c.type))).sort()

  const clearSearch = () => {
    setSearchQuery('')
    // Al limpiar la búsqueda, evitamos submit con un focus management si fuera necesario
  }

  // SKELETON CARD (Estructura idéntica a CreatureCard real)
  const SkeletonCard = () => (
    <div style={{
      display: 'flex', gap: 14, background: 'var(--card-bg-top)', border: '2px solid var(--card-border)',
      padding: 14, borderRadius: 12, overflow: 'hidden'
    }}>
      <style>{`
        @keyframes shimmerLoader {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .shimmer-box { animation: none !important; opacity: 0.6; }
        }
        .shimmer-box {
          background: var(--skeleton-bg);
          background-size: 200% 100%;
          animation: shimmerLoader 1.5s infinite linear;
          border-radius: 6px;
        }
      `}</style>
      
      {/* Avatar skeleton */}
      <div className="shimmer-box" style={{ width: 110, height: 110, borderRadius: 10, flexShrink: 0 }} />
      
      {/* Info skeleton */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="shimmer-box" style={{ width: '50%', height: 20 }} />
          <div className="shimmer-box" style={{ width: 40, height: 16, borderRadius: 20 }} />
        </div>
        <div className="shimmer-box" style={{ width: '40%', height: 14 }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
          <div className="shimmer-box" style={{ width: '100%', height: 12 }} />
          <div className="shimmer-box" style={{ width: '80%', height: 12 }} />
        </div>
        
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 6 }}>
          <div className="shimmer-box" style={{ width: 80, height: 32, borderRadius: 8 }} />
          <div className="shimmer-box" style={{ width: 80, height: 32, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      <div style={{
        display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap',
        background: 'var(--panel-bg)',
        padding: '16px 24px',
        borderRadius: 16,
        border: '1px solid var(--panel-border)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: 0, fontSize: 24, flex: 1, color: 'var(--text-main)' }}>Explorar Pokémon</h2>

        {/* Search input with clean button */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <input 
            type="text"
            placeholder="Buscar Pokémon..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 36px 10px 16px', borderRadius: 8, border: '1px solid var(--input-border)',
              background: 'var(--input-bg)', color: 'var(--text-main)',
              outline: 'none', transition: 'border-color 0.2s ease'
            }}
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              aria-label="Limpiar búsqueda"
              style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', color: 'var(--text-muted)',
                fontSize: 18, cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center'
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Filter select */}
        <select 
          value={filter} 
          onChange={e=>setFilter(e.target.value)}
          style={{
            padding: '10px 16px', borderRadius: 8, border: '1px solid var(--input-border)',
            background: 'var(--input-bg)', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer',
            outline: 'none', appearance: 'none', minWidth: 140
          }}
        >
          <option value="all">Todos los tipos</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Sort select */}
        <select 
          value={sortBy} 
          onChange={e=>setSortBy(e.target.value)}
          style={{
            padding: '10px 16px', borderRadius: 8, border: '1px solid var(--input-border)',
            background: 'var(--input-bg)', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer',
            outline: 'none', appearance: 'none', minWidth: 140
          }}
        >
          <option value="default">Por Defecto</option>
          <option value="levelDesc">Nivel (Mayor a Menor)</option>
          <option value="levelAsc">Nivel (Menor a Mayor)</option>
          <option value="atkDesc">Ataque (Mayor a Menor)</option>
          <option value="hpDesc">HP (Mayor a Menor)</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
        {loading ? (
          // Mostrar 9 skeletons mientras carga
          Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
        ) : processed.length > 0 ? (
          processed.map(c => {
            const isCaptured = capturedBaseIds.has(c.id.split('-')[0])
            return (
              <CreatureCard 
                key={c.id} 
                creature={c} 
                isCaptured={isCaptured}
                onCapture={(cr, success)=>{
                  onCapture(cr, success)
                }} 
                onDetails={(cr)=>onDetails(cr)} 
              />
            )
          })
        ) : (
          // Empty State
          <div style={{ 
            gridColumn: '1 / -1', 
            padding: '64px 24px', 
            textAlign: 'center', 
            background: 'var(--panel-bg)',
            border: '2px dashed var(--panel-border)',
            borderRadius: 16,
            color: 'var(--text-muted)' 
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🔍</div>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>No encontramos a "{searchQuery}"</h3>
            <p style={{ margin: 0, opacity: 0.8 }}>Intenta buscar con otro nombre o asegúrate de que esté bien escrito.</p>
            <button 
              onClick={clearSearch}
              style={{
                marginTop: 24, padding: '10px 20px', background: 'var(--accent)', color: '#1a1a2e',
                border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer'
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
