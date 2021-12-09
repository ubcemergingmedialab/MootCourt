import './landingpageStyles.css'

function LandingPage({homePage}){
    return(<>
        <div>
            <h1>Moot court simulator to help you practice!</h1>
            <button onClick={()=> {homePage()}}>Click me to begin</button>
        </div>
    </>)
}

export default LandingPage