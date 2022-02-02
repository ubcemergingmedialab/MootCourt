import './customQuestionsStyles.css'


const CustomQuestion = function ({ updateQuestion, submitQuestion, deleteQuestion, defaultValue }) {

    return (<>
        <input type="text" placeholder="Enter your question here, press ENTER to add more" value={defaultValue? defaultValue : ""}
        onChange={(e) => {updateQuestion(e.target.value)}}
        onKeyDown={ (e) => {if(e.keyCode == 13) {console.log('pressed enter');submitQuestion()}}} />
        <button className="close-icon" onClick={deleteQuestion} >x</button>

    </>)
}

export default CustomQuestion