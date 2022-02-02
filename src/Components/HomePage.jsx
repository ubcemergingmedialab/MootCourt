import './homepageStyles.css'

function HomePage({ setupPage }) {
    return (<>
        <div id="Home">
            <div id="Rectangle">
            </div>
            <div id="RectangleMid">
            </div>
            <div id="TitleBorder">
                <h1>Moot Court</h1>
            </div>
            <div id="Start">
                <div id="RectangleStart">
                </div>
                <button id="StartButton" onClick={() => { setupPage() }}> Start Moot Practice</button>
            </div>
            <div id="Resources">
                <div id="RectangleResources">
                </div>
                <button id="ResourcesButton">Resources</button>
            </div>
        </div>
    </>)
}

export default HomePage