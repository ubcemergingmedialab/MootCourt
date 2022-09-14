import { useEffect, useState } from 'react'
import CustomQuestion from './CustomQuestion'
import './addQuestionsStyles.css'
import PropTypes from 'prop-types'

const defaultQuestions = [["Would you not agree that being a server in a restaurant is very hard work and that these persons deserve more than the minimum wage they are usually paid by restaurants?",
"Would this policy not be fairer in the sense that the tip would not depend on the particular generosity of the person being served?", "Does this policy not simplify the whole restaurant experience because the customer is just presented with a final bill they can pay with a quick tap?"],
["Does this new policy take away any incentive of the server to provide excellent service?",
    "We don’t have automatic tips for other types of service work, so why should we have one for restaurants?",
    "Does this policy not penalize servers who go above and beyond in their service and are appropriately given tips in the 20% range?"]]


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
                    <input type="file" onChange={(event) => {
                        var reader = new FileReader();

                        reader.onload = function (event) {
                            var jsonObj = JSON.parse(event.target.result);
                            setQuestions(jsonObj)
                        }

                        reader.readAsText(event.target.files[0]);//credit: https://stackoverflow.com/questions/23344776/how-to-access-data-of-uploaded-json-file
                    }}></input>
                </div>
                <div>
                    {Object.keys(questions).map((e, i) => {
                        return (
                            <div key={"questionListItem-" + e} id={"questionListItem-" + e}>
                                <CustomQuestion isDefault={!e.includes('custom')} key={"customQuestion-" + e} id={"customQuestion-" + e} defaultValue={questions[e]}
                                    updateQuestion={updateQuestionHandler(e)}
                                    deleteQuestion={() => { deleteQuestionHandler(e) }}
                                    submitQuestion={() => { submitQuestionHandler(e, i) }}>
                                </CustomQuestion></div>)
                    })}
                </div>

                <div>
                    <button className="submit-icon" onClick={() => { disable() }} >Submit</button>
                    <button onClick={() => {
                        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions));
                        var dlAnchorElem = document.getElementById('downloadAnchorElem');
                        dlAnchorElem.setAttribute("href", dataStr);
                        dlAnchorElem.setAttribute("download", "scene.json");
                        dlAnchorElem.click();/*credit: https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser*/
                    }} >Download as JSON</button><a id="downloadAnchorElem"></a>
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