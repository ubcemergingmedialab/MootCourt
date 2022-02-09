import './landingpageStyles.css'

function LandingPage({homePage}){
    return(<>
        <div id="Land" onClick={()=> {homePage()}}>
            <div id="HeaderBorder">
                <h1>Moot Court</h1> 
            </div>
            <div id="SubBorder">
                <h2>Moot court simulator to help you practice!</h2>
            </div>
            <div id="Begin">
                <p>Click anywhere on the screen to begin</p>
                    <a style={{color:"navy"}} href={"https://ubc.ca1.qualtrics.com/jfe/form/SV_0qbnf0bR2bTIBo2"}>Give us your feedback!</a>
            </div>
        </div>
    
    </>)
}

export default LandingPage