import { useState } from 'react'
import CustomQuestion from './CustomQuestion'
import './addQuestionsStyles.css'
import { useEffect } from 'react/cjs/react.development'


function AddQuestionsPopup({ disable }) {
    const [questions, setQuestions] = useState(["new question"])
    const [renderedQuestions, setRenderedQuestions] = useState(["new question"])
    const updateQuestionHandler = (index) => {
        return function (value) {
            let tempQuestions = questions
            questions[index] = value
            setQuestions(tempQuestions)
        }
    }

    const deleteQuestionHandler = function (i) {
        let tempQuestions = questions
        tempQuestions.splice(i, 1)
        setQuestions(tempQuestions)
    }

    const submitQuestionHandler = function (i) {
        if (i >= (questions.length - 1)) {
            console.log('pushing question')
            let tempQuestions = questions
            tempQuestions.push("new")
            setQuestions(tempQuestions)
        }
    }

    useEffect(() => {
        console.log(questions)
        setRenderedQuestions(questions)
    }, [questions])

    return (<>
        <div className={"popup-box"}>
            <h1>This is a separate component to add questions for now, but it may be a popup later</h1>
            <h1>Will need to see how this can be a popup (modal?)</h1>
            <button type="button" onClick={() => { disable() }}>x</button>
            <ul>
                {renderedQuestions.map((e, i) => {
                    return (
                        <li key={"questionListItem-" + i} id={"questionListItem-" + i}>
                            <CustomQuestion key={"customQuestion-" + i} id={"customQuestion-" + i}
                                updateQuestion={updateQuestionHandler(i)}
                                deleteQuestion={() => { deleteQuestionHandler(i) }}
                                submitQuestion={() => { submitQuestionHandler(i) }}>
                            </CustomQuestion></li>)
                })}
            </ul>
        </div>

    </>)
}

export default AddQuestionsPopup