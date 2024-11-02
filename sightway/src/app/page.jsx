"use client";

import Image from "next/image";
import { useState } from "react";
import { Box } from "@mui/material";
import NavigationPage from "./components/NavigationPage";

export default function Home() {
  const directions = [
    "Head north on Starting Street.",
    "Turn right onto Next Street.",
    "Continue straight for about 1 mile.",
    "Merge onto Highway X via the ramp on the right.",
    "Take Exit Y toward Destination Sign/Street.",
    "Turn left onto Final Street.",
    "Your destination will be on the left."
  ]

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
      <NavigationPage directions={directions} />
    </Box>
  );
}
