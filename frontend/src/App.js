import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/`)
            .then(response => setMessage(response.data))
            .catch(error => console.error(error));
    }, []);

    return <h1>{message}</h1>;
}

export default App;
