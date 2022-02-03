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
                <button id="StartButton" onClick={()=> {setupPage()}}> Start Moot Practice</button>
            </div>
            <div id="Resources">
                <button id="ResourcesButton" onClick={()=> {resourcesPage()}}>Resources</button>
            </div>
        </div>
    </>)
}

export default HomePage