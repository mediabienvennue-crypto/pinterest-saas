'use client'

const STORAGE_KEY = 'planner_credits'
const DAILY_LIMIT = 2
const BONUS_CREDITS = 3

export function getCredits() {
  if (typeof window === 'undefined') return DAILY_LIMIT
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DAILY_LIMIT

    const data = JSON.parse(stored)
    const today = new Date().toDateString()

    // Reset daily credits if it's a new day
    if (data.date !== today) {
      const reset = { date: today, used: 0, bonus: data.bonus || 0 }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reset))
      return DAILY_LIMIT + reset.bonus
    }

    const remaining = Math.max(0, DAILY_LIMIT - data.used + (data.bonus || 0))
    return remaining
  } catch {
    return DAILY_LIMIT
  }
}

export function useCredit() {
  if (typeof window === 'undefined') return false

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const today = new Date().toDateString()
    
    let data = stored ? JSON.parse(stored) : { date: today, used: 0, bonus: 0 }
    
    if (data.date !== today) {
      data = { date: today, used: 0, bonus: 0 }
    }

    const remaining = DAILY_LIMIT + (data.bonus || 0) - data.used
    if (remaining <= 0) return false

    data.used = (data.used || 0) + 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function addBonusCredits() {
  if (typeof window === 'undefined') return DAILY_LIMIT

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const today = new Date().toDateString()
    
    let data = stored ? JSON.parse(stored) : { date: today, used: 0, bonus: 0 }
    
    if (data.date !== today) {
      data = { date: today, used: 0, bonus: 0 }
    }

    data.bonus = (data.bonus || 0) + BONUS_CREDITS
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    
    return DAILY_LIMIT + data.bonus - data.used
  } catch {
    return DAILY_LIMIT
  }
}

export function hasShareBonus() {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return false
    const data = JSON.parse(stored)
    return (data.bonus || 0) > 0
  } catch {
    return false
  }
}
