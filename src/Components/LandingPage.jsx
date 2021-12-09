import './landingpageStyles.css'
function LandingPage({HomePage}){
    return(<>
        <div>
            <h1>Moot court simulator to help you practice!</h1>
            <button onClick={()=> {HomePage()}}>Click me to begin</button>
            <button>Settings</button>
        </div>
    </>)
}

export default LandingPage