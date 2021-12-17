import './landingpageStyles.css'

function LandingPage({homePage}){
    return(<>
        <div>
            <h1>Moot Court</h1>
            <h2>Moot court simulator to help you practice!</h2>
            <button onClick={()=> {homePage()}}>Click me to begin</button>
            <p>^This is a placeholder button until I figure out how to make the whole screen clickable^</p>
        </div>
    
    </>)
}

export default LandingPage