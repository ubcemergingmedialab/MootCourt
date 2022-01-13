import { useState } from 'react'
import CustomQuestion from './CustomQuestion'
import './addQuestionsStyles.css'


function AddQuestionsPopup({ disable }) {
    const [questions, setQuestions] = useState({ 1: "new question" })
    const updateQuestionHandler = (index) => {
        return function (value) {
            let tempQuestions = {...questions}
            tempQuestions[index] = { value: value }
            //console.log(tempQuestions)
            setQuestions({...tempQuestions})
        }
    }

    const deleteQuestionHandler = function (i) {
        let tempQuestions = { ...questions }
        delete tempQuestions[i]
        console.log(tempQuestions)
        setQuestions({...tempQuestions})
    }

    const submitQuestionHandler = function (i) {
        let tempQuestions = { ...questions }
        tempQuestions[i + 1] = "new question"
        setQuestions({...tempQuestions})
    }

    return (<>
        <div className={"popup-box"}>
            <h1>This is a separate component to add questions for now, but it may be a popup later</h1>
            <h1>Will need to see how this can be a popup (modal?)</h1>
            <button type="button" onClick={() => { disable() }}>x</button>
            <ul>
                {Object.keys(questions).map((e, i) => {
                    return (
                        <li key={"questionListItem-" + e} id={"questionListItem-" + e}>
                            <CustomQuestion key={"customQuestion-" + e} id={"customQuestion-" + e}
                                updateQuestion={updateQuestionHandler(e)}
                                deleteQuestion={() => { deleteQuestionHandler(e) }}
                                submitQuestion={() => { submitQuestionHandler(e) }}>
                            </CustomQuestion></li>)
                })}
            </ul>
        </div>

    </>)
}

export default AddQuestionsPopup