import requests

# Replace 'YOUR_API_KEY' with your Google Maps Geolocation API key
url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyD7vfh6ilnAl6s4KlG1ifLnGrxpagJqjEw"
data = {
    "considerIp": "true"  # Uses IP-based location lookup
}
response = requests.post(url, json=data)

if response.status_code == 200:
    location_data = response.json()
    print("Latitude:", location_data["location"]["lat"])
    print("Longitude:", location_data["location"]["lng"])
else:
    print("Failed to retrieve data:", response.status_code)
