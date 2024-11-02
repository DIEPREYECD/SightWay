# Import necessary libraries
import io
import os
from google.cloud import texttospeech
from flask import Flask, json, request, send_file
from flask_cors import CORS

app = Flask(__name__)

# Test route
@app.route("/test", methods=["GET"])
def test():
    return "Hello, World!"

# POST request to convert text to speech
@app.route("/text-to-speech", methods=["POST"])
def text_to_speech():
    args = request.get_json()
    text = args.get("text", "")
    language_code = args.get("language_code", "en-US")

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

    audio_stream = io.BytesIO(response.audio_content)
    audio_stream.seek(0)

    return send_file(audio_stream, mimetype="audio/mp3", as_attachment=True, download_name="audio.mp3")

if __name__ == "__main__":
    app.run(debug=True)

