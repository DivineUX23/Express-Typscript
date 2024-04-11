import express from "express";

import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from 'dotenv';
dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY as string

const genAI = new GoogleGenerativeAI(geminiApiKey);

export const run = async (post: String, edit: String) => {


    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `Make this ${post} according to this decription${edit}`

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text

}