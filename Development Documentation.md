# Moot Court Development Documentation
Refer to the following instructions to understand the Moot Court codebase. 

## App.tsx
- The `App.tsx` file is the main file that displays the app page. Note that this is the uppermost component rendered. `index.tsx` renders `<App />` in the root. 
### App.tsx keeps track of 3 things
  - **App State**: Which page are we displaying? The landing page or the main scene?
  - **Config**: customized setting of the app
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
