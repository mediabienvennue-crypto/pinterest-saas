// YouPlanAI - Enterprise Credit Management System

const STORAGE_KEY = 'youplanai_credits';
const INITIAL_CREDITS = 10; // 10 initial credits for 5 attempts
const SEARCH_COST = 2;      // Deduct 2 credits per AI generation

export function getCredits() {
  if (typeof window === 'undefined') return INITIAL_CREDITS;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) {
    localStorage.setItem(STORAGE_KEY, INITIAL_CREDITS.toString());
    return INITIAL_CREDITS;
  }
  return parseInt(stored, 10);
}

export function deductSearchCredits() {
  if (typeof window === 'undefined') return false;
  
  const current = getCredits();
  if (current >= SEARCH_COST) {
    const nextCredits = current - SEARCH_COST;
    localStorage.setItem(STORAGE_KEY, nextCredits.toString());
    return true; 
  }
  return false; 
}

export function hasShareBonus() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('youplanai_shared') === 'true';
}

export function addBonusCredits(amount = 4) { 
  if (typeof window === 'undefined') return;
  
  const current = getCredits();
  localStorage.setItem(STORAGE_KEY, (current + amount).toString());
  localStorage.setItem('youplanai_shared', 'true');
}
