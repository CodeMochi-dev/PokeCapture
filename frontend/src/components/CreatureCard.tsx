import React, { useState } from 'react'
import styles from './CreatureCard.module.css'
import type { Creature } from '../types'
import confetti from 'canvas-confetti'

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

function getPokemonImageUrl(creature: Creature): string {
  const baseId = creature.id.split('-')[0]
  const numericId = baseId.replace(/\D/g, '')
  if (numericId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numericId}.png`
  }
  return creature.img ?? ''
}

export default function CreatureCard({
  creature,
  onCapture,
  onDetails,
  selected,
  hideCapture,
  onRelease,
  isCaptured
}: {
  creature: Creature
  onCapture?: (c: Creature, success: boolean) => void
  onDetails?: (c: Creature) => void
  selected?: boolean
  hideCapture?: boolean
  onRelease?: (c: Creature) => void
  isCaptured?: boolean
}) {
  const [anim, setAnim]           = useState(false)
  const [fadeOut, setFadeOut]     = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError]   = useState(false)
  const [hovered, setHovered]     = useState(false)

  const typeColor = TYPE_COLORS[creature.type] ?? '#9e9e9e'
  const initials  = creature.name.slice(0, 2).toUpperCase()
  const imageUrl  = getPokemonImageUrl(creature)

  const rarityModifier = (r: string) => {
    switch (r) {
      case 'common':    return 0
      case 'rare':      return -0.1
      case 'epic':      return -0.25
      case 'legendary': return -0.45
      default:          return 0
    }
  }

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = 800
      o.connect(g)
      g.connect(ctx.destination)
      g.gain.setValueAtTime(0.0001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01)
      o.start()
      setTimeout(() => {
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05)
        o.stop()
        ctx.close()
      }, 120)
    } catch { }
  }

  const attemptCapture = () => {
    if (isCaptured) return; // Prevent double capture
    
    setAnim(true)
    const base       = creature.baseCaptureChance
    const lvlPenalty = creature.level * 0.01
    const chance     = Math.max(0.05, base + rarityModifier(creature.rarity) - lvlPenalty)
    const success    = Math.random() < chance
    
    if (onCapture) {
      if (success) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 } })
        playBeep()
        // Wait for pokeball animation before fading out
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(() => {
            onCapture(creature, true)
            setAnim(false)
          }, 500) // Match CSS opacity transition
        }, 600) // Match pokeball animation
      } else {
        setTimeout(() => {
          onCapture(creature, false)
          setAnim(false)
        }, 700)
      }
    }
  }

  const isHighlighted = selected || hovered
  
  // Assign rarity class based on type
  const rarityClass = styles[`rarity_${creature.rarity}`] || styles.rarity_common;
  const cardClasses = [
    styles.card,
    fadeOut ? styles.fadeOut : '',
    creature.rarity === 'legendary' ? styles.cardLegendary : ''
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cardClasses}
      style={{ borderColor: isHighlighted ? 'var(--accent)' : 'var(--card-border)', boxShadow: isHighlighted ? '0 0 18px rgba(255, 209, 102, 0.3)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.avatarWrap}>
        {!imgLoaded && !imgError && <div className={styles.skeleton} aria-hidden />}
        {imgError && (
          <div className={styles.placeholder} style={{ background: typeColor }} aria-label={`Imagen no disponible de ${creature.name}`}>
            {initials}
          </div>
        )}
        {!imgError && (
          <img
            src={imageUrl}
            alt={creature.name}
            className={styles.pokemonImg}
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true) }}
            draggable={false}
          />
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <div>
            <strong style={{ fontSize: 16 }}>{creature.name}</strong>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
              <span className={styles.typeBadge} style={{ background: typeColor }}>
                {creature.type}
              </span>
              {' '}• Nivel {creature.level}
            </div>
          </div>
          <div className={`${styles.rarityBadge} ${rarityClass}`}>
            {creature.rarity.toUpperCase()}
          </div>
        </div>

        <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.4, marginBottom: 8 }}>
          {creature.desc}
        </div>

        <div className={styles.buttons}>
          {!hideCapture && onCapture && (
            <button
              className={`${styles.btnCapture} ${isCaptured ? styles.btnCaptured : ''}`}
              onClick={attemptCapture}
              disabled={isCaptured || anim || fadeOut}
              aria-label={isCaptured ? 'Capturado' : 'Capturar'}
            >
              {isCaptured ? '✓ Capturado' : '⚡ Capturar'}
              {anim && !isCaptured && <div className={styles.pokeballAnim}></div>}
            </button>
          )}
          {onRelease && (
            <button
              style={{
                padding: '8px 14px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', borderRadius: 8,
                color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 2px 8px rgba(239,68,68,0.35)'
              }}
              onClick={() => onRelease(creature)}
            >
              🗑️ Liberar
            </button>
          )}
          <button
            className={styles.btnDetails}
            onClick={() => onDetails && onDetails(creature)}
          >
            🔍 Detalles
          </button>
        </div>
      </div>
    </div>
  )
}
