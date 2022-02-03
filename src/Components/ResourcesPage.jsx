import './resourcesPageStyles.css'


function ResourcesPage({homePage}){
    return(<>
        <div id="Header">
                <h1>Moot Resources</h1> 
            </div>
        <div>
            <button className="button-type1" onClick={() => {homePage()}}>Back to Home</button>
        </div>
        <div id="Subtitle">
            <p>Here we can find mooting resources to best help you strengthen your mooting skills! </p>
        </div>
        <div id="Checklist">
            <h1><a href="First-Year Moots Procedure Checklist 2020.pdf" target="_blank">First year Moot procedure checklist</a></h1>
        </div>
        <div id="Compiled">
            <h1><a href="Compiled Moot Resources.pdf" target="_blank">General Mooting tips and oral argument criteria</a></h1>
        </div>
        <div id="Addressing">
            <h1><a href="(CandC)Addressing_the_Court_Civil_and_Criminal.pdf" target="_blank">Addressing the court civil and criminal</a></h1>
        </div>
    </>)
}

export default ResourcesPage