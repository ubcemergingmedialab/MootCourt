import React, {Suspense, useState} from 'react'
import './App.css';
import GeneralScene from './components/scenes/Scene';
import LandingPage from './components/scenes/LandingPage'

function App() {
  // Define loadable pages
  const Landing = 0
  const Scene = 1

  const [appState, setAppState] = useState(Landing)
  const [config, setConfig] = useState({})
  const [paused, setPaused] = useState(false);

  return (
    <Suspense fallback={null}>
    <div style={{height: '100vh'}}>
    {(appState === Landing) ? <LandingPage></LandingPage> : null}
    {(appState === Scene) ? <GeneralScene></GeneralScene> : null}
    </div>
    </Suspense>
  );
}
export default App;
