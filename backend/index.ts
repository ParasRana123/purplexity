import express from "express"

const app = express();

app.post("/purplexity_ask" , (req , res) => {
    // STEP-1: get the query from the user

    // STEP-2: make sure the user has access/credits to hot the endpoint

    // STEP-3: check if we have web search indexed for a specific query

    // STEP-4: if not then we do the web search to gather the resources

    // STEP-5: do some context engineering on the prompt + web search for the responses

    // STEP-6: hit the LLM and stream back the response

    // STEP-7: also stream back the sources and the follow up questions that should be done by nother LLM in parallel

    // STEP-8: close the event stream
})

app.listen(3000);