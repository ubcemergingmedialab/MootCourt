import { useEffect, useState } from 'react'
import CustomQuestion from './CustomQuestion'
import './addQuestionsStyles.css'


function AddQuestionsPopup({ disable, setQuestionsList}) {
    const [showQuestion, setShowQuestion] = useState(true);
    const questionOpen = () => {
        setShowQuestion(!showQuestion);
    }
    const [showInput, setShowInput]= useState(false)
    const additionalQuestionOpen = () =>{
        setShowInput(!showInput)
    }

    const [questions, setQuestions] = useState({ 1: "new question" })

    const updateQuestionHandler = (index) => {
        return function (value) {
            let tempQuestions = {...questions}
            tempQuestions[index] = value 
            //console.log(tempQuestions)
            setQuestions({...tempQuestions})
        }
    }
    const deleteQuestionHandler = function (i) {
        let tempQuestions = { ...questions }
        Object.keys(tempQuestions).length >1 ? delete tempQuestions[i] : console.log("not deleted")
        console.log(tempQuestions)
        setQuestions({...tempQuestions})
    }
    const submitQuestionHandler = function (i) {
        let tempQuestions = { ...questions }
        tempQuestions[i + 1] = "new question"
        setQuestions({...tempQuestions})
    }

    useEffect(() => {
        setQuestionsList(questions)
    }, [questions])

    return (<>
        <div className="popup-box">
            <div className="icon-header">
                <button className="close-icon" onClick={() => { disable() }} >x</button>
            </div>
            <div className="popup-content">
                <div className="button-format">
                    <button className="button-type3" onClick={questionOpen}> Default Questions</button>
                    <button className="button-type4" onClick={additionalQuestionOpen}>Additional Questions</button> 
                </div>
                {showQuestion && (
                <div className="text-styles">
                    <p> Did not the trial court make some findings of fact contrary to your submissions, and should we not defer to those findings of fact? </p>
                    <p> Should not we presume that the trial judge knows the law and applied the correct law?</p> 
                    <p> Are not some of the facts of the cases you rely upon much different from the facts of this case?</p> 
                    <p> Could you please tell the Court exactly where you are in your Factum at this point? </p>
                    <p> What does the opposing counsel say about this submission, and why are they not correct? </p>
                    <p> As you are aware, we are not bound by any precedents.  Could you please tell the Court why we should follow the law in the main authorities that you rely on?</p>  
                    <p> What are the policy implications of your submissions, and would they take the law in this area in a positive direction?  Are there not some risks of interpreting the law in this manner?</p>
                    <p> What are the implications of your submissions on the goal of keeping our legal rules as simple and predictable as possible?</p>
                    <p> Were the errors you argue significant enough to justify the remedy you are seeking?  In other words, would the result at trial necessarily have been different if those errors did not occur?</p> 
                </div>  
                )}  
                {showInput && (
                    <div>
                        {Object.keys(questions).map((e, i) => {
                            return (
                                <li key={"questionListItem-" + e} id={"questionListItem-" + e}>
                                    <CustomQuestion key={"customQuestion-" + e} id={"customQuestion-" + e}
                                        updateQuestion={updateQuestionHandler(e)}
                                        deleteQuestion={() => { deleteQuestionHandler(e) }}
                                        submitQuestion={() => { submitQuestionHandler(e) }}>
                                    </CustomQuestion></li>)
                        })}
                    </div>
                )}
            </div>
        </div>

    </>)
}

export default AddQuestionsPopup