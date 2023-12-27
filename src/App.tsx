import React, {lazy, Suspense, useEffect, useState} from 'react'
import './App.css';
import GeneralScene from './components/scenes/Scene';
import LandingPage from './components/scenes/LandingPage'
import defaultData from './components/general/default_settings.json';
import AppLoader from './components/general/AppLoader'

function App() {
  // Define loadable pages
  const Landing = 0
  const Scene = 1
  const EndPage = 3
  const LazyLandingP = lazy(() => import('./components/scenes/LandingPage'));
  const LazyGeneralS = lazy(() => import('./components/scenes/Scene'));
  const LazyGeneralE = lazy(() => import('./components/scenes/EndPage'));
  const [subtitleText, setSubtitleText] = useState('');


  // Define which page the app has currently loaded
  const [appState, setAppState] = useState(Landing)
  // App configuration (timer, questions custom settings etc.)
  const [config, setConfig] = useState(defaultData);
  // global check for app pause
  const [paused, setPaused] = useState(false);
  const [judgeElapsedTime, setJudgeElapsedTime] = useState(0);

  const updateConfig = (config) => {
    console.log('New Configuration: ', JSON.stringify(config))
    setConfig(config)
  }

  // Change app state (use to travel from scene to setup page)
  // const updateState = (appState) => {
  //   console.log("Change app state to:", appState)
  //   setAppState(appState)
  //   console.log("current config is:", config)
  // }
  const updateState = (appState) => {
    setAppState(appState);
    if (appState === Scene) {
      setSubtitleText(config.judgeIntroSpeech); // Set the initial subtitle text to the judge's intro speech
    }
    console.log("current config is:", config);
  };

  // Upon being called, set the "isPaused" value to be opposite from the previous value
  const pauseHandler = () => {
    setPaused(prev => !prev)
    console.log("pause toggled, App Paused?", paused)
  }

  // Manual timer to ensure consistent minimum loading time
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setLoading(false), 5000)
  }, [])

  return (
    <>
    {loading === false ? (
    <Suspense fallback={<AppLoader />}>
    <div style={{height: '100vh'}}>
    {/* Send in the app configuration to be edited by the Landing Page*/}
    {(appState === Landing) ? 
    <LazyLandingP
        setPaused={setPaused}
        updateAppState={updateState}
        updateConfig={updateConfig}
        config={config}>
    </LazyLandingP> : null}
     {(appState === EndPage) ? 
    <LazyGeneralE
        updateAppState={updateState}
        updateConfig={updateConfig}
        config={config}
        judgeElapsedTime={judgeElapsedTime}>
    </LazyGeneralE> : null
     }
    {/* Send in the app configuration and "paused" boolean to the main app*/}
    {(appState === Scene) ?
    <LazyGeneralS
        setPaused={setPaused}
        appConfig={config}
        appPaused={paused}
        togglePause={pauseHandler}
        updateAppState={updateState}
        updateConfig={updateConfig}
        judgeElapsedTime={judgeElapsedTime}
        setJudgeElapsedTime ={setJudgeElapsedTime}>
    </LazyGeneralS> : null}
    </div>
    </Suspense>
    ) : (
      <AppLoader />
    )} </>
  );
}
export default App;
