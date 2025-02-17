import { useState, useEffect } from "react";
import { getPantryItems, addPantryItem, updatePantryItem, deletePantryItem } from "../services/api";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./Pantry.css"; // Import styles
import { FaMicrophone, FaEdit, FaTrash, FaPlus, FaSync, FaTimes } from "react-icons/fa";

const Pantry = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", quantity: 1, expirationDate: "", category: "" });
    const [editingItem, setEditingItem] = useState(null);

    // Voice Recognition Setup
    const { transcript, listening, resetTranscript } = useSpeechRecognition();

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (transcript) {
            handleVoiceCommand(transcript.toLowerCase());
        }
    }, [transcript]);

    // Fetch pantry items
    const fetchItems = async () => {
        const token = localStorage.getItem("token");
        const response = await getPantryItems(token);
        setItems(response.data);
    };

    // Handle Add / Edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (editingItem) {
            await updatePantryItem(editingItem._id, editingItem, token);
            setEditingItem(null);
        } else {
            await addPantryItem(newItem, token);
            setNewItem({ name: "", quantity: 1, expirationDate: "", category: "" });
        }
        fetchItems();
    };

    // Delete pantry item
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        await deletePantryItem(id, token);
        fetchItems();
    };

    // Handle Voice Commands
    const handleVoiceCommand = async (command) => {
        const words = command.split(" ");

        if (command.includes("add")) {
            const quantity = parseInt(words[words.indexOf("add") + 1]) || 1;
            const name = words.slice(words.indexOf("add") + 2, words.indexOf("in")).join(" ");
            const category = words.includes("in") ? words[words.indexOf("in") + 1] : "Uncategorized";
            const expirationDate = words.includes("expiry") ? words[words.indexOf("expiry") + 1] : "2025-12-31";

            if (!name) return alert("❌ Could not recognize the item name.");

            const token = localStorage.getItem("token");
            await addPantryItem({ name, quantity, expirationDate, category }, token);
            alert(`✅ Added ${quantity} ${name} in ${category} (Expires: ${expirationDate})`);
            fetchItems();
        } 

        else if (command.includes("update")) {
            const name = words.slice(words.indexOf("update") + 1).join(" ");
            const item = items.find(item => item.name.toLowerCase() === name);
            if (!item) return alert("❌ Item not found.");

            setEditingItem(item);
            alert(`✏️ Editing ${name}`);
        }

        else if (command.includes("remove")) {
            const name = words.slice(words.indexOf("remove") + 1).join(" ");
            const item = items.find(item => item.name.toLowerCase() === name);
            if (!item) return alert("❌ Item not found.");

            const token = localStorage.getItem("token");
            await deletePantryItem(item._id, token);
            alert(`✅ Removed ${name}`);
            fetchItems();
        }

        resetTranscript();
    };

    return (
        <div className="container">
            <h2 className="title">Pantry Management</h2>

            {/* Voice Recognition Section */}
            <div className="voice-section">
                <p>🎤 {listening ? "Listening..." : "Click to Start Voice Command"}</p>
                <p className="transcript">Recognized: {transcript}</p>
                <button onClick={SpeechRecognition.startListening} className="button"><FaMicrophone /> Start Listening</button>
                <button onClick={resetTranscript} className="button cancel"><FaSync /> Reset</button>
            </div>

            {/* Add/Edit Item Form */}
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Item Name" 
                        value={editingItem ? editingItem.name : newItem.name} 
                        onChange={(e) => editingItem ? setEditingItem({ ...editingItem, name: e.target.value }) : setNewItem({ ...newItem, name: e.target.value })}
                        required 
                    />
                    <input 
                        type="number" 
                        placeholder="Quantity" 
                        value={editingItem ? editingItem.quantity : newItem.quantity} 
                        onChange={(e) => editingItem ? setEditingItem({ ...editingItem, quantity: e.target.value }) : setNewItem({ ...newItem, quantity: e.target.value })}
                        required 
                    />
                    <input 
                        type="date" 
                        value={editingItem ? editingItem.expirationDate : newItem.expirationDate} 
                        onChange={(e) => editingItem ? setEditingItem({ ...editingItem, expirationDate: e.target.value }) : setNewItem({ ...newItem, expirationDate: e.target.value })}
                        required 
                    />
                    <input 
                        type="text" 
                        placeholder="Category" 
                        value={editingItem ? editingItem.category : newItem.category} 
                        onChange={(e) => editingItem ? setEditingItem({ ...editingItem, category: e.target.value }) : setNewItem({ ...newItem, category: e.target.value })}
                        required 
                    />
                    <button type="submit" className="button">{editingItem ? <><FaEdit /> Update Item</> : <><FaPlus /> Add Item</>}</button>
                    {editingItem && <button className="button cancel" onClick={() => setEditingItem(null)}><FaTimes /> Cancel</button>}
                </form>
            </div>

            {/* Pantry Item List */}
            <div className="grid">
                {items.map((item) => (
                    <div key={item._id} className="card">
                        <h3>{item.name}</h3>
                        <p>Quantity: {item.quantity}</p>
                        <p>Category: {item.category}</p>
                        <p className="expire">Expires: {item.expirationDate}</p>
                        <div className="buttons">
                            <button className="button edit" onClick={() => setEditingItem(item)}><FaEdit /> Edit</button>
                            <button className="button delete" onClick={() => handleDelete(item._id)}><FaTrash /> Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pantry;
