"use client";

import { useState } from "react";
import { TextField, Button } from "@mui/material";

export default function TargetLocation({ setDirections, setDirectionsSimple }) {
    const [targetLocation, setTargetLocation] = useState("");

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/directions", {
                method: "POST",
            body: JSON.stringify({ "destination": targetLocation }),
            headers: {
                "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            
            setDirections(data);

            for (let i = 2; i < data.length; i++) {
                setDirectionsSimple((prev) => [...prev, data[i]["Instruction"]]);
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <div>
            {/* Header */}
            <h1>Target Location</h1>

            {/* Input Field */}
            <TextField
                label="Target Location"
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
            />
            
            {/* Submit Button */}
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    )
}