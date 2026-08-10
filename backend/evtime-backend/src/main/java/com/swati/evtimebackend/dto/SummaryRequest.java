package com.swati.evtimebackend.dto;

public class SummaryRequest {
    private String  article;

    public SummaryRequest(){

    }
    public SummaryRequest(String article){
        this.article = article;
    }
    public String getArticle(){
        return article;
    }
    public void setArticle(String article){
        this.article=article;
    }
}
