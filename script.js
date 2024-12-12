// script.js
document.getElementById("sendMessageForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const userMessage = document.getElementById("userMessage").value.trim();
    
    if (userMessage === "") {
        displayStatus("Please enter a message to send.", "error");
        return;
    }

    // Discord webhook URL - Replace with your actual Discord webhook URL
    const webhookUrl = "YOUR_DISCORD_WEBHOOK_URL";

    // Prepare the payload to send to Discord
    const payload = {
        content: userMessage
    };

    try {
        displayStatus("Sending message...", "info");

        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            displayStatus("Message sent to Discord successfully!", "success");
        } else {
            if (response.status === 404) {
                displayStatus("Webhook not found (404). Please check the URL.", "error");
            } else if (response.status === 403) {
                displayStatus("Forbidden (403). Please check the webhook's permissions.", "error");
            } else {
                displayStatus(`Failed to send message. HTTP Status: ${response.status}`, "error");
            }
        }
    } catch (error) {
        displayStatus("An error occurred while sending the message. Please try again later.", "error");
        console.error(error);
    }
});

// Function to display status messages to the user
function displayStatus(message, type) {
    const statusMessageDiv = document.getElementById("statusMessage");
    statusMessageDiv.textContent = message;
    statusMessageDiv.className = ''; // Reset previous styles

    if (type === "error") {
        statusMessageDiv.classList.add("error");
    } else if (type === "success") {
        statusMessageDiv.classList.add("success");
    } else {
        // info or other message type
        statusMessageDiv.classList.add("info");
    }
}
