import { createContext, useContext, useState } from 'react'

const TeamContext = createContext(null)

export function TeamProvider({ children }) {
  const [teamMode, setTeamMode] = useState(() => {
    return sessionStorage.getItem('teamMode') || 'blue'
  })

  const toggleTeam = () => {
    const next = teamMode === 'blue' ? 'red' : 'blue'
    setTeamMode(next)
    sessionStorage.setItem('teamMode', next)
  }

  const setTeam = (mode) => {
    if (mode === 'blue' || mode === 'red') {
      setTeamMode(mode)
      sessionStorage.setItem('teamMode', mode)
    }
  }

  return (
    <TeamContext.Provider value={{ teamMode, toggleTeam, setTeam }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeamMode() {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeamMode must be used within TeamProvider')
  return ctx
}
