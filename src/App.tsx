import React, {Suspense, useState} from 'react'
import './App.css';
import GeneralScene from './components/scenes/Scene';
import LandingPage from './components/scenes/LandingPage'
import defaultData from './components/general/default_settings.json';


function App() {
  // Define loadable pages
  const Landing = 0
  const Scene = 1

  // Define which page the app has currently loaded
  const [appState, setAppState] = useState(Landing)
  // App configuration (timer, questions custom settings etc.)
  const [config, setConfig] = useState(defaultData);
  // global check for app pause
  const [paused, setPaused] = useState(false);

  const updateConfig = (config) => {
    console.log('New Configuration: ', JSON.stringify(config))
    setConfig(config)
  }

  // Change app state (use to travel from scene to setup page)
  const updateState = (appState) => {
    console.log("Change app state to:", appState)
    setAppState(appState)
    console.log("current config is:", config)
  }

  // Upon being called, set the "isPaused" value to be opposite from the previous value
  const pauseHandler = () => {
    setPaused(prev => !prev)
    console.log("pause toggled, App Paused?", paused)
  }

  return (
    <Suspense fallback={null}>
    <div style={{height: '100vh'}}>
    {/* Send in the app configuration to be edited by the Landing Page*/}
    {(appState === Landing) ? <LandingPage updateAppState={updateState} updateConfig={updateConfig} config={config}></LandingPage> : null}
    {/* Send in the app configuration and "paused" boolean to the main app*/}
    {(appState === Scene) ? <GeneralScene appConfig={config} appPaused={paused} togglePause={pauseHandler} updateAppState={updateState}></GeneralScene> : null}
    </div>
    </Suspense>
  );
}
export default App;
