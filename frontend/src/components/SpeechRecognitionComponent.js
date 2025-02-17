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
      
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          "http://localhost:5000/api/pantry",
          { name, quantity, expirationDate: "2025-12-31" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`✅ Added ${quantity} ${name} to inventory`);
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        alert("❌ Failed to add item.");
      }
    } 
    else if (command.includes("remove")) {
      const name = words[words.indexOf("remove") + 1];
      if (!name) return alert("Item name not recognized.");

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/pantry", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const item = res.data.find((item) => item.name.toLowerCase() === name);
        
        if (!item) return alert("Item not found.");
        
        await axios.delete(`http://localhost:5000/api/pantry/${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(`✅ Removed ${name} from inventory`);
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        alert("❌ Failed to remove item.");
      }
    }
    resetTranscript(); // Clear the transcript
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
