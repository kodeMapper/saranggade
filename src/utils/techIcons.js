export const techMap = {
    "Python": "python",
    "Flask": "flask",
    "React": "react",
    "MongoDB": "mongodb",
    "Next.js 14": "nextdotjs",
    "Next.js": "nextdotjs", // Handle short variation
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
};

export const getTechIcon = (techName) => {
    const raw = techName.trim();
    // Check direct map
    if (techMap[raw]) {
        return `/images/tech/${techMap[raw]}.svg`;
    }

    // Check cleaned keys (case insensitive)
    const lower = raw.toLowerCase();
    for (const key in techMap) {
        if (key.toLowerCase() === lower) {
            return `/images/tech/${techMap[key]}.svg`;
        }
    }

    // Fallback: Use simple icons CDN which has almost everything
    // This satisfies "automatically map the svg for mentioned techstack"
    const slug = lower.replace(/[\s\.]/g, ''); // "node.js" -> "nodejs"
    return `https://cdn.simpleicons.org/${slug}`;
};
