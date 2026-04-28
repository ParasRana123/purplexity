import express, { response } from "express"
import { tavily } from "@tavily/core"
import { GoogleGenAI } from "@google/genai"
import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompt";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

const app = express();
app.use(express.json());

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

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const geminiResponse = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_PROMPT
        }
    });

    for await (const chunk of geminiResponse) {
        if(chunk.text) {
            res.write(chunk.text);
        }
    }
    res.write("\n<SOURCES>\n");

    // STEP-7: also stream back the sources and the follow up questions that should be done by nother LLM in parallel
    res.write(JSON.stringify(WebSearchResult.map(geminiResponse => ({ url: geminiResponse.url }))))

    res.write("\n</SOURCES>\n");
    // STEP-8: close the event stream
    res.end();
})

app.post("/purplexity_ask/follow_up" , async (req , res) => {
    // Step-1: Get the existing chat from the DB
    // Step-2: Forward the full history to the LLM
    // Step-3: Stream the response back to the user
    
})

app.listen(3000 , () => {
    console.log("Server running on Port 3000")
});