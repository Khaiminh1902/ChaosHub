/* eslint-disable @typescript-eslint/no-empty-object-type */
export type MessageRole = "user" | "model";

export interface MessagePart{
    text: string;
}

export interface Message{
    role: MessageRole;
    parts: MessagePart[];
}

export interface ChatHistory extends Array<Message> {}

export interface GenerationConfig{
    temperature: number;
    topP: number;
    responseMimeType: string;
}

export interface ChatSettings {
    temperature: number;
    model: string;
    systemInstructions: string;
}