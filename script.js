import { config } from "dotenv";
config()
import { Configuration, OpenAIApi } from "openai";
import readline from "readline";

const openai = new OpenAIApi(new Configuration(
    {apiKey: process.env.API_KEY}
))

const userInterface = readline.createInterface({
    input : process.stdin,
    output : process.stdout
})

userInterface.prompt()
userInterface.on("line", async input => {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: input}]
    })
    // .then (res => {
    //     console.log(res.data.choices[0].message.content)
    // })
  console.log(response.data.choices[0].message.content)
  userInterface.prompt()
})

// openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [{role: "user", content: input}]
// })
// .then (res => {
//     console.log(res.data.choices[0].message.content)
//     userInterface.prompt()
// })

//console.log(process.env.API_KEY)
console.log("Loading")


