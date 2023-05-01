# Moot Court Development Documentation
Refer to the following instructions to understand the Moot Court codebase. 

## Suggestions on Project Strcuture
*Regardless of the tech stack used, the following structure would be beneficial for reusable and easy-to-understand code.*
- Separate components of avatar (voice, animation) to control them separately, while they reference some common values (whether the speech has started etc.)
- A timer component whose time can be customized by user input from the UI, count down, able to be paused and restarted (+ can add additional time if the user presses snooze)
- The judge's speech component, separate from the general timer, which can track the amount of time left in each interval, or what phrase the judge was speaking when she was paused etc.
- Reusable structure for scenes / judges / speeches etc., using inheritance (or prefabs for unity)
- Read the judge speech and customized app options from a JSON file instead of hardcoding it to reduce repetition
- Organize similar / related files in one folder so it is easier to keep track of it
- As with every software project, reusable code + readable documentation + frequent commits are *crucial* for project longevity

## General Development Notes
- Coming from a C# or Object-Oriented Programming, the way variables and functions are passed around in this project may not be intuitive immediately. The core principle that the development team of 2022W1-W2 focused on are the following:
- 1) Minimize repetition. If data needs to be modified or accessed by multiple scripts, put it at the topmost level so it can be passed down in the return statements. For example, the config object used to signify the entire app's setting is declared here, and whenever the config changes, this config is the one being modified. https://github.com/ubcemergingmedialab/MootCourt/blob/201ee9ae5dd767645f785b54bbfbd3fad5819266/src/App.tsx#L16
- The default value for this config object is stored in a json file. If the app extends to support external databases, or if the app wants to support saving and loading config files from previous runs of the application, it can be easily updated without modifying the existing codebase and worrying about inconsistencies of repeated code. https://github.com/ubcemergingmedialab/MootCourt/blob/201ee9ae5dd767645f785b54bbfbd3fad5819266/src/components/general/default_settings.json#L1-L23
- 2) If States of the app have to be modified by different scripts (ie. is the app in paused state? Is the app in the Landing or Scene state?), pass down the corresponding setting functions. 
- 3) If the setting function function needs to do extra things on top of modifying the state, you can create "helper functions" and pass those down instead. 
- Say that, every time the app state changes, we want the console to indicate what the current config is and what app state we are changing to. You can write a helper to do this, when given a new app state as its parameter, it prints the appstate, config and changes the appState to the new parameter value.  https://github.com/ubcemergingmedialab/MootCourt/blob/201ee9ae5dd767645f785b54bbfbd3fad5819266/src/App.tsx#L26-L30
- Sometimes the function may not take a parameter, but it could toggle the existing value. An example of this could be the pauseHandler: https://github.com/ubcemergingmedialab/MootCourt/blob/201ee9ae5dd767645f785b54bbfbd3fad5819266/src/App.tsx#L33-L36
- For example, consider this state and setting function pair: https://github.com/ubcemergingmedialab/MootCourt/blob/201ee9ae5dd767645f785b54bbfbd3fad5819266/src/App.tsx#L14 
- All scripts that can change the appState should receive the helper (updateState) that contains the setting function(setAppState). 
https://github.com/ubcemergingmedialab/MootCourt/blob/201ee9ae5dd767645f785b54bbfbd3fad5819266/src/App.tsx#L26-L30
- As the landing page needs to change the app state from Landing to Scene, it receives the function here: https://github.com/ubcemergingmedialab/MootCourt/blob/201ee9ae5dd767645f785b54bbfbd3fad5819266/src/App.tsx#L50 while Scene should be able to switch from Scene to Landing, it receives the function here: https://github.com/ubcemergingmedialab/MootCourt/blob/201ee9ae5dd767645f785b54bbfbd3fad5819266/src/App.tsx#L52

### Unit of Time
- The project may use different measures of time: In our project, the users input time in minutes + times (as it is more intuitive for the users), while in the configuration it is stored in seconds (less prone to human error than ms), and the timer is handled using ms intervals (to increase accuracy). Make sure that you indicate which measure of time you are using and clearly separate the use cases to reduce errors. 

### "Suspense" in return statements
- Suspense allows one component to be loaded while we wait for a completed response from a different component. This allows "lazy loading" feature to load a "loading screen" and overlay it while we wait for the next component to be fully loaded: <Apploader> is loaded while we wait to see if Landing page and general scene has been fully loaded. 

## General files
- Description of general project files

### package.json
- States all dependencies for the project, configuration for the linter, what "npm start" means etc.

### tsconfig.json
- Typescript settings: You can edit these configurations, refer to [doc](https://www.typescriptlang.org/tsconfig)

### index.tsx
- An index file (for example, index.tsx / index.html etc.) in web-development indicates the first file that will be opened by the browser.
- In our index.tsx file, the root element renders the application within, with this line: 
https://github.com/ubcemergingmedialab/MootCourt/blob/201ee9ae5dd767645f785b54bbfbd3fad5819266/src/index.tsx#L10-L14
- For more information on root elements for React, refer to the official documentation and online resources such as [this](https://reactjs.org/docs/rendering-elements.html#rendering-an-element-into-the-dom).

## App.tsx
- The `App.tsx` file is the main file that displays the app page. Note that this is the uppermost component rendered. `index.tsx` renders `<App />` in the root. 
### App.tsx keeps track of 3 things
  - **App State**: Which page are we displaying? The landing page or the main scene?
  - **Config**: App setting. Default form of this data is loaded from defaultData ('./components/general/default_settings.json'). 
  - **Paused**: global check for whether time-sensitive functions should be paused. 
### Fitting the Canvas on the screen
- Elements within the div `<div style={{height: '100vh'}}>` are stretched to fit the entire screen vertically, then is trimmed on both sides. 

## LandingPage.tsx
- Where the setup for the main scene is executed
- Renders light, 3D model for the room, Judge Avatar for the landing page...

## Scene.tsx
- Main scene with timer, pause button, and random questions being asked by the judge

## avatar_components
- `Avatar.tsx` takes in all parameters required for the voice and animation component of the Avatar. 
- `AnimationComponent.tsx` and `VoiceComponent.tsx` contain each respective components of the Avatar, and is rendered by `Avatar.tsx`. 
- `VoiceComponent.tsx` finds the most optimal voice for the female judge (Samantha for Mac, Microsoft Linda for Windows, and Google English as fallback)
