# Moot Court
## Project Description
Practice for Moot Court, built using Typescript + React. 

## External Assets

### Included
- [DeepMotion Animation/Rigging](https://docs.readyplayer.me/ready-player-me/#who-can-use-ready-player-me)
- [Judge Model](https://docs.readyplayer.me/ready-player-me/#who-can-use-ready-player-me)

## Versioning
- Refer to [this documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) on how to release projects on github. 
- Moot court releases: https://github.com/ubcemergingmedialab/MootCourt/releases

## Getting Started & Building

1. Download Node.js
2. Clone project to local folder
3. npm start
4. Project should be deployed to local host as shown in terminal

## Dependencies
- Created using `npx create-react-app moot-court --template typescript`
- ESLint: `npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`
- react three fiber: `npm install three @react-three/fiber`
- React XR: `npm install @react-three/xr`
- react speech kit: `npm install --force react-speech-kit`
- leva: `npm i --force leva`
- react three fiber typescript: `npm install @types/three`
- drei: `npm install @react-three/drei`

## Team

### Faculty:
Jon Festinger, Q.C.
Nikos Harris, Q.C.
Barbara Wang BA, JD

### Current EML Student Team:

- Rosaline - Developer/Lead
- Michelle - Developer
- Juno - Developer
- Jena - Designer

## Troubleshooting
- High severity vulnerability regarding *Inefficient Regular Expression Complexity in nth-check* is likely a false alarm. Can ignore, do not force fix as it may break the project.
- installing the above modules may lead to error *"unable to resolve dependency tree"*. Force install instead (overrides warning for incompatible react versions, shouldn't break the code)

## Documentation
- [Development Documentation](https://github.com/ubcemergingmedialab/MootCourt/blob/master/Development%20Documentation.md)
- [Project Wiki](https://wiki.ubc.ca/Documentation:Moot_Court#Introduction)
- [Revised App Structure](https://github.com/ubcemergingmedialab/MootCourt/blob/master/src/components/main-components/Revised%20App%20Structure.md): Needs to be updated with current code (March 2023)
