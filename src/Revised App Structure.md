# Revised App Structure
- new folder layout & task delegation per component

## Main App
  - **App State**: Determines which page is displaying
  - **Config**: Configuration object modified by the landing page and used by the main scene page
    - Position (Appellant / Respondent): Determines the type of question asked to the user
    - List of Questions: Determines what questions will be available to the user upon choosing position (should be customizable)
    - Total time: Starting time of the main scene's timer. Duration of each app usage. 
    - Question intervals: Interval between each question being asked
    - Randomize question interval: adds a bit of randomness between each question asked
    - Randomize question order: mix up order of questions being asked
    - Enable Negative Time: if set as yes, count down negative time in main app. If set as no, return to landing page after time runs out. 
  - **Paused**: global check for whether time-sensitive functions should be paused. 

## Scenes
*Each component should be reusable in another avatar speech-based 3D web application*
  - **Avatar**
    - 3D model for avatar
    - Optimal voice for each avatar
    - Avatar Active vs. Inactive state (+ functions to control voice and animation component)
        - Set as inactive when app is paused, or when the text given stops playing
  - **Speech**
    - Feeds the "speech text" to Avatar to activate avatar
    - Functions that trigger time-based or keyEvent based avatar activation are stored here
    - Communicates with the timer to activate avatar with random speech input
  - **Timer**
    - Tracks time remaining in the main scene
    - Pauses when main app is paused