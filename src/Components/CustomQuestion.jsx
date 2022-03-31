import './customQuestionsStyles.css'
import PropTypes from 'prop-types'


const CustomQuestion = function ({ isDefault, updateQuestion, submitQuestion, deleteQuestion, defaultValue }) {

    return (<>
        <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'left' }}>
            <input style={{ margin: '1em 4em', padding: '1em' }} type="textarea" placeholder="Enter your question here, press ENTER to add more" value={defaultValue ? defaultValue : ""} className={isDefault ? 'default' : 'custom'}
                onChange={(e) => { updateQuestion(e.target.value) }}
                onKeyDown={(e) => { if (e.keyCode == 13) { console.log('pressed enter'); submitQuestion() } }} />
            <button style={{ justifySelf: 'right' }} className="close-icon" onClick={deleteQuestion} >x</button></div>

    </>)
}

CustomQuestion.propTypes = {
    /** Changes background color of input, blue for default questions white for custom questions */
    isDefault: PropTypes.bool,
    /** parent should implement handler that reacts to a keypress and saves changes to questions as they are being typed */
    updateQuestion: PropTypes.func,
    /** parent should implement handler that reacts to submitting a question (pressing enter)*/
    submitQuestion: PropTypes.func,
    /** gets called when x button is pressed, parent should remove this question from the list, unless there are none left. This logic happens in parent */
    deleteQuestion: PropTypes.func,
    /** this will be the value that appears in the input on mount*/
    defaultValue: PropTypes.string
}

export default CustomQuestion