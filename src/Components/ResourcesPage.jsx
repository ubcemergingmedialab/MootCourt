import './resourcesPageStyles.css'


function ResourcesPage({homePage}){
    return(<>
        <div>
            <h1>Some words</h1>
            <button className="button-type1" onClick={() => {homePage()}}>Back</button>
        </div>
    </>)
}

export default ResourcesPage