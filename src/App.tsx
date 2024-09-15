import './App.css'
import { BetArea } from './components/BetArea'
import { RoundHistory } from './components/RoundHistory'

import { GameCanvasArea } from './components/GameCanvasArea';
import { ThemeProvider } from './components/ThemeProvider';

import { gameplay } from './models/gameplay/gameplay';
import { UserTitle } from './components/UserTitle';

gameplay;

function App() {

  return (
    <ThemeProvider defaultTheme="dark">
      <UserTitle />
      <RoundHistory />
      <GameCanvasArea />
      <BetArea />
    </ThemeProvider>
  )
}

export default App
