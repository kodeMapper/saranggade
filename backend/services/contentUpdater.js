const fs = require('fs');
const path = require('path');

const RESUME_PATH = path.join(__dirname, '../../src/data/resume.json');

const updatePortfolio = (type, data) => {
    // Read current data
    const resumeData = JSON.parse(fs.readFileSync(RESUME_PATH, 'utf-8'));

    if (type === 'github') {
        const newProject = {
            name: data.name,
            tech: data.tech || data.language || "Unknown",
            date: new Date(data.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            github: data.github || data.html_url,
            demo: data.demo || data.homepage || "",
            image: data.image || "/images/projects/placeholder.png",
            points: [
                data.description || "No description provided."
            ],
            caseStudy: {
                summary: data.readme || data.description || "Coming Soon...",
                features: [],
                stackReasoning: [],
                challenges: [],
                gallery: []
            }
        };
        resumeData.projects.unshift(newProject);
    } else if (type === 'linkedin_experience') {
        // Convert highlights from newline-separated string to array
        const highlights = typeof data.highlights === 'string'
            ? data.highlights.split('\n').map(h => h.trim()).filter(Boolean)
            : data.highlights || [];

        const newExperience = {
            title: data.title,
            company: data.company,
            duration: data.duration,
            location: data.location || '',
            image: data.image || '/images/experience/default.png',
            highlights: highlights
        };
        resumeData.experience.unshift(newExperience);
    } else if (type === 'linkedin_skill') {
        // Data comes as comma-separated string from form, or array from scraper
        const skillsToAdd = typeof data.skills === 'string'
            ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
            : data.skills || [];

        if (!resumeData.skills.tools) resumeData.skills.tools = [];
        // Add only skills not already present
        const existingSkills = [
            ...(resumeData.skills.languages || []),
            ...(resumeData.skills.tools || []),
            ...(resumeData.skills.frameworks || [])
        ];
        const uniqueNewSkills = skillsToAdd.filter(s => !existingSkills.includes(s));
        resumeData.skills.tools.push(...uniqueNewSkills);
    } else if (type === 'linkedin_certification') {
        if (!resumeData.certifications) resumeData.certifications = [];
        const newCert = {
            name: data.name,
            issuer: data.issuer || '',
            date: data.date || ''
        };
        resumeData.certifications.unshift(newCert);
    }

    // Write back
    fs.writeFileSync(RESUME_PATH, JSON.stringify(resumeData, null, 2));

    return true;
};

module.exports = { updatePortfolio };
