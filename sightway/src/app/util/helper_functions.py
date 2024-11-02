# Import necessary libraries
import io
from google.cloud import texttospeech
from flask import Flask, json, request, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import os
import googlemaps
import re

load_dotenv(dotenv_path = './sightway/.env.local')

def create_googlemaps_client(key):
    gmaps = googlemaps.Client(key)
    return gmaps

def get_Location(gmaps,place):
    result = gmaps.places(place)
    location = result["results"][0]["formatted_address"]
    return location

def get_current_Location(gmaps: googlemaps.Client):
    k = gmaps.geolocate()
    return k["location"]

def get_Directions(gmaps: googlemaps.Client, places: list):
    if len(places) < 2:
        return None
    origin = places[0]
    dest = places[-1]
    if len(places) > 2:
        ways = places[1:-1]
    else:
        ways = None
    duration = 0
    distance = 0
    directions = gmaps.directions(origin, dest, mode = "walking", waypoints = ways)[0]["legs"]
    l = []
    for i in range(len(directions)):
        distance += directions[i]["distance"]["value"]
        duration += directions[i]["duration"]["value"]
        steps = directions[i]["steps"]
        for j in range(len(steps)):
            d = {}
            d["Start"] = steps[j]["start_location"]
            d["End"] = steps[j]["end_location"]
            s = steps[j]["html_instructions"]
            s = re.sub(r'<.+?>', ' ', s)
            s = s.split()
            s = ' '.join(s)
            d["Instruction"] = s
            l.append(d)
    l.insert(0, str(round(distance/1000,1)) + " km")
    if duration/60 < 60:
        l.insert(1,str(round(duration/60)) + " mins")
    else:
        k = duration//3600
        duration -= k*3600
        l.insert(1,str(k) + " hrs " + str(round(duration/60)) + " mins")
    return l
