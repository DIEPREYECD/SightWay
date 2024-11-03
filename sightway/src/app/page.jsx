"use client";

import Image from "next/image";
import { useState } from "react";
import { Box } from "@mui/material";
import NavigationPage from "./components/NavigationPage";
import TargetLocation from "./components/TargetLocation";
import AIRecommend from "./components/AIRecommend";

export default function Home() {
  const [directions, setDirections] = useState([]);
  const [directionsSimple, setDirectionsSimple] = useState([]);

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: { xs: 2, sm: 4 },
        backgroundColor: 'background.default'
      }}
    >
      {/* Collect the user's target location */}
      { directions.length === 0 && <TargetLocation setDirections={setDirections} setDirectionsSimple={setDirectionsSimple} /> }
      {/* Navigation Page */}
      { directions.length > 0 && (<NavigationPage directions={directions} directionsSimple={directionsSimple} />) }
      
    </Box>
  );
}
