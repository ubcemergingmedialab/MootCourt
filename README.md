# Moot Court
Practice Mooting Online!

## Documentation
- [Development Documentation](https://github.com/ubcemergingmedialab/MootCourt/blob/typescript/Development%20Documentation.md)

## Dependencies
- Created using `npx create-react-app moot-court --template typescript`
- ESLint: `npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`
- react three fiber: `npm install three @react-three/fiber`
- React XR: `npm install @react-three/xr`
- react speech kit: `npm install --force react-speech-kit`
- leva: `npm i --force leva`
- react three fiber typescript: `npm install @types/three`
- drei: `npm install @react-three/drei`

## Troubleshooting
- High severity vulnerability regarding *Inefficient Regular Expression Complexity in nth-check* is likely a false alarm. Can ignore, do not force fix as it may break the project.
- installing the above modules may lead to error *"unable to resolve dependency tree"*. Force install instead (overrides warning for incompatible react versions, shouldn't break the code)
