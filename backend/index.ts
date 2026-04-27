import express from "express"
import { tavily } from "@tavily/core"
import { GoogleGenAI } from "@google/genai"
import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompt";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
}); 

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

const app = express();

app.post("/purplexity_ask" , async (req , res) => {
    // STEP-1: get the query from the user
    const query = req.body.query;


    // STEP-2: make sure the user has access/credits to hot the endpoint

    // STEP-3: check if we have web search indexed for a specific query

    // STEP-4: if not then we do the web search to gather the resources
    const webSearchResponse = await client.search(query, {
        searchDepth: "advanced"
    })
    const WebSearchResult = webSearchResponse.results;

    // STEP-5: do some context engineering on the prompt + web search for the responses

    // STEP-6: hit the LLM and stream back the response
    const prompt = PROMPT_TEMPLATE
          .replace("{{WEB_SEARCH_RESULTS}}" , JSON.stringify(WebSearchResult))
          .replace("{{USER_QUERY}}" , query);

    const geminiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_PROMPT
        }
    });


    // STEP-7: also stream back the sources and the follow up questions that should be done by nother LLM in parallel

    // STEP-8: close the event stream
})

app.listen(3000);