import './landingpageStyles.css'

function LandingPage({homePage}){
    return(<>
        <body onClick={()=> {homePage()}} class="body">
            <div>
                <h1>Moot Court</h1>
                <h2>Moot court simulator to help you practice!</h2>
                <p>Click anywhere on the screen to begin</p>
            </div>
        </body>
    
    </>)
}

export default LandingPage