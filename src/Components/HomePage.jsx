import SetupPage from "./SetupPage"


function HomePage({SetupPage}){
    return(<>
        <div>
            <h1>Moot Court</h1>
            <button onClick={()=> {SetupPage()}}> Start Moot Practice</button>
            <button>Resources</button>
            <button>Settings</button>
        </div>
    </>)
}

export default HomePage