import './homepageStyles.css'
import PropTypes from 'prop-types'

function HomePage({demoPage, a_presentationPage, r_presentationPage}){
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
                <button className="button button-type3" onClick={()=> {a_presentationPage()}}> Moot Practice As Appellant</button>
            </div>
            <div id="MiddleButton">
                <button className="button button-type3" onClick={()=> {r_presentationPage()}}> Moot Practice As Respondent</button>
            </div>
            <div id="Resources">
                <button className="button button-type4" onClick={()=> {demoPage()}}>Introduction Scene</button>
            </div>
        </div>
    </>)
}

HomePage.propTypes = {
    /** transitions state machine to be in Setup state */
    setupPage: PropTypes.func,
    demoPage: PropTypes.func,
    presentationPage: PropTypes.func
}

export default HomePage