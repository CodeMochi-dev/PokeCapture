export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Creature {
  id: string
  name: string
  type: string
  level: number
  rarity: Rarity
  desc?: string
  baseCaptureChance: number
  img?: string
  stats: { hp: number; attack: number; defense: number }
}
