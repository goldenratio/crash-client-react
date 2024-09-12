// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useEffect, useState } from 'react';
import './App.css'
import { BetArea } from './components/BetArea'
import { RoundHistory } from './components/RoundHistory'

import { GameCanvasArea } from './components/GameCanvasArea';
import { ThemeProvider } from './components/ThemeProvider';
// import { ThemeModeToggle } from './components/ThemeModeToggle';


function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="crash-client-ui-theme">
      {/* <ThemeModeToggle></ThemeModeToggle> */}
      <RoundHistory />
      <GameCanvasArea />
      <BetArea />
    </ThemeProvider>
  )
}

export default App
