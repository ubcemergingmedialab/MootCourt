import { useEffect, useState } from 'react'
import CustomQuestion from './CustomQuestion'
import './addQuestionsStyles.css'
import PropTypes from 'prop-types'

const defaultQuestions = [[
    "Did not the trial court make some findings of fact that are contrary to your submissions, and should we not defer to those findings of fact?",
    "Should not we presume that the trial judge knows the law and applied the correct law?",
    "Are not some of the facts of the cases you rely upon very different from the facts of this case?",
    "Could you please tell the Court exactly where you are in your Factum at this point?",
    "What does the opposing counsel say about this submission, and why are they not correct?",
    "Could you please tell the Court exactly where you are in your Factum at this point?",
    "What does the opposing counsel say about this submission, and why are they not correct?",
    "As you are aware, we are not bound by any precedents. Could you please tell the Court why we should follow the law in the main authorities that you rely upon?",
    "What are the policy implications of your submissions, and would they take the law in this area in a positive direction? Are there not some risks of interpreting the law in this manner?",
    "What are the implications of your submissions on the goal of keeping our legal rules as simple and predictable as possible?",
    "Were the errors you argue significant enough to justify the remedy you are seeking? In other words, would the result at trial necessarily have been different if those errors did not occur?"
],
[
    "Did not some of the evidence at trial support the positions of the Appellant on the issues before this Court?",
    "Is it not the main role of this Court to look for any possible error from the trial below in order to protect against a wrongful conviction?",
    "Are not some of the facts of the cases you rely upon very different from the facts of this case?",
    "Would you agree that the trial judge did not articulate the legal tests as clearly as they could have?",
    "Is there at least a possibility that the trial judge used legal tests inconsistent with those set out in the authorities, and if there is any uncertainty on this issue, should we not err on the side of ordering a new trial?",
    "Could you please tell the Court exactly where you are in your Factum at this point?",
    "What does the opposing counsel say about this submission, and why are they not correct?",
    "As you are aware, we are not bound by any precedents. Could you please tell the Court why we should follow the law in the main authorities that you rely upon?",
    "Your friend also argues that the evidence did not support the findings the trial judge made. Should we be able to reconsider the evidence in this case and conclude that different findings should have been made?",
    "Would you agree that if we find that the trial judge made any errors that there will have to be a new trial ordered?"
]]

function AddQuestionsPopup({ disable, setQuestionsList, position, shouldUpdate = true }) {
    const [showQuestion, setShowQuestion] = useState(true);
    const questionOpen = () => {
        setShowQuestion(!showQuestion);
    }
    const [showInput, setShowInput] = useState(false)
    const additionalQuestionOpen = () => {
        setShowInput(!showInput)
    }

    const [questions, setQuestions] = useState(window.localStorage.getItem('mootcourt_questions') ? JSON.parse(window.localStorage.getItem('mootcourt_questions')) : { 'custom0': '' })

    const updateQuestionHandler = (index) => {
        return function (value) {
            let tempQuestions = { ...questions }
            tempQuestions[index] = value
            console.log(tempQuestions)
            setQuestions({ ...tempQuestions })
        }
    }

    const deleteQuestionHandler = function (i) {
        let tempQuestions = { ...questions }
        Object.keys(tempQuestions).length > 1 ? delete tempQuestions[i] : console.log("not deleted")
        console.log(tempQuestions)
        setQuestions({ ...tempQuestions })
    }

    const submitQuestionHandler = function (e, i) {
        let tempQuestions = { ...questions }
        if (!!!tempQuestions['custom' + (e + 1)]) {
            tempQuestions['custom' + (e + 1)] = ""
        } else {
            if (Object.keys(questions).length == 1) {
                tempQuestions['custom' + (Object.keys(tempQuestions).length + 2)] = ""
            }
        }
        setQuestions({ ...tempQuestions })
    }

    useEffect(() => {
        window.localStorage.removeItem('mootcourt_questions')
        window.localStorage.setItem('mootcourt_questions', JSON.stringify(questions))
        setQuestionsList(questions)
    }, [questions])

    useEffect(() => {
        console.log(JSON.parse(window.localStorage.getItem('mootcourt_questions')))
        if (shouldUpdate) {
            const tempQuestions = {}
            let customQuestionIds = Object.keys(questions).filter((e) => {
                return e.includes('custom');
            })

            for (let i of customQuestionIds) {
                tempQuestions[i] = questions[i]
            }

            if (position !== undefined) {
                for (let e of defaultQuestions[position ? position : 0]) {
                    tempQuestions[Object.keys(tempQuestions).length + 1] = e
                }
            }
            setQuestions({ ...tempQuestions })
        }
    }, [])

    return (<>
        <div className="popup-box">
            <div className="popup-content">
                <span>Custom Questions</span>

                <div>
                    <button className="submit-icon" onClick={() => { disable() }} >Submit</button>
                </div>
                <div>
                    {Object.keys(questions).map((e, i) => {
                        return (
                            <p key={"questionListItem-" + e} id={"questionListItem-" + e}>
                                <CustomQuestion isDefault={!e.includes('custom')} key={"customQuestion-" + e} id={"customQuestion-" + e} defaultValue={questions[e]}
                                    updateQuestion={updateQuestionHandler(e)}
                                    deleteQuestion={() => { deleteQuestionHandler(e) }}
                                    submitQuestion={() => { submitQuestionHandler(e, i) }}>
                                </CustomQuestion></p>)
                    })}
                </div>

                <div>
                    <button className="submit-icon" onClick={() => { disable() }} >Submit</button>
                </div>
            </div>
        </div>

    </>)
}

AddQuestionsPopup.propTypes = {
    /** should set a bool in parent that unmounts this component */
    disable: PropTypes.func,
    /** Communicates the calculated list to parent */
    setQuestionsList: PropTypes.func,
    /** decides default question list based on Appellant or Respondent */
    position: PropTypes.bool,
    /** boolean used in the case the component should avoid overwriting questions list in parent*/
    shouldUpdate: PropTypes.bool
}

export default AddQuestionsPopup