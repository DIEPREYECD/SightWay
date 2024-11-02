import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  IconButton,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  useTheme
} from '@mui/material';

import { PlayArrow, SkipNext, SkipPrevious, Pause, VolumeUp } from '@mui/icons-material';

 // Sample navigation steps
const directions = [
  "Walk straight for 50 meters",
  "Turn right at the traffic signal",
  "Continue straight past the convenience store",
  "Your destination will be on the left"
];

const NavigationPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const theme = useTheme();
  

  const [audio, setAudio] = useState({});


  const handleConvertTextToSpeech = async () => {
    try {
      const text = directions.join(". ");
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

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, directions.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const progress = ((currentStep + 1) / directions.length) * 100;

  useEffect(() => {
    if (directions.length > 0) handleConvertTextToSpeech();
  }, [directions]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'background.default',
          mb: 4,
          p: 2
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          SightWay Navigation
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Real-time navigation assistance
        </Typography>
      </Paper>

      {/* Current Direction Card */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Direction
          </Typography>
          
          <Typography variant="body1" sx={{ my: 3, fontSize: '1.2rem' }}>
            {directions[currentStep]}
          </Typography>

          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 8,
                borderRadius: 4
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Step {currentStep + 1} of {directions.length}
          </Typography>

          {/* Navigation Controls */}
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2
            }}
          >
            <IconButton 
              onClick={handlePrevious}
              disabled={currentStep === 0}
              aria-label="Previous step"
              size="large"
            >
              <SkipPrevious />
            </IconButton>

            <IconButton
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause" : "Play"}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
                p: 2
              }}
              size="large"
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>

            <IconButton
              onClick={handleNext}
              disabled={currentStep === directions.length - 1}
              aria-label="Next step"
              size="large"
            >
              <SkipNext />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Audio Player Card */}
      {audio.src && (
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <VolumeUp sx={{ mr: 1 }} />
            <Typography variant="h6">
              Audio Playback
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ width: '100%' }}>
            <audio
              controls
              style={{ width: '100%' }}
              aria-label="Navigation audio"
            >
              <source src={audio.src} type={audio.type} />
              Your browser does not support the audio element.
            </audio>
          </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default NavigationPage;
