import './homepageStyles.css'
import PropTypes from 'prop-types'

function HomePage({setupPage, demoPage, resourcesPage}){
    return(<>
        <div id="Home">
            <div id="Rectangle">
            </div>
            <div id="RectangleMid">
            </div>
            <div id="TitleBorder">
                <h1>Moot Court</h1>
            </div>
            <div id="Start">
                <button className="button button-type3" onClick={()=> {setupPage()}}> Start Moot Practice</button>
            </div>
            <div id="BeginDemo">
                <button className="button button-type3" onClick={()=> {demoPage()}}> Start Moot Demo</button>
            </div>
            <div id="Resources">
                <button className="button button-type4" onClick={()=> {resourcesPage()}}>Resources</button>
            </div>
        </div>
    </>)
}

HomePage.propTypes = {
    /** transitions state machine to be in Setup state */
    setupPage: PropTypes.func,
    demoPage: PropTypes.func,
    /** transitions state machine to be in the Homepage state */
    resourcesPage: PropTypes.func
}

export default HomePage