from flask import Flask, json, request
import os
import dotenv as dotenv
import cv2
import time
import base64
from openai import OpenAI

dotenv.load_dotenv(dotenv_path='./sightway/.env.local')

app = Flask(__name__)

@app.route('/')
def index():
    return json.dumps({'message': 'Hello, World!'})

@app.route('/get_image', methods=['GET'])
def get_image():
    frame = collect_image()
    encoded_frame = encode_image(frame)
    return json.dumps({'image': encoded_frame})

@app.route('/object_detect', methods=['POST'])
def object_detect():
    args = request.get_json()
    heading = args.get("heading", "")
    path_description = args.get("path_description", "")
    speed = args.get("speed", "")
    frame = collect_image()
    encoded_frame = encode_image(frame)
    system_prompt = """
        You are a computer vision navigation assistant. Based on the following user's current path, determine if there are any obstacles that require attention.

        Context:
        - User's current heading: [HEADING]
        - Intended path: [PATH_DESCRIPTION]
        - Current speed: [SPEED]

        Analyze the scene and respond in the following JSON format:
        {
            "obstacles_detected": boolean,
            "obstacle_type": string,
            "risk_level": "low" | "medium" | "high",
            "distance": number,
            "position": "left" | "center" | "right",
            "requires_immediate_action": boolean,
            "recommendation": string
        }

        Example input:
        {
            "heading": "north",
            "path_description": "left turn at next intersection",
            "speed": "walking"
        }

        Example output:
        {
            "obstacles_detected": true,
            "obstacle_type": "construction_barrier",
            "risk_level": "medium",
            "distance": 5,
            "position": "right",
            "requires_immediate_action": true,
            "recommendation": "Shift to left side of sidewalk while maintaining forward direction"
        }
    """
    response = get_openai_response(encoded_frame, system_prompt, f"Heading: {heading}, Path Description: {path_description}, Speed: {speed}")
    print(response)
    return json.dumps({'message': response, "picture": encode_image})

@app.route('/path_deviation_analysis', methods=['POST'])
def path_deviation_analysis():
    args = request.get_json()

    system_prompt = """
    You are a navigation assistant. Analyze if the current position requires path recalculation.

    Input Parameters:
    - Original path coordinates: [COORDINATES]
    - Current position: [POSITION]
    - Destination: [DESTINATION]
    - Maximum allowed deviation: [DEVIATION_THRESHOLD] meters

    Respond in the following JSON format:
    {
        "path_deviation_detected": boolean,
        "deviation_distance": number,
        "recalculation_needed": boolean,
        "severity": "minor" | "moderate" | "severe",
        "recommended_action": string
        }
    """

@app.route('/obstacle_evasion', methods=['POST'])
def obstacle_evasion():
    system_prompt = """
    You are a navigation assistant helping a user navigate around obstacles. Generate clear, step-by-step instructions for obstacle evasion while maintaining the general direction toward the destination.

    Context:
    - Obstacle information: [OBSTACLE_DETAILS]
    - Current path: [PATH_DETAILS]
    - Environmental constraints: [CONSTRAINTS]
    - User movement speed: [SPEED]

    Provide instructions in the following JSON format:
    {
        "evasion_steps": [
        {
            "step_number": number,
            "action": string,
            "distance": number,
            "direction": string,
            "caution_notes": string
        }
    ],
    "estimated_deviation": number,
    "return_to_path_instructions": string,
    "safety_notes": string
    }
    """

def collect_image():
    # Collect image from camera
    cap = cv2.VideoCapture(0)
    # Set frame width and height if needed
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

    ret, frame = cap.read()

    cap.release()

    with open('./sightway/public/OIP.jpg', 'rb') as f:
        frame = f.read()

    return frame

def encode_image(frame):
    return base64.b64encode(frame).decode('utf-8')

def get_openai_client():
    return OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def get_openai_response(frame, system_prompt, user_prompt):
    client = get_openai_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": system_prompt}, 
                  {"role": "user", "content": [
                        {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{frame}'}}, 
                        {'type': 'text', 'text': user_prompt}
                      ]}
                  ]
    )
    return response.choices[0].message.content

if __name__ == '__main__':
    app.run(debug=True)

