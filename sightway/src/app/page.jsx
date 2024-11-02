"use client";

import Image from "next/image";
import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

export default function Home() {

  const [text, setText] = useState("");
  const [audio, setAudio] = useState({});

  const loadAudio = (data) => {
    setAudio(data)
  }

  const handleConvertTextToSpeech = async () => {
    try {
      const response = await fetch("api/text-to-speech", {
        method: "POST",
        body: JSON.stringify({ text: text, language_code: "en-US" })
      })
      
      if (!response.ok) {
        throw new Error("Failed to convert text to speech");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setAudio({ src: url, type: "audio/mp3" });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <h1>Sightway</h1>
      <TextField label="Text" value={text} onChange={e => setText(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleConvertTextToSpeech}>Convert Text to Speech</Button>
      {audio.src && (<audio src={audio.src} type={audio.type} controls />)}
      {audio.src && <a href={audio.src} download="audio.mp3">Download Audio</a>}
    </Box>
  );
}
