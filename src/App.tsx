import React, {Suspense, useState} from 'react'
import './App.css';
import GeneralScene from './components/scenes/Scene';
import LandingPage from './components/scenes/LandingPage'

function App() {
  // Define loadable pages
  const Landing = 0
  const Scene = 1

  // Define which page the app has currently loaded
  const [appState, setAppState] = useState(Scene)
  // App configuration (timer, questions custom settings etc.)
  const [config, setConfig] = useState({/*load it from default*/})
  // global check for app pause
    const [paused, setPaused] = useState(false);

    const [playerPosition, setPlayerPosition] = useState("Appellant");
    const [totalTime, setTotalTime] = useState(1200);
    const [questionInterval, setquestionInterval] = useState(5);
    const [randomizeQuestions, setrandomizeQuestions] = useState(false);
    const [delay, setdelay] = useState(false);
    const [firstWarning, setfirstWarning] = useState(600);
    const [secondWarning, setsecondWarning] = useState(300);
    const [introductionTime, setintroductionTime] = useState(150);

    const AQuestionsDefault = [
        "Did not the trial court make some findings of fact that are contrary to your submissions, and should we not defer to those findings of fact?",
        "Should not we presume that the trial judge knows the law and applied the correct law?",
        "Are not some of the facts of the cases you rely upon very different from the facts of this case?",
        "Could you please tell the Court exactly where you are in your Factum at this point?",
        "What does the opposing counsel say about this submission, and why are they not correct?",
        "Could you please tell the Court exactly where you are in your Factum at this point?",
        "What does the opposing counsel say about this submission, and why are they not correct?",
        "As you are aware, we are not bound by any precedents. Could you please tell the Court why we should follow the law in the main authorities that you rely upon?",
        "What are the policy implications of your submissions, and would they take the law in this area in a positive direction? Are there not some risks of interpreting the law in this manner?",
        "What are the implications of your submissions on the goal of keeping our legal rules as simple and predictable as possible?",
        "Were the errors you argue significant enough to justify the remedy you are seeking? In other words, would the result at trial necessarily have been different if those errors did not occur?"
    ]

    const RQuestionsDefault = [
        "Did not some of the evidence at trial support the positions of the Appellant on the issues before this Court?",
        "Is it not the main role of this Court to look for any possible error from the trial below in order to protect against a wrongful conviction?",
        "Are not some of the facts of the cases you rely upon very different from the facts of this case?",
        "Would you agree that the trial judge did not articulate the legal tests as clearly as they could have?",
        "Is there at least a possibility that the trial judge used legal tests inconsistent with those set out in the authorities, and if there is any uncertainty on this issue, should we not err on the side of ordering a new trial?",
        "Could you please tell the Court exactly where you are in your Factum at this point?",
        "What does the opposing counsel say about this submission, and why are they not correct?",
        "As you are aware, we are not bound by any precedents. Could you please tell the Court why we should follow the law in the main authorities that you rely upon?",
        "Your friend also argues that the evidence did not support the findings the trial judge made. Should we be able to reconsider the evidence in this case and conclude that different findings should have been made?",
        "Would you agree that if we find that the trial judge made any errors that there will have to be a new trial ordered?"
    ]

    const [AQuestions, setAQuestions] = useState(AQuestionsDefault);
    const [RQuestions, setRQuestions] = useState(RQuestionsDefault);
    const [stopPresentation, setStopPresentation] = useState(false);


  // Pass function to Landing Page to update app configuration
  const updateConfig = (config) => {
      console.log('New Configuration: ', JSON.stringify(config))
      setConfig({
          playerPosition: setPlayerPosition(playerPosition),
          totalTime: setTotalTime(totalTime),
          questionInterval: setquestionInterval(questionInterval),
          AQuestions: setAQuestions(AQuestions),
          RQuestions: setRQuestions(RQuestions),
          randomizeQuestions: setrandomizeQuestions(randomizeQuestions),
          delay: setdelay(delay),
          firstWarning: setfirstWarning(firstWarning),
          secondWarning: setsecondWarning(secondWarning),
          introductionTime: setintroductionTime(introductionTime),
          stopPresentation: setStopPresentation(stopPresentation)
      })
      chooseConfig(JSON.stringify(config))
    setConfig(config)
    }

    //function gets the first index which indicates what config value is being changed
    function chooseConfig(config) {
        var initialstring = JSON.stringify(config)
        var first = parseInt(initialstring.charAt(0), 10)
        var second = initialstring.slice(1)

        switch (first) {
            case 1:
                setPlayerPosition(second)
                break;

            case 2:
                setTotalTime(parseInt(second))
                break;

            case 3:
                setquestionInterval(parseInt(second))
                break;

            case 4:
                setAQuestions([second])
                break;

            case 5:
                setRQuestions([second])
                break;

            case 6:
                setrandomizeQuestions(second === 'true')
                break;

            case 7:
                setdelay(second === 'true')
                break;

            case 8:
                setfirstWarning(parseInt(second))
                break;

            case 9:
                setsecondWarning(parseInt(second))
                break;

            case 10:
                setintroductionTime(parseInt(second))
                break;

            default:
                break;
        }



    }
  // Change app state (use to travel from scene to setup page)
  const updateState = (appState) => {
    console.log("Change app state to:", appState)
    setAppState(appState)
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
    {(appState === Landing) ? <LandingPage updateAppState={updateState} updateConfig={updateConfig}></LandingPage> : null}
    {/* Send in the app configuration and "paused" boolean to the main app*/}
    {(appState === Scene) ? <GeneralScene appConfig={config} appPaused={paused} togglePause={pauseHandler} updateAppState={updateState}></GeneralScene> : null}
    </div>
    </Suspense>
  );
}
export default App;
