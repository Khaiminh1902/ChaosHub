"use client"

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { sendMessage } from "../ai/actions";
import ReactMarkdown from "react-markdown";

export type ChatMessage = {
    id: string;
    role: "user" | "model";
    text: string;
};

const Chat = () => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [isModelThinking, setTransition] = useTransition();
    const [showClearModal, setShowClearModal] = useState(false);

    useEffect(() => {
        const storedHistory = localStorage.getItem("chatHistory");
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []);

    useEffect(() => {
        if (history.length > 0) {
            try {
                localStorage.setItem("chatHistory", JSON.stringify(history));
            } catch (e) {
                console.error("Storage quota exceeded:", e);
                alert("Storage limit reached. Please clear the chat history.");
            }
        }
    }, [history]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage: ChatMessage = {
            id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
            role: "user",
            text: input,
        };
        setHistory((prev) => [...prev, userMessage]);
        setInput("");

        try {
            setTransition(async () => {
                const responseMessage = await sendMessage(
                    input,
                    [...history, userMessage]
                );
                const chatMessage: ChatMessage = {
                    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
                    role: "model",
                    text: responseMessage ?? "",
                };
                setHistory((prev) => [...prev, chatMessage]);
            });
        } catch (e) {
            console.error("Error sending message:", e);
            alert("Failed to send message. Please try again.");
        }
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem("chatHistory");
        setShowClearModal(false);
    };

    const renderMessage = (text: string) => <ReactMarkdown>{text}</ReactMarkdown>;

    return (
        <div className="relative">
            <Card className="mx-4 md:mx-10 mt-10 h-[700px] shadow-lg">
                <CardContent className="p-6 flex flex-col gap-4 h-full">
                    <div className="flex flex-col h-[700px] gap-2 overflow-y-auto bg-muted rounded p-3">
                        {history.length === 0 && (
                            <span className="text-muted-foreground text-sm">Start the conversation...</span>
                        )}
                        {history.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-lg max-w-xs ${
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground"
                                    }`}
                                >
                                    {renderMessage(msg.text)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form
                        className="flex gap-2"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await handleSend();
                        }}
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isModelThinking}
                            className="flex items-end justify-end"
                        />
                        <Button
                            type="submit"
                            className="bg-blue-500 cursor-pointer text-white"
                            disabled={isModelThinking || !input.trim()}
                        >
                            {isModelThinking ? "Thinking..." : "Send"}
                        </Button>
                        <Button
                            type="button"
                            className="bg-red-500 cursor-pointer text-white"
                            onClick={() => setShowClearModal(true)}
                        >
                            Clear Chat 
                        </Button>
                    </form>
                </CardContent>
            </Card>
            {showClearModal && (
                <div className="fixed inset-0 bg-black opacity-90 text-white flex items-center justify-center z-50">
                    <Card className="w-80">
                        <CardContent className="p-4">
                            <p className="mb-4 text-center">
                                Are you sure you want to clear the chat history? Please understand that this action cannot be undone.
                            </p>-
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => setShowClearModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="cursor-pointer bg-red-500"
                                    onClick={clearHistory}
                                >
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Chat;