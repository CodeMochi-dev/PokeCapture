import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { Creature } from '../types'
import confetti from 'canvas-confetti'

// Helper to get image URL
function getPokemonImageUrl(creature: Creature): string {
  const baseId = creature.id.split('-')[0]
  const numericId = baseId.replace(/\D/g, '')
  if (numericId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numericId}.png`
  }
  return creature.img ?? ''
}

export default function MapView({ onDetails, onCapture }: { onDetails?: (c: Creature) => void, onCapture?: (c: Creature, success: boolean) => void }){
  const [creatures, setCreatures] = useState<Creature[]>([])
  const mapRef = useRef<any>(null)

  useEffect(()=>{
    fetch('/api/creatures')
      .then(r => r.json())
      .then((data: any[]) => {
        if (!data || data.length === 0 || !Array.isArray(data[0].coords)) {
          return fetch('/src/data/creatures.json').then(r=>r.json()).then(setCreatures)
        }
        setCreatures(data)
      })
      .catch(()=>{
        fetch('/src/data/creatures.json').then(r=>r.json()).then(setCreatures)
      })
  },[])

  // EFECTO DE MOVIMIENTO (ROAMING)
  useEffect(() => {
    if (creatures.length === 0) return;
    const interval = setInterval(() => {
      setCreatures(prev => prev.map(c => {
        // Movimiento aleatorio muy pequeño (simulando caminar)
        const moveLat = (Math.random() - 0.5) * 0.001;
        const moveLng = (Math.random() - 0.5) * 0.001;
        return {
          ...c,
          coords: [c.coords[0] + moveLat, c.coords[1] + moveLng]
        }
      }))
    }, 3000); // Se mueven cada 3 segundos
    return () => clearInterval(interval);
  }, [creatures.length]);


  // default center
  const center: [number, number] = creatures.length ? (creatures[0].coords as [number, number]) : [-33.4489, -70.6693]
  const defaultZoom = 13

  const handleCapture = (c: Creature) => {
    if (onCapture) {
      // El Pokémon en el mapa siempre se captura con éxito (no tiene lanzamiento de dado)
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 } })
      onCapture(c, true)
    }
  }

  // Create custom marker icon using the Pokemon's image
  const createCustomIcon = (c: Creature) => {
    const imgUrl = getPokemonImageUrl(c);
    
    // We create a custom DivIcon with HTML rendering our circular image frame
    const html = `
      <div style="
        width: 48px; height: 48px;
        background: linear-gradient(135deg, #0f172a, #0b1120);
        border: 2px solid #ffd166;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        overflow: hidden;
      ">
        <img src="${imgUrl}" style="width: 85%; height: 85%; object-fit: contain;" />
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-pokemon-marker',
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24]
    })
  }

  return (
    <div style={{height:'80vh',padding:16, animation: 'fadeIn 0.4s ease'}}>
      <style>{`
        .custom-pokemon-marker { background: transparent; border: none; }
        .leaflet-popup-content-wrapper { background: #0f172a; color: #fff; border: 1px solid #1e293b; border-radius: 12px; }
        .leaflet-popup-tip { background: #0f172a; }
      `}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Radar de la zona</h2>
        <span style={{ background: '#1e293b', padding: '6px 12px', borderRadius: 20, fontSize: 13, color: '#94a3b8' }}>
          {creatures.length} Pokémon detectados cerca
        </span>
      </div>

      <MapContainer center={center} zoom={defaultZoom} whenCreated={map => (mapRef.current = map)} style={{height:'calc(100% - 40px)',borderRadius:16,overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.3)'}}>
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <MarkerClusterGroup>
          {creatures.map(c => (
            <Marker key={c.id} position={c.coords as [number, number]} icon={createCustomIcon(c)}>
              <Popup>
                <div style={{minWidth:180}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <img src={getPokemonImageUrl(c)} alt={c.name} style={{width:50,height:50,objectFit:'contain',filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'}} />
                    <div>
                      <strong style={{ fontSize: 16 }}>{c.name}</strong>
                      <div style={{fontSize:12, color:'#94a3b8', marginTop: 2}}>{c.type} • Nivel {c.level}</div>
                    </div>
                  </div>
                  
                  <div style={{marginTop:16, display: 'flex', gap: 8}}>
                    <button 
                      onClick={()=>handleCapture(c)} 
                      style={{
                        flex:1, padding:'8px', borderRadius:8, border:'none',
                        background:'linear-gradient(135deg, #06d6a0, #04a67a)', color:'#fff', fontWeight:700, cursor:'pointer'
                      }}
                    >
                      Capturar
                    </button>
                    <button 
                      onClick={()=>onDetails && onDetails(c)} 
                      style={{
                        flex:1, padding:'8px', borderRadius:8, border:'none',
                        background:'linear-gradient(135deg, #ffd166, #f5a623)', color:'#1a1a2e', fontWeight:700, cursor:'pointer'
                      }}
                    >
                      Detalles
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
