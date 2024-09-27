import './App.css'
import { BetArea } from './components/BetArea'
import { RoundHistory } from './components/RoundHistory'

import { GameCanvasArea } from './components/GameCanvasArea';
import { ThemeProvider } from './components/ThemeProvider';

import { gameplay } from './models/gameplay/gameplay';
import { TopBar } from './components/TopBar';

gameplay;

function App() {

  return (
    <ThemeProvider defaultTheme="dark">
      <TopBar />
      <RoundHistory />
      <GameCanvasArea />
      <BetArea />
    </ThemeProvider>
  )
}

export default App
