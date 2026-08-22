export interface SourceItem {
  type: string;
  id: number;
  name: string;
}

export interface ChatResponse {
  answer: string;
  sources: SourceItem[];
}

// Generate a random session ID for the user's browser tab
export const getSessionId = () => {
  if (typeof window !== "undefined") {
    let sid = sessionStorage.getItem("campusos_session");
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("campusos_session", sid);
    }
    return sid;
  }
  return "default";
};

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const response = await fetch("http://127.0.0.1:8000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      session_id: getSessionId(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to communicate with AI Assistant");
  }

  return response.json();
}