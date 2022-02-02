import './resourcesPageStyles.css'


function ResourcesPage({homePage}){
    return(<>
        <div id="Header">
                <h1>Moot Resources</h1> 
            </div>
        <div>
            <button className="button-type1" onClick={() => {homePage()}}>Back</button>
        </div>
    </>)
}

export default ResourcesPage