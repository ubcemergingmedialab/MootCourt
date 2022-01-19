import './customQuestionsStyles.css'


const CustomQuestion = function ({ updateQuestion, submitQuestion, deleteQuestion }) {

    return (<>
        <input type="text" placeholder="enter your question here" 
        onChange={(e) => {updateQuestion(e.target.value)}}
        onKeyDown={ (e) => {if(e.keyCode == 13) {console.log('pressed enter');submitQuestion()}}} />
        <button className="close-icon" onClick={deleteQuestion}>x</button>

    </>)
}

export default CustomQuestion