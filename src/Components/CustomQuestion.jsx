const CustomQuestion = function ({ updateQuestion, submitQuestion, deleteQuestion }) {

    return (<>
        <input type="text" placeholder="enter your question here" 
        onChange={(e) => {updateQuestion(e.target.value)}}
        onKeyDown={ (e) => {if(e.keyCode == 13) {console.log('pressed enter');submitQuestion()}}} /><button type="button" onClick={deleteQuestion}>x</button></>
    )
}

export default CustomQuestion