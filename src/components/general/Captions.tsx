export default function Captions({config}){

    const spoken = "";
    //console.log(spoken);
    //currently this is using the user's speech as a test but should be set to the ChatGPT response
    return <>
        {<p> {spoken.slice(spoken.length-2000, spoken.length)} </p>}
    </>
}