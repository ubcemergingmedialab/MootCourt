# Moot Court Development Documentation
Refer to the following instructions to understand the Moot Court codebase. 

## General files
- Description of general project files

### package.json
- States all dependencies for the project, configuration for the linter, what "npm start" means etc.

### tsconfig.json
- Typescript settings: You can edit these configurations, refer to [doc](https://www.typescriptlang.org/tsconfig)

### index.tsx
- An index file (for example, index.tsx / index.html etc.) in web-development indicates the first file that will be opened by the browser.
- In our index.tsx file, the root element renders the application within, with this line: 

```
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
- For more information on root elements for React, refer to documentations and online resources such as [this](https://reactjs.org/docs/rendering-elements.html#rendering-an-element-into-the-dom).

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

#TODO: documentation on suspense @Juno
