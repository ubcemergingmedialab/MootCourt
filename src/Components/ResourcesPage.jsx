import './resourcesPageStyles.css'
import PropTypes from 'prop-types'

function ResourcesPage({homePage}){
    return(<>

        <div className="resources">
        <div id="Header">
                <h1>Moot Resources</h1> 
            </div>
        <div>
            <button className="button-type1-button" onClick={() => {homePage()}}>Back to Home</button>
        </div>
        <div id="Subtitle">
            <p>Here we can find mooting resources to best help you strengthen your mooting skills! </p>
        </div>
        <div id="Checklist">
            <h1><a href="First-Year Moots Procedure Checklist 2020.pdf" target="_blank">First Year Moot Procedure Checklist</a></h1>
        </div>
        <div id="Compiled">
            <h1><a href="Compiled Moot Resources.pdf" target="_blank">General Mooting Tips and Oral Argument Criteria</a></h1>
        </div>
        <div id="Addressing">
            <h1><a href="2021_Appearing_before_the_Court.pdf" target="_blank">Appearing before the Court (Civil and Criminal)</a></h1>
        </div>
        </div>
    </>)
}

ResourcesPage.propTypes = {
    /** Transitions app state machine to the Homepage state */
    homePage: PropTypes.func,
}

export default ResourcesPage