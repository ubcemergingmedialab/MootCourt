import './homepageStyles.css'

function HomePage({setupPage, resourcesPage}){
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
            <div id="Resources">
                <button className="button button-type4" onClick={()=> {resourcesPage()}}>Resources</button>
            </div>
        </div>
    </>)
}

export default HomePage