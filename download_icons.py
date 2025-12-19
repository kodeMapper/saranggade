import os
import requests

tech_map = {
    "Python": "python",
    "Flask": "flask",
    "React": "react",
    "MongoDB": "mongodb",
    "Next.js 14": "nextdotjs",
    "Framer Motion": "framer",
    "CSS Modules": "cssmodules",
    "YOLOv8": "ultralytics",
    "Node.js": "nodedotjs",
    "Socket.io": "socketdotio",
    "Google Maps": "googlemaps",
    "ESP32": "espressif",
    "HTML5": "html5",
    "CSS3": "css3",
    "JavaScript": "javascript"
}

output_dir = "public/images/tech"
os.makedirs(output_dir, exist_ok=True)

base_url = "https://cdn.simpleicons.org/"

for name, slug in tech_map.items():
    print(f"Downloading {name} ({slug})...")
    try:
        response = requests.get(f"{base_url}{slug}")
        if response.status_code == 200:
            # SVG content
            # Set color to white for dark mode if possible? 
            # SimpleIcons allows ?viewbox=auto etc, but color?
            # Usually we can control fill in CSS if it's inline, but as <img> we might need to pre-color or use filter invert.
            # The user's CSS uses filter: invert(1) for some, but let's just get the default black/brand color.
            # Update: User's CSS has .techIconImg { filter: brightness(0) invert(1); } which makes them white.
            # So default (usually black) or brand colored is fine.
            
            filename = f"{slug}.svg"
            with open(os.path.join(output_dir, filename), "wb") as f:
                f.write(response.content)
            print(f"Saved {filename}")
        else:
            print(f"Failed to download {slug}: Status {response.status_code}")
    except Exception as e:
        print(f"Error downloading {slug}: {e}")
