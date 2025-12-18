export const resumeData = {
  personalInfo: {
    name: "Sarang Gade",
    role: "Full-Stack Developer",
    location: "Nagpur, Maharashtra - 440013",
    email: "saranganilgade@gmail.com",
    phone: "7720059749",
    linkedin: "https://www.linkedin.com/in/sarang-gade",
    github: "https://github.com/kodeMapper",
    twitter: "https://twitter.com/thesaranggade",
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
      image: "/images/experience/aara-green.png",
      highlights: [
        <span>Completed a 3-month paid internship, building the official <a href="https://merididi.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>'Meri Didi' website ↗</a> and admin panel using React/Supabase, plus secure REST APIs, boosting digital presence and efficiency.</span>
      ]
    },
    {
      title: "Software Lead",
      company: "Embedded Club, RCOEM",
      duration: "Sep 2025 – Present",
      location: "Nagpur, Maharashtra",
      image: "/images/experience/embedded-club.jpg",
      highlights: [
        "Conducted technical workshops and guided juniors in the software field.",
        "Mentored multiple project and hackathon teams, fostering innovation."
      ]
    },
    {
      title: "Development Hackathons",
      company: "Frontend/Backend Developer",
      duration: "Sep 2024 – Present",
      location: "Maharashtra",
      image: "/images/experience/hackathons.png",
      highlights: [
        "Secured top 10 ranks in 5+ hackathons and won multiple events.",
        "Led teams to success as a Team Leader in high-pressure environments."
      ]
    }
  ],
  projects: [
    {
      name: "PulseAI – Health Risk Prediction",
      tech: "Python, Flask, React, MongoDB",
      date: "Nov 2025",
      github: "https://github.com/kodeMapper/pulseai-iot-ml-project",
      demo: "https://pulseai-frontend.vercel.app/",
      image: "/images/projects/pulseai/landing.png",
      points: [
        "ML system for maternal health risk prediction (86.7% accuracy).",
        "End-to-end pipeline: model training, Flask API, React dashboard.",
        "Deployed on Vercel and Render."
      ],
      caseStudy: {
        summary: "PulseAI is a full-stack machine learning application that helps healthcare providers identify pregnant women at risk. By analyzing 6 simple vital signs, our system can predict whether a patient is at Low, Medium, or High risk with 86.7% accuracy. It prioritizes recall to minimize false negatives in critical medical scenarios.",
        features: [
          "Real-time Risk Assessment (86.7% Accuracy)",
          "Dark Neon Dashboard with Glassmorphism",
          "SMOTE Class Balancing for 94.5% Recall",
          "Flask API & MongoDB Integration",
          "Interactive Patient Directory & History"
        ],
        stackReasoning: [
          { tool: "Gradient Boosting", reason: "Chosen for higher accuracy (86.7%) and recall over Random Forest/XGBoost." },
          { tool: "Flask 2.3", reason: "Lightweight REST API to serve real-time predictions." },
          { tool: "React 19", reason: "Modern UI for doctors with Framer Motion animations." },
          { tool: "SMOTE", reason: "Synthetic minority oversampling to fix severe class imbalance." },
          { tool: "MongoDB", reason: "Flexible storage for patient records and reading history." }
        ],
        challenges: [
          "Minimizing false negatives: 'Missing a high-risk case is worse than a false alarm'.",
          "Handling class imbalance where high-risk cases were originally rare.",
          "Optimizing model recall from 60% to 94.5% using SMOTE."
        ],
        gallery: [
          "/images/projects/pulseai/landing.png",
          "/images/projects/pulseai/dashboard.png",
          "/images/projects/pulseai/analytics.png",
          "/images/projects/pulseai/report.png"
        ]
      }
    },
    {
      name: "Personal Portfolio Website",
      tech: "Next.js 14, Framer Motion, CSS Modules",
      date: "Dec 2024",
      github: "https://github.com/kodeMapper/Portfolio",
      demo: "https://sarang-gade.vercel.app/",
      image: "/images/projects/portfolio/landing.png",
      points: [
        "Interactive 3D portfolio featuring immersive scroll-snap.",
        "Custom glassmorphism design with theme switching.",
        "Performance optimized with Next.js App Router."
      ],
      caseStudy: {
        summary: "A modern, high-performance portfolio website built to showcase my journey as a developer. It features a seamless scroll-snap experience, complex 3D animations using Framer Motion, and a fully custom glassmorphism design system that adapts to both light and dark modes.",
        features: [
          "Scroll-Snap Layout with 3D Transitions",
          "Dynamic Project Case Studies",
          "Codolio Card 3D Integration",
          "Light/Dark Mode with CSS Variables",
          "Responsive Masonry Grids"
        ],
        stackReasoning: [
          { tool: "Next.js 14", reason: "Server components for fast initial load and SEO." },
          { tool: "Framer Motion", reason: "Complex orchestrations for scroll/hover animations." },
          { tool: "CSS Modules", reason: "Scoped styling to prevent conflicts in component architecture." },
          { tool: "Lucide React", reason: "Lightweight, consistent icon set for UI elements." }
        ],
        challenges: [
          "Implementing smooth scroll-snap behavior across different browsers.",
          "Optimizing heavy image assets for rapid LCP (Largest Contentful Paint).",
          "Designing a cohesive theme system without relying on heavy UI libraries."
        ],
        gallery: [
          "/images/projects/portfolio/landing.png",
          "/images/projects/portfolio/featured_projects.png",
          "/images/projects/portfolio/projects.png",
          "/images/projects/portfolio/experience.png",
          "/images/projects/portfolio/contact.png"
        ]
      }
    },
    {
      name: "Stampede Management System",
      tech: "Python, YOLOv8, Flask, React",
      date: "Oct 2025",
      github: "https://github.com/kodeMapper/stamped-management",
      demo: "https://stamped-management.onrender.com",
      image: "/images/projects/stampede/overview.png",
      points: [
        "Real-time crowd analysis & weapon detection using YOLOv8.",
        "Tri-modal analytics: Crowd density, Lost Person Search, Weapon alerts.",
        "Sub-100ms alert latency with 90%+ model accuracy."
      ],
      caseStudy: {
        summary: "An Integrated Smart Surveillance Platform enabling real-time stampede prevention through synchronized crowd analytics, facial recognition for lost-person search, and weapon detection. It processes multiple camera feeds parallelly to trigger evacuations before safety thresholds are breached.",
        features: [
          "Tri-modal Analytics: Crowd, Face, & Weapon Detection",
          "One-Click Lost Person Search (Haar/ORB)",
          "Sub-100ms Alert Latency",
          "Parallel Processing (Thread-safe Camera Manager)",
          "Responsive Dashboard with Live Telemetry"
        ],
        stackReasoning: [
          { tool: "YOLOv8", reason: "Standard for high-speed object detection (guns/crowd) with 91% precision." },
          { tool: "Haar/ORB", reason: "Efficient facial recognition pipeline for lost-person identification." },
          { tool: "Flask", reason: "Serves MJPEG streams and REST API for telemetry." },
          { tool: "Next.js", reason: "Lazy-loads video feeds to optimize browser bandwidth." },
          { tool: "Python Threading", reason: "Ensures capture threads run non-blocking for <45ms latency." }
        ],
        challenges: [
          "Synchronizing 3 heavy detection models (Crowd, Face, Weapon) on a single feed.",
          "Achieving <100ms latency on commodity hardware (Windows laptops).",
          "Managing browser connection limits with multiple MJPEG streams."
        ],
        gallery: [
          "/images/projects/stampede/overview.png",
          "/images/projects/stampede/face_rec.png",
          "/images/projects/stampede/weapon_det.png",
          "/images/projects/stampede/settings.png"
        ]
      }
    },
    {
      name: "SmartVision - GPS & Fall Detection",
      tech: "Node.js, React, Socket.io, Google Maps, ESP32",
      date: "April 2025",
      github: "https://github.com/kodeMapper/shivCodeSena_HTH_2k25",
      demo: "https://gps-monitoring-seven.vercel.app/",
      image: "/images/projects/gps/map.png",
      points: [
        "IoT wearable for elderly fall detection & real-time tracking.",
        "Integrated MPU6050 sensors with ML-based fall algorithms.",
        "Live dashboard with geofencing and SOS alerts."
      ],
      caseStudy: {
        summary: "SmartVision is an enhanced IoT-based fall detection and family safety tracking system. It combines ESP32 hardware with advanced sensor fusion (accelerometer + gyroscope) to detect falls with precision, automatically triggering alerts to caregivers via SMS and a real-time web dashboard.",
        features: [
          "Advanced Fall Detection (MPU6050 + ML)",
          "Real-time GPS Tracking & Geofencing",
          "Obstacle Detection via LiDAR",
          "Automated SMS/Email Emergency Alerts",
          "Caregiver Dashboard with Health Analytics"
        ],
        stackReasoning: [
          { tool: "ESP32", reason: "Dual-core processor capable of handling sensor fusion and WiFi simultaneously." },
          { tool: "Node.js", reason: "Scalable backend to manage parallel WebSocket connections from devices." },
          { tool: "Twilio", reason: "Reliable, programmable SMS gateway for critical emergency alerts." },
          { tool: "React", reason: "Dynamic dashboard for real-time map updates and status monitoring." },
          { tool: "MPU6050", reason: "6-axis precision IMU essential for accurate fall pattern recognition." }
        ],
        challenges: [
          "Distinguishing actual falls from daily activities to reduce false positives.",
          "Optimizing battery life while maintaining continuous GPS/Sensor polling.",
          "Ensuring instant alert delivery even in areas with fluctuating network."
        ],
        gallery: [
          "/images/projects/gps/map.png",
          "/images/projects/gps/zones.png",
          "/images/projects/gps/devices.png",
          "/images/projects/gps/zones_empty.png"
        ]
      }
    },
    {
      name: "Ben 10 Universe",
      tech: "HTML5, CSS3, JavaScript",
      date: "July 2024",
      github: "https://github.com/kodeMapper/Ben-10-Universe",
      demo: "https://ben-10-universe.vercel.app/",
      image: "/images/projects/ben10/landing.png",
      points: [
        "My first project: A tribute built entirely with Vanilla JS & CSS.",
        "Immersive audio-visual experience with transformation effects."
      ],
      caseStudy: {
        summary: "Ben 10 Universe is a special project as it was my very first website built from scratch using only HTML, CSS, and JavaScript. It serves as an interactive tribute to the show, featuring character bios, alien transformations, and nostalgic sound effects, demonstrating the power of vanilla web technologies without frameworks.",
        features: [
          "Custom CSS Animations (Keyframes)",
          "DOM Manipulation for Alien Switching",
          "Audio Integration (Omnitrix SFX)",
          "Responsive Flexbox Layouts",
          "Interactive Storytelling Elements"
        ],
        stackReasoning: [
          { tool: "Vanilla CSS", reason: "To master the fundamentals of styling and animation." },
          { tool: "JavaScript", reason: "Handling logic for the interactive 'Omnitrix' dial." },
          { tool: "HTML5", reason: "Semantic structure for better accessibility and SEO." }
        ],
        challenges: [
          "Implementing complex animations without animation libraries (Framer Motion/GSAP).",
          "Managing state (selected alien) using only vanilla JavaScript variables.",
          "Ensuring cross-browser compatibility for audio autoplay policies."
        ],
        gallery: [
          "/images/projects/ben10/landing.png",
          "/images/projects/ben10/story.png",
          "/images/projects/ben10/alien_x.png",
          "/images/projects/ben10/hero_time.png",
          "/images/projects/ben10/footer.png"
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
