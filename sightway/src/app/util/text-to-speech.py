# Import necessary libraries
import os
from google.cloud import texttospeech
from flask import Flask, request

app = Flask(__name__)

# Test route
@app.route("/test", methods=["GET"])
def test():
    return "Hello, World!"

# GET request to convert text to speech
@app.route("/text-to-speech", methods=["GET"])
def text_to_speech():
    args = request.get_json()
    text = args["text"]
    language_code = args["language_code"]

    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

    with open("../../../public/output.mp3", "wb") as out:
        out.write(response.audio_content)

    return "Audio content written to output.mp3"


if __name__ == "__main__":
    app.run(debug=True)

