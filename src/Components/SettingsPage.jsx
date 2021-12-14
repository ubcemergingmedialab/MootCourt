import './settingsStyles.css'

function SettingsPage({ hideSettingsPage }) {
    return (<>
        <div><h1>Settings Page Active</h1>
        <button type="button" onClick={() => {hideSettingsPage()}}> Back</button></div>
    </>)
}

export default SettingsPage