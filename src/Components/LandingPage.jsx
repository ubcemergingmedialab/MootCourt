import './landingpageStyles.css'

function LandingPage({homePage}){
    return(<>
        <body id="Land">
            <div id="HeaderBorder">
                <h1>Moot Court</h1> 
            </div>
            <div id="SubBorder">
                <h2>Moot court simulator to help you practice!</h2>
            </div>
            <div id="Begin">
                <button id="BeginButton" onClick={()=> {homePage()}}>Click me to begin</button>
            </div>
        </body>
    </>)
}

export default LandingPage