import './customQuestionsStyles.css'


const CustomQuestion = function ({ isDefault, updateQuestion, submitQuestion, deleteQuestion, defaultValue }) {

    return (<>
        <div style={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems:'center', justifyContent: 'left'}}>
        <input style={{margin: '1em 4em', padding:'1em'}} type="textarea" placeholder="Enter your question here, press ENTER to add more" value={defaultValue? defaultValue : ""} className={isDefault? 'default': 'custom'}
        onChange={(e) => {updateQuestion(e.target.value)}}
        onKeyDown={ (e) => {if(e.keyCode == 13) {console.log('pressed enter');submitQuestion()}}}/>
        <button style={{justifySelf:'right'}} className="close-icon" onClick={deleteQuestion} >x</button></div>

    </>)
}

export default CustomQuestion