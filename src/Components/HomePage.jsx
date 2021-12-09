import './homepageStyles.css'

function HomePage({setupPage}){
    return(<>
        <div>
            <h1>Moot Court</h1>
            <button onClick={()=> {setupPage()}}> Start Moot Practice</button>
            <button>Resources</button>
        </div>
    </>)
}

export default HomePage