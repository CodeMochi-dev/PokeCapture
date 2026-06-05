import React, { useEffect, useState, useRef } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import Login from './pages/Login'
import Detail from './pages/Detail'
import MapView from './pages/Map'
import Profile from './pages/Profile'
import type { Creature } from './types'

function getPokemonImageUrl(creature: Creature): string {
  const baseId = creature.id.split('-')[0]
  const numericId = baseId.replace(/\D/g, '')
  if (numericId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numericId}.png`
  }
  return creature.img ?? ''
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collection, setCollection] = useState<Creature[]>([])
  const [user, setUser] = useState<string | null>(null)
  
  // Estado para la pantalla Pokédex y Theming
  const [captureModal, setCaptureModal] = useState<{ creature: Creature; success: boolean } | null>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  // Para animación del contador
  const [counterAnim, setCounterAnim] = useState(false)
  const prevCollectionLength = useRef(0)

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('collection')
      if (raw) setCollection(JSON.parse(raw))
      const u = localStorage.getItem('user')
      if (u) {
        setUser(u)
      } else if (location.pathname !== '/login') {
        navigate('/login')
      }
      const t = localStorage.getItem('theme') as 'dark' | 'light'
      if (t) setTheme(t)
    }catch(e){console.warn(e)}
  },[])

  // Sincronizar tema con HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Trigger animación cuando collection crece
  useEffect(() => {
    if (collection.length > prevCollectionLength.current) {
      setCounterAnim(true)
      setTimeout(() => setCounterAnim(false), 400)
    }
    prevCollectionLength.current = collection.length
    try{ localStorage.setItem('collection', JSON.stringify(collection)) }catch(e){console.warn(e)}
  }, [collection])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const addToCollection = (c: Creature) => setCollection(prev => [c, ...prev])
  
  const removeFromCollection = (idToRemove: string) => {
    setCollection(prev => prev.filter(c => c.id !== idToRemove))
  }

  const handleLogin = (name: string) => {
    setUser(name)
    localStorage.setItem('user', name)
    navigate('/profile')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleCaptureTrigger = (c: Creature, success: boolean) => {
    const newCreature = { ...c, id: c.id.split('-')[0] + '-' + Date.now() }
    if (success) addToCollection(newCreature)
    setCaptureModal({ creature: newCreature, success })
  }

  const closeModal = () => setCaptureModal(null)

  // Extraer IDs capturados base para pasar a los hijos
  const capturedBaseIds = new Set(collection.map(c => c.id.split('-')[0]))

  // Estilos condicionales para la navegación activa
  const navLinkStyle = (path: string) => ({
    padding: '8px 12px',
    borderRadius: 8,
    color: location.pathname === path ? 'var(--accent)' : 'var(--text-muted)',
    textDecoration: 'none',
    fontWeight: location.pathname === path ? 800 : 600,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 4,
    transition: 'all 0.2s ease',
    background: location.pathname === path ? 'rgba(255, 209, 102, 0.1)' : 'transparent'
  })

  return (
    <div className="app-container" style={{minHeight:'100vh', display: 'flex', flexDirection: 'column'}}>
      <style>{`
        @keyframes counterPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); color: var(--accent); }
          100% { transform: scale(1); }
        }
        .counter-badge {
          display: inline-block;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .counter-badge.pop {
          animation: counterPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
      
      {/* HEADER SUPERIOR (Desktop) */}
      {user && (
        <header className="desktop-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 24px',borderBottom:'2px solid var(--panel-border)', background: 'var(--header-bg)', transition: 'all 0.3s'}}>
          <h1 style={{margin:0, fontSize: 24, background: 'linear-gradient(135deg, #ffd166, #f5a623)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            PokéCapture
          </h1>
          <nav style={{display:'flex',gap:16,alignItems:'center'}}>
            <Link to="/" style={navLinkStyle('/')}>Explorar</Link>
            <Link to="/map" style={navLinkStyle('/map')}>Mapa</Link>
            <Link to="/inventory" style={navLinkStyle('/inventory')}>
              Colección (<span className={`counter-badge ${counterAnim ? 'pop' : ''}`}>{collection.length}</span>)
            </Link>
            
            <button 
              onClick={toggleTheme} 
              aria-label="Toggle dark mode"
              style={{background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', padding: '6px 12px', borderRadius: 20, color: 'var(--text-main)', fontSize: 16}}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <Link to="/profile" style={{...navLinkStyle('/profile'), padding: '6px 12px', background: 'var(--panel-bg)', border: '1px solid var(--panel-border)'}}>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span style={{fontSize: 16}}>👤</span>
                <span style={{opacity:0.9, fontWeight: 600, color: 'var(--text-main)'}}>{user}</span>
              </div>
            </Link>
          </nav>
        </header>
      )}

      {/* BARRA DE PROGRESO */}
      {user && (
        <div style={{ background: 'var(--panel-bg)', padding: '12px 24px', borderBottom: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>
            <span>Capturados</span>
            <span>{collection.length} / 151 Pokémon</span>
          </div>
          <div style={{ width: '100%', height: 8, background: 'var(--input-bg)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ 
              width: `${Math.min(100, (collection.length / 151) * 100)}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #ffd166, #f5a623)',
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' 
            }} />
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main style={{flex: 1, overflowY: 'auto', paddingBottom: 80}}>
        <Routes>
          <Route path="/" element={<Home capturedBaseIds={capturedBaseIds} onCapture={handleCaptureTrigger} onDetails={(c)=>navigate(`/detail/${c.id}`)} />} />
          <Route path="/map" element={<MapView onCapture={handleCaptureTrigger} onDetails={(c)=>navigate(`/detail/${c.id}`)} />} />
          <Route path="/inventory" element={<Inventory collection={collection} onRelease={removeFromCollection} />} />
          <Route path="/detail/:id" element={<Detail onBack={()=>navigate(-1)} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/profile" element={<Profile user={user} collection={collection} onLogout={handleLogout} />} />
        </Routes>
      </main>

      {/* NAVEGACIÓN INFERIOR (Mobile) */}
      {user && (
        <nav className="mobile-nav" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--header-bg)', borderTop: '1px solid var(--panel-border)',
          display: 'flex', justifyContent: 'space-around', padding: '8px 8px 24px 8px',
          zIndex: 1000,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.2)'
        }}>
          <Link to="/" style={navLinkStyle('/')}>
            <span style={{fontSize: 20}}>🌍</span>
            <span style={{fontSize: 11}}>Explorar</span>
          </Link>
          <Link to="/map" style={navLinkStyle('/map')}>
            <span style={{fontSize: 20}}>🗺️</span>
            <span style={{fontSize: 11}}>Radar</span>
          </Link>
          <Link to="/inventory" style={navLinkStyle('/inventory')}>
            <span style={{fontSize: 20}}>🎒</span>
            <span style={{fontSize: 11}}>Mochila</span>
          </Link>
          <Link to="/profile" style={navLinkStyle('/profile')}>
            <span style={{fontSize: 20}}>👤</span>
            <span style={{fontSize: 11}}>Perfil</span>
          </Link>
          <button onClick={toggleTheme} aria-label="Toggle theme" style={{background:'transparent', border:'none', padding: '8px 12px', display:'flex', flexDirection:'column', alignItems:'center', gap:4}}>
            <span style={{fontSize: 20}}>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span style={{fontSize: 11, color: 'var(--text-muted)'}}>Tema</span>
          </button>
        </nav>
      )}

      {/* ====== MODAL POKÉDEX ====== */}
      {captureModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'var(--modal-overlay)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
            animation: 'pokedexFadeIn 0.35s ease-out'
          }}
          onClick={closeModal}
        >
          <style>{`
            @keyframes pokedexFadeIn { from { opacity:0; transform: scale(0.92); } to { opacity:1; transform: scale(1); } }
            @keyframes floatPokemon {
              0%,100% { transform: translateY(0); filter: drop-shadow(0 0 24px rgba(255,209,102,0.6)); }
              50% { transform: translateY(-12px); filter: drop-shadow(0 0 40px rgba(255,209,102,0.9)); }
            }
            @keyframes escapeShake {
              0%,100% { transform: translateX(0); }
              20%,60% { transform: translateX(-8px); }
              40%,80% { transform: translateX(8px); }
            }
          `}</style>

          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 420,
              background: captureModal.success ? '#dc2626' : '#1e293b',
              borderRadius: 24,
              border: `4px solid ${captureModal.success ? '#991b1b' : '#475569'}`,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.7)'
            }}
          >
            {/* Pokédex UI Omitted for brevity, keeping it identical to previous */}
            <div style={{ padding: '12px 20px', display: 'flex', gap: 10, alignItems: 'center', background: captureModal.success ? '#ef4444' : '#334155', borderBottom: `4px solid ${captureModal.success ? '#b91c1c' : '#475569'}`}}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', border: '3px solid #fff', boxShadow: '0 0 10px #3b82f6' }} />
              <div style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
                {['#ef4444','#eab308','#22c55e'].map(clr => (
                  <div key={clr} style={{ width: 12, height: 12, borderRadius: '50%', background: clr, border: '1px solid rgba(0,0,0,0.2)' }} />
                ))}
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                {captureModal.success ? '● POKÉDEX' : '○ POKÉDEX'}
              </div>
            </div>

            <div style={{ background: '#f1f5f9', margin: '20px 20px 0', borderRadius: 16, border: '14px solid #e2e8f0', borderBottomWidth: 28 }}>
              <div style={{
                background: captureModal.success ? 'linear-gradient(145deg, #0f172a, #1e1b4b)' : 'linear-gradient(145deg, #1e293b, #0f172a)',
                borderRadius: 8, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)', pointerEvents: 'none' }} />
                <img
                  src={getPokemonImageUrl(captureModal.creature)}
                  alt={captureModal.creature.name}
                  style={{
                    width: '70%', height: '70%', objectFit: 'contain',
                    animation: captureModal.success ? 'floatPokemon 3s ease-in-out infinite' : 'escapeShake 0.5s ease 0.3s 2',
                    filter: captureModal.success ? 'drop-shadow(0 0 20px rgba(255,209,102,0.6))' : 'drop-shadow(0 0 10px rgba(239,68,68,0.5)) grayscale(0.4)',
                    position: 'relative', zIndex: 1
                  }}
                />
              </div>
            </div>

            <div style={{ padding: '12px 20px 20px', color: '#fff' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: 16 }}>
                {captureModal.success ? (
                  <>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>REGISTRO COMPLETADO</div>
                    <h2 style={{ margin: '0 0 8px', fontSize: 26, color: '#ffd166', letterSpacing: 0.5 }}>
                      ¡{captureModal.creature.name} capturado!
                    </h2>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>REGISTRO FALLIDO</div>
                    <h2 style={{ margin: '0 0 8px', fontSize: 26, color: '#f87171', letterSpacing: 0.5 }}>
                      ¡{captureModal.creature.name} escapó!
                    </h2>
                  </>
                )}
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <span style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                    {captureModal.creature.type.toUpperCase()}
                  </span>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 6, fontSize: 12 }}>
                    NV {captureModal.creature.level}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                  {captureModal.success ? captureModal.creature.desc : 'El Pokémon fue demasiado rápido. ¡Inténtalo de nuevo!'}
                </p>
              </div>

              <button
                onClick={closeModal}
                style={{
                  width: '100%', marginTop: 16, padding: 14, borderRadius: 12, border: 'none',
                  background: captureModal.success ? 'linear-gradient(135deg, #ffd166, #f5a623)' : 'linear-gradient(135deg, #475569, #334155)',
                  color: captureModal.success ? '#1a1a2e' : '#fff',
                  fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 0.5,
                  boxShadow: captureModal.success ? '0 6px 20px rgba(255,209,102,0.4)' : 'none',
                  transition: 'transform 0.1s'
                }}
                onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
                onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                {captureModal.success ? '¡Aceptar!' : 'Volver a intentar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
