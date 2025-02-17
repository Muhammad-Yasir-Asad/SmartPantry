import React, { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";

const SpeechRecognitionComponent = () => {
  const [command, setCommand] = useState("");
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setCommand(transcript.toLowerCase()); // Convert command to lowercase for easier processing
    }
  }, [transcript]);

  const handleVoiceCommand = async () => {
    if (!command) return;

    const words = command.split(" ");
    if (command.includes("add")) {
      const name = words[words.indexOf("add") + 1]; // Get item name
      const quantity = parseInt(words[words.indexOf("quantity") + 1]) || 1; // Get quantity

      // Log the command for debugging
      console.log("Command: ", command);
      console.log("Adding item: ", name, quantity);

      try {
        const token = localStorage.getItem("token");
        console.log("Token: ", token);  // Log the token for debugging

        if (!token) {
          alert("❌ No token found. Please login.");
          return;
        }

        // Sending the POST request to add the item
        const res = await axios.post(
          "http://localhost:5000/api/pantry", // Make sure your backend is running at this URL
          { name, quantity, expirationDate: "2025-12-31" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Response: ", res);  // Log response for debugging
        alert(`✅ Added ${quantity} ${name} to inventory`);
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        alert("❌ Failed to add item.");
      }
    }
    // Handle other voice commands, e.g., remove

    resetTranscript(); // Clear the transcript after processing
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Your browser does not support voice recognition.</p>;
  }

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <p>🎤 {listening ? "Listening..." : "Click to Start Voice Command"}</p>
      <p className="text-gray-600">Recognized: {transcript}</p>
      <button
        onClick={SpeechRecognition.startListening}
        className="btn-primary"
      >
        Start Listening
      </button>
      <button onClick={handleVoiceCommand} className="btn-secondary">
        Process Command
      </button>
      <button onClick={resetTranscript} className="btn-danger">
        Reset
      </button>
    </div>
  );
};

export default SpeechRecognitionComponent;
