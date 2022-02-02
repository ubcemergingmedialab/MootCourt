import { useEffect, useState } from 'react'
import CustomQuestion from './CustomQuestion'
import './addQuestionsStyles.css'


function AddQuestionsPopup({ disable, setQuestionsList, position }) {
    const [showQuestion, setShowQuestion] = useState(true);
    const questionOpen = () => {
        setShowQuestion(!showQuestion);
    }
    const [showInput, setShowInput] = useState(false)
    const additionalQuestionOpen = () => {
        setShowInput(!showInput)
    }

    const [questions, setQuestions] = useState({ 1: "" })

    const updateQuestionHandler = (index) => {
        return function (value) {
            let tempQuestions = { ...questions }
            tempQuestions[index] = value
            //console.log(tempQuestions)
            setQuestions({ ...tempQuestions })
        }
    }
    const deleteQuestionHandler = function (i) {
        let tempQuestions = { ...questions }
        Object.keys(tempQuestions).length > 1 ? delete tempQuestions[i] : console.log("not deleted")
        console.log(tempQuestions)
        setQuestions({ ...tempQuestions })
    }
    const submitQuestionHandler = function (i) {
        let tempQuestions = { ...questions }
        tempQuestions[i + 1] = ""
        setQuestions({ ...tempQuestions })
    }

    useEffect(() => {
        setQuestionsList(questions)
    }, [questions])

    useEffect(() => {
        const tempQuestions = { ...questions }
        const defaultQuestions = [[
            "Did not the trial court make some findings of fact contrary to your submissions, and should we not defer to those findings of fact?",
            "Should not we presume that the trial judge knows the law and applied the correct law?",
            "Are not some of the facts of the cases you rely upon much different from the facts of this case?",
            "Could you please tell the Court exactly where you are in your Factum at this point?",
        ],
        [
            "What does the opposing counsel say about this submission, and why are they not correct?",
            "As you are aware, we are not bound by any precedents.  Could you please tell the Court why we should follow the law in the main authorities that you rely on?",
            "What are the policy implications of your submissions, and would they take the law in this area in a positive direction?  Are there not some risks of interpreting the law in this manner?",
            "What are the implications of your submissions on the goal of keeping our legal rules as simple and predictable as possible?",
            "Were the errors you argue significant enough to justify the remedy you are seeking?  In other words, would the result at trial necessarily have been different if those errors did not occur?"
        ]]
        for (let e of defaultQuestions[position ? position : 0]) {
            tempQuestions[Object.keys(tempQuestions).length + 1] = e
            console.log(e)
        }
        setQuestions({ ...tempQuestions })
    }, [])

    return (<>
        <div className="popup-box">
            <div className="icon-header">
                <button className="close-icon" onClick={() => { disable() }} >x</button>
            </div>
            <div className="popup-content">

                <div>
                    {Object.keys(questions).map((e, i) => {
                        return (
                            <p key={"questionListItem-" + e} id={"questionListItem-" + e}>
                                <CustomQuestion key={"customQuestion-" + e} id={"customQuestion-" + e} defaultValue={questions[e]}
                                    updateQuestion={updateQuestionHandler(e)}
                                    deleteQuestion={() => { deleteQuestionHandler(e) }}
                                    submitQuestion={() => { submitQuestionHandler(e) }}>
                                </CustomQuestion></p>)
                    })}
                </div>

            </div>
        </div>

    </>)
}

export default AddQuestionsPopup