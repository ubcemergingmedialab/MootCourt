import './landingpageStyles.css'
import PropTypes from 'prop-types'

function LandingPage({homePage}){
    return(<>
        <div id="Land" onClick={()=> {homePage()}}>
            <div id="HeaderBorder">
                <h1>Moot Court</h1> 
            </div>
            <div id="SubBorder">
                <p>Moot court simulator to help you practice!</p>
            </div>
            <div id="Begin">
                <p>Click anywhere on the screen to begin</p>
                    <a style={{color:"navy"}} target="black" href={"https://ubc.ca1.qualtrics.com/jfe/form/SV_0qbnf0bR2bTIBo2"}>Give us your feedback!</a>
            </div>
        </div>
    
    </>)
}

LandingPage.propTypes = {
    /** handler to swap to Home Page in state machine */
    homepage: PropTypes.func
}

export default LandingPage