export const resumeData = {
  personalInfo: {
    name: "Sarang Gade",
    role: "Full-Stack Developer",
    location: "Nagpur, Maharashtra - 440013",
    email: "saranganilgade@gmail.com",
    phone: "7720059749",
    linkedin: "https://www.linkedin.com/in/sarang-gade",
    github: "https://github.com/kodeMapper",
    leetcode: "https://leetcode.com/u/Kodemapper/",
    image: "/images/profile.jpg"
  },
  education: [
    {
      institution: "Shri. Ramdeobaba College of Engineering and Management",
      degree: "Bachelor of Technology in Electronics and Computer Science",
      duration: "Aug. 2023 – Present",
      location: "Nagpur, Maharashtra",
      grade: "CGPA: 9.44/10"
    },
    {
      institution: "Shri. Ramdeobaba College of Engineering and Management",
      degree: "Minor in Information Technology",
      duration: "Aug. 2024 – Present",
      location: "Nagpur, Maharashtra",
      grade: "Grade: AA"
    }
  ],
  experience: [
    {
      title: "Full-stack Developer Intern",
      company: "AARA Green Infosolutions Pvt. Ltd.",
      duration: "April 2025 – August 2025",
      location: "Nagpur, Maharashtra",
      highlights: [
        "ReactJS Landing Page: Built a responsive multi-section site showcasing services and enabling worker self-registration.",
        "Admin Panel (React, Supabase, Express): Developed a role-based dashboard for bookings, workers, and services with REST APIs and PostgreSQL integration.",
        "Backend Services: Implemented secure ExpressJS endpoints, authentication middleware, and optimized data flows (sub-200 ms response).",
        "Team Collaboration: Worked in an agile startup environment, managing sprints, code reviews, and CI/CD via GitHub."
      ]
    },
    {
      title: "Software Lead",
      company: "Embedded Club, RCOEM",
      duration: "Sep 2025 – Present",
      location: "Nagpur, Maharashtra",
      highlights: []
    },
    {
      title: "Development Hackathons",
      company: "Frontend/Backend Developer",
      duration: "Sep 2024 – Present",
      location: "Maharashtra",
      highlights: []
    }
  ],
  projects: [
    {
      name: "PulseAI – Health Risk Prediction",
      tech: "Python, Flask, React, MongoDB",
      date: "Nov 2025",
      github: "https://github.com/kodeMapper/PulseAI",
      demo: "#",
      image: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
      points: [
        "ML system for maternal health risk prediction (86.7% accuracy).",
        "End-to-end pipeline: model training, Flask API, React dashboard.",
        "Deployed on Vercel and Render."
      ],
      caseStudy: {
        summary: "PulseAI bridges the gap in early maternal health diagnosis using machine learning. It provides actionable insights for healthcare providers by predicting potential risks based on patient vitals.",
        features: [
          "Real-time Risk Analysis with 86.7% accuracy",
          "Interactive Dashboard for Doctors",
          "Secure Patient Data Storage",
          "Exportable Medical Reports"
        ],
        stackReasoning: [
          { tool: "Python/Scikit-Learn", reason: "Standard for ML model training and evaluation." },
          { tool: "Flask", reason: "Lightweight backend to serve ML predictions via API." },
          { tool: "React", reason: "Dynamic UI for real-time data visualization." },
          { tool: "MongoDB", reason: "Flexible schema for key-value patient data." }
        ],
        challenges: [
          "Handling imbalanced datasets for rare high-risk cases.",
          "Optimizing inference time for real-time feedback."
        ],
        gallery: [
          "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
          "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)",
          "linear-gradient(to right, #fa709a 0%, #fee140 100%)"
        ]
      }
    },
    {
      name: "Stampede Management",
      tech: "YOLOv8, OpenCV, Flask",
      date: "Oct 2025",
      github: "https://github.com/kodeMapper/Stampede-Management",
      demo: "#",
      image: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
      points: [
        "Real-time crowd and weapon detection using YOLOv8.",
        "90% accuracy with sub-100ms latency.",
        "Flask backend with live dashboard."
      ],
      caseStudy: {
        summary: "An advanced computer vision system designed to prevent stampedes in high-density areas. It autonomously monitors crowd density and detects potential threats like weapons in real-time.",
        features: [
          "Crowd Density Estimation",
          "Weapon/Threat Detection",
          "Auto-alert System for Authorities",
          "Heatmap Visualization"
        ],
        stackReasoning: [
          { tool: "YOLOv8", reason: "State-of-the-art object detection speed and accuracy." },
          { tool: "OpenCV", reason: "Efficient video stream processing." },
          { tool: "WebSockets", reason: "Low-latency alert delivery to the dashboard." }
        ],
        challenges: [
          "Detecting small objects in crowded, low-light scenes.",
          "Processing multiple video streams concurrently without lag."
        ],
        gallery: [
          "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
          "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
          "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)"
        ]
      }
    },
    {
      name: "GPS & Health Monitor",
      tech: "Node.js, IoT, ESP32",
      date: "April 2025",
      github: "https://github.com/kodeMapper/GPS-Health-Monitor",
      demo: "#",
      image: "linear-gradient(to top, #c471f5 0%, #fa71cd 100%)",
      points: [
        "ESP32 system for real-time GPS and health tracking.",
        "Responsive web dashboard and mobile app."
      ],
      caseStudy: {
        summary: "A unified IoT solution for tracking location and vital signs. Essential for elderly care and remote patient monitoring, ensuring peace of mind for caregivers.",
        features: [
          "Live GPS Tracking via Google Maps API",
          "Heart Rate & SpO2 Monitoring",
          "Emergency SOS Button",
          "Mobile-First Responsive Dashboard"
        ],
        stackReasoning: [
          { tool: "ESP32", reason: "Low-power microcontroller with built-in WiFi/Bluetooth." },
          { tool: "Node.js", reason: "Non-blocking I/O for handling multiple sensor streams." },
          { tool: "Socket.io", reason: "Instant data updates on the client side." }
        ],
        challenges: [
          "Minimizing battery consumption on the hardware.",
          "Ensuring connection stability in poor network areas."
        ],
        gallery: [
          "linear-gradient(to top, #c471f5 0%, #fa71cd 100%)",
          "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
          "linear-gradient(to top, #5f72bd 0%, #9b23ea 100%)"
        ]
      }
    },
    {
      name: "RakshaSetu Safety App",
      tech: "JavaScript, HTML, CSS",
      date: "Nov 2024",
      github: "https://github.com/kodeMapper/RakshaSetu",
      demo: "#",
      image: "linear-gradient(to top, #ebc0fd 0%, #d9ded8 100%)",
      points: [
        "Safety app for women/children with route monitoring.",
        "Real-time tracking and alert mechanisms."
      ],
      caseStudy: {
        summary: "RakshaSetu empowers user safety through community tracking and rapid emergency response. It calculates safe routes and keeps trusted contacts informed.",
        features: [
          "Safe Route Navigation",
          "One-Tap Panic Button",
          "Community Safety Score Maps",
          "Offline SMS Alerts"
        ],
        stackReasoning: [
          { tool: "Leaflet.js", reason: "Lightweight mapping library for route rendering." },
          { tool: "Firebase", reason: "Real-time database for user locations and alerts." },
          { tool: "PWA", reason: "Installable app experience without app store friction." }
        ],
        challenges: [
          "Accurate geolocation tracking in urban canyons.",
          "Balancing privacy with safety requirements."
        ],
        gallery: [
          "linear-gradient(to top, #ebc0fd 0%, #d9ded8 100%)",
          "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)",
          "linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)"
        ]
      }
    },
    {
      name: "Ben 10 Universe",
      tech: "Frontend, Animation",
      date: "July 2024",
      github: "https://github.com/kodeMapper/Ben10-Universe",
      demo: "#",
      image: "linear-gradient(180deg, #2af598 0%, #009efd 100%)",
      points: [
        "Interactive fan site with themed visuals.",
        "Animation effects reflecting cartoon aesthetic."
      ],
      caseStudy: {
        summary: "A nostalgic, immersive web experience celebrating the Ben 10 universe. It heavily leverages CSS animations and sound design to recreate the feel of the show's interface (Omnitrix).",
        features: [
          "Omnitrix Transformation Animations",
          "Character Database with Stats",
          "Themed Sound Effects",
          "Responsive Cartoon Layout"
        ],
        stackReasoning: [
          { tool: "Vanilla CSS", reason: "Maximum control over complex keyframe animations." },
          { tool: "JavaScript", reason: "Managing state for interactive alien switching." },
          { tool: "HTML5 Audio", reason: "Triggering SFX for immersive feedback." }
        ],
        challenges: [
          "Synchronizing multiple animations for a cohesive 'transformation' effect.",
          "Optimizing assets (images/audio) for fast load times."
        ],
        gallery: [
          "linear-gradient(180deg, #2af598 0%, #009efd 100%)",
          "linear-gradient(180deg, #2af598 0%, #009efd 100%)",
          "linear-gradient(180deg, #2af598 0%, #009efd 100%)"
        ]
      }
    }
  ],
  skills: {
    languages: ["JavaScript", "Node", "Express", "HTML", "CSS", "Bootstrap", "Python", "Java", "C", "PHP", "MySQL"],
    tools: ["VS Code", "Eclipse", "Intellij", "MIT App Inventor", "Postman", "MongoDB"],
    frameworks: ["Vercel", "Git", "GitHub", "MS Power BI", "Tableau", "Star UML", "Render"]
  }
};
