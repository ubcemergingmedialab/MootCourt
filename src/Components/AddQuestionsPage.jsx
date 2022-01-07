function AddQuestionsPage({setupPage}){
    return(<>
        <body>
            <div>
                <h1>Appellant Questions</h1>
            </div>
            <div>
                <h2>Existing Question Bank</h2>
            </div>
            <div>
                <p>Did not the trial court make some findings of fact contrary to your submission, and should we not defer to those findings of fact?</p>
                <p>Should not we presume that the trial judge knows the law and applied to the correct law?</p>
                <p>Are not some of the facts of the cases you rely upon much different from the facts of this case?</p>
                <p>Could you please tell the court exactly where you are in your factum at this point?</p>
                <p>What does the opposing counsel say about this submission, and why are they not correct?</p>
                <p>As you are aware, we are not bound by any precedents. Could you please tell the court why we should follow the law in the main authorities that you rely on?</p>
                <p>What are the policy implications of your submissions, and would they take the law in this area a positive direction? Are there not some risks of interpreting the law in this manner?</p>
                <p>What are the implications of your submissions on the goal of keeping our legal rules as simple and predictable as possible?</p>
                <p>Were the errors you argue significant enough to justify the remedy you are seeking? In other words, would the result at the trial necessarily have been different if those errors did not occur?</p>
            </div>
            <div>
                <input type="text" />
            </div>

            <div>
                <button onClick={() => { setupPage() }}>Cancel</button>
                <button onClick={() => { setupPage() }}>Add Questions</button>
            </div>
        
        
        </body>
    
    </>)
}

export default AddQuestionsPage