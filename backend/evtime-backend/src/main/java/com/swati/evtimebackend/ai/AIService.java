package com.swati.evtimebackend.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final ChatClient chatClient;

    public AIService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String chat(String message) {
        String prompt = """
                You are EV Times AI Assistant.
                Your role is to answer ONLY questions related to:
                
                - Electric Vehicle (EV)
                - EV Charging 
                - EV Batteries
                - EV News
                - EV Companies
                - Government EV Policies
                - Sustainability
                - Green Mobility
                
                Rules:
                
                1. Answer politely
                2. Keep answers concise.
                3. Use bullet points whenever possible.
                4. Maximum 150 words.
                5. If the question is NOT related to Electric Vehicles,
                reply exactly.
                
                "I'm EV Times AI Assistant. I can answer only Electric Vehicle related questions."
                
                User Question:
                %s""".formatted(message);
        return chatClient
                .prompt(prompt)
                .call()
                .content();
    }

    /**
     * Summarizes an article into 2-3 sentences for the article page's
     * "AI Summary" feature. A separate, stricter prompt from chat() —
     * this should never answer questions or add commentary, only compress
     * the given text.
     */
    public String summarize(String article) {
        if (article == null || article.isBlank()) {
            return "Nothing to summarize.";
        }

        String prompt = """
                Summarize the following electric-vehicle news article in
                2-3 concise sentences. Plain prose, no bullet points, no
                preamble like "Here is a summary" — just the summary itself.
                Stay strictly factual to the article content below; do not
                add information that isn't there.
                
                Article:
                %s""".formatted(article);

        return chatClient
                .prompt(prompt)
                .call()
                .content();
    }

}