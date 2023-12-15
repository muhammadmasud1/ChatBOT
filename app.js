
const chatbox = document.getElementById("chatbox");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const clearButton = document.getElementById("clearButton");
const chatId = crypto.randomUUID();
let websocket = null;

let receiving = false;
// Change the main chatbot prompt here
const systemPrompt =
  "I'm a Professional Front End Web Developer";

// A function to create a message element based on the text and alignment
function createMessageElement(text, alignment) {
  const messageElement = document.createElement("div");
 
  messageElement.className = `inline-block my-2.5 p-2.5 rounded border ${
    alignment === "left" ? "self-start bg-white" : "self-end bg-blue-200" 
  }`;
  messageElement.textContent = text;
  return messageElement;
}

// A function to connect to the WebSocket server and send/receive messages
function connectWebSocket(message, initChat) {
  receiving = true;
  sendButton.textContent = "Cancel";
  const url = "wss://backend.buildpicoapps.com/api/chatbot/chat";
  websocket = new WebSocket(url);

  websocket.addEventListener("open", () => {
    websocket.send(
      JSON.stringify({
        chatId: chatId,
        appId: "address-realize",
        systemPrompt: systemPrompt,
        message: initChat
          ? "Hey Everyone I'm Muhammad Masud Rana"
          : message, // Change the welcome message here
      })
    );
  });

  const messageElement = createMessageElement("", "left");
  chatbox.appendChild(messageElement);

  websocket.onmessage = (event) => {
    messageElement.textContent += event.data;
    chatbox.scrollTop = chatbox.scrollHeight;
  };

  websocket.onclose = (event) => {
    if (event.code === 1000) {
      receiving = false;
      sendButton.textContent = "Send";
    } else {
      messageElement.textContent +=
        "Error getting response from server. Refresh the page and try again.";
      chatbox.scrollTop = chatbox.scrollHeight;
      receiving = false;
      sendButton.textContent = "Send";
    }
  };
}

// A function to create a welcome message when the chat starts
function createWelcomeMessage() {
  connectWebSocket("", true);
}

// Event listeners
sendButton.addEventListener("click", () => {
  if (!receiving && messageInput.value.trim() !== "") {
    const messageText = messageInput.value.trim();
    messageInput.value = "";
    const messageElement = createMessageElement(messageText, "right");
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;

    connectWebSocket(messageText, false);
  } else if (receiving && websocket) {
    websocket.close(1000);
    receiving = false;
    sendButton.textContent = "Ask Dom!";
  }
});

messageInput.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    !receiving &&
    messageInput.value.trim() !== ""
  ) {
    event.preventDefault();
    sendButton.click();
  }
});

clearButton.addEventListener("click", () => {
  chatbox.innerHTML = "";
});

createWelcomeMessage();
