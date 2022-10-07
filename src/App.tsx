import React, {Suspense} from 'react'
import './App.css';
import GeneralScene from './components/scenes/Scene';

function App() {
  return (
    <Suspense fallback={null}>
    <div style={{height: '100vh'}}>
    <GeneralScene>
    </GeneralScene>
    </div>
    </Suspense>
  );
}
export default App;
