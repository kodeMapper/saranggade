"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Check, X, Code, Image as ImageIcon, Monitor, Layout,
    MessageSquare, Type, Github, Link as LinkIcon,
    Briefcase, MapPin, Calendar, Layers, FileText
} from 'lucide-react';
import styles from './Review.module.css';

export default function ReviewUpdate() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const { id } = useParams();
    const router = useRouter();
    const [update, setUpdate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUpdate = async () => {
            try {
                const res = await fetch(`${API_URL}/api/admin/updates/${id}`);
                if (!res.ok) throw new Error("Update not found");
                const data = await res.json();
                setUpdate(data);

                if (data.type === 'github') {
                    setFormData({
                        name: data.data.name,
                        description: data.data.description || '',
                        readme: data.data.readmeContent || '',
                        tech: data.data.language || '',
                        github: data.data.html_url,
                        demo: data.data.homepage || '',
                        image: "/images/projects/placeholder.png"
                    });
                } else if (data.type === 'linkedin_experience') {
                    setFormData({
                        name: data.data.name,
                        title: data.data.title,
                        company: data.data.company,
                        duration: data.data.duration,
                        location: data.data.location || '',
                        image: data.data.image || "/images/experience/default.png",
                        highlights: data.data.highlights?.join('\n') || ''
                    });
                } else if (data.type === 'linkedin_skill') {
                    setFormData({
                        name: data.data.name,
                        skills: data.data.skills?.join(', ') || ''
                    });
                } else if (data.type === 'linkedin_certification') {
                    setFormData({
                        name: data.data.name,
                        issuer: data.data.issuer || '',
                        date: data.data.date || ''
                    });
                }
            } catch (err) {
                console.error(err);
                setMessage("Could not load update.");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchUpdate();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const data = new FormData();
        data.append('coverImage', file);
        try {
            setMessage("Uploading image...");
            const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: data });
            const result = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, image: result.imageUrl }));
                setMessage("✅ Image Uploaded");
            } else {
                setMessage("❌ Upload failed: " + result.error);
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Upload Error");
        }
    };

    const handleApprove = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/updates/${id}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ editedData: formData })
            });
            const result = await res.json();
            if (res.ok) {
                setMessage("✅ Approved & Updated! Redirecting...");
                setTimeout(() => router.push('/'), 2000);
            } else {
                setMessage("❌ Error: " + result.error);
            }
        } catch (err) {
            setMessage("❌ Error approving Update");
        }
    };

    const handleReject = async () => {
        if (!confirm("Are you sure you want to ignore this update?")) return;
        try {
            await fetch(`${API_URL}/api/admin/updates/${id}/reject`, { method: 'POST' });
            setMessage("Update rejected.");
            setTimeout(() => router.push('/'), 2000);
        } catch (err) {
            console.error(err);
        }
    };

    // Extended Tech Options
    const techOptions = [
        "JavaScript", "TypeScript", "Python", "Java", "C++", "C", "PHP",
        "React", "Next.js", "Node.js", "Express", "Flask", "Django",
        "HTML5", "CSS3", "TailwindCSS", "Framer Motion", "Bootstrap", "Styled Components",
        "MongoDB", "PostgreSQL", "MySQL", "Supabase", "Firebase",
        "Docker", "AWS", "Git", "GitHub", "Vercel", "Render", "Postman",
        "IoT", "Raspberry Pi", "Arduino", "ESP32", "Machine Learning", "Data Modeling"
    ].sort();

    const handleTechToggle = (tech) => {
        const currentTechs = formData.tech ? formData.tech.split(',').map(t => t.trim()).filter(Boolean) : [];
        if (currentTechs.includes(tech)) {
            setFormData({ ...formData, tech: currentTechs.filter(t => t !== tech).join(', ') });
        } else {
            setFormData({ ...formData, tech: [...currentTechs, tech].join(', ') });
        }
    };

    if (loading) return <div className="p-10 text-white">Loading...</div>;
    if (!update) return <div className="p-10 text-white">Update not found. {message}</div>;

    // Helper to resolve image URL for preview (handle relative paths)
    const getPreviewUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        // If relative, assume it's served by backend proxy or public
        // For preview purposes, we might need full URL if backend is on 5000 and we are on 3000
        // BUT we are using proxy in Next config usually OR mapped static files
        // Let's try raw path first.
        return path;
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Review {update.type.replace('_', ' ')}</h1>

                <div className={styles.card}>
                    {/* Common Name Field */}
                    <div className={styles.formGroup}>
                        <label><Type size={18} /> Name / Title</label>
                        <input name="name" value={formData.name || ''} onChange={handleChange} className={styles.input} />
                    </div>

                    {/* GitHub-specific fields */}
                    {update.type === 'github' && (
                        <>
                            <div className={styles.formGroup}>
                                <label><MessageSquare size={18} /> Description</label>
                                <textarea name="description" value={formData.description || ''} onChange={handleChange} className={styles.textarea} />
                            </div>

                            <div className={styles.formGroup}>
                                <label><FileText size={18} /> README Content (Case Study)</label>
                                <textarea
                                    name="readme"
                                    value={formData.readme || ''}
                                    onChange={handleChange}
                                    className={styles.textarea}
                                    style={{ fontFamily: 'monospace', fontSize: '13px' }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label><Code size={18} /> Tech Stack</label>
                                <div className={styles.techGrid}>
                                    {techOptions.map(tech => {
                                        const isChecked = formData.tech?.split(',').map(t => t.trim()).includes(tech);
                                        return (
                                            <div
                                                key={tech}
                                                className={`${styles.techLabel} ${isChecked ? styles.checked : ''}`}
                                                onClick={() => handleTechToggle(tech)}
                                            >
                                                {isChecked && <Check size={14} />}
                                                {tech}
                                            </div>
                                        );
                                    })}
                                </div>
                                <input
                                    name="tech"
                                    value={formData.tech || ''}
                                    onChange={handleChange}
                                    placeholder="Type custom technologies separated by commas..."
                                    className={styles.input}
                                    style={{ marginTop: '15px' }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label><Github size={18} /> GitHub URL</label>
                                <input name="github" value={formData.github || ''} onChange={handleChange} className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label><Monitor size={18} /> Demo URL</label>
                                <input name="demo" value={formData.demo || ''} onChange={handleChange} className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label><ImageIcon size={18} /> Cover Image</label>
                                <input type="file" onChange={handleImageUpload} className={styles.input} accept="image/*" />
                                {formData.image && (
                                    <img
                                        src={getPreviewUrl(formData.image)}
                                        alt="Preview"
                                        className={styles.imagePreview}
                                        onError={(e) => {
                                            // Fallback if local relative path fails (try prepending backend URL if needed)
                                            // e.target.src = `${API_URL}${formData.image}`;
                                            console.log("Image load failed", formData.image);
                                        }}
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {/* LinkedIn Experience fields */}
                    {update.type === 'linkedin_experience' && (
                        <>
                            <div className={styles.formGroup}>
                                <label><Briefcase size={18} /> Job Title</label>
                                <input name="title" value={formData.title || ''} onChange={handleChange} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label><Briefcase size={18} /> Company</label>
                                <input name="company" value={formData.company || ''} onChange={handleChange} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label><Calendar size={18} /> Duration</label>
                                <input name="duration" value={formData.duration || ''} onChange={handleChange} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label><MapPin size={18} /> Location</label>
                                <input name="location" value={formData.location || ''} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label><ImageIcon size={18} /> Company Logo</label>
                                <input type="file" onChange={handleImageUpload} className={styles.input} accept="image/*" />
                                {formData.image && <img src={formData.image} className={styles.imagePreview} alt="Preview" />}
                            </div>
                            <div className={styles.formGroup}>
                                <label><Layers size={18} /> Highlights</label>
                                <textarea name="highlights" value={formData.highlights || ''} onChange={handleChange} className={styles.textarea} placeholder="Bullet points..." />
                            </div>
                        </>
                    )}

                    {/* LinkedIn Skills fields */}
                    {update.type === 'linkedin_skill' && (
                        <div className={styles.formGroup}>
                            <label><Code size={18} /> Select Skills</label>
                            <div className={styles.techGrid}>
                                {[...new Set(update.data?.skills || [])].map((skill, index) => {
                                    const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
                                    const isChecked = currentSkills.includes(skill);
                                    return (
                                        <div
                                            key={`${skill}-${index}`}
                                            className={`${styles.techLabel} ${isChecked ? styles.checked : ''}`}
                                            onClick={() => {
                                                if (isChecked) {
                                                    setFormData({ ...formData, skills: currentSkills.filter(s => s !== skill).join(', ') });
                                                } else {
                                                    setFormData({ ...formData, skills: [...currentSkills, skill].join(', ') });
                                                }
                                            }}
                                        >
                                            {isChecked && <Check size={14} />}
                                            {skill}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button onClick={handleReject} className={styles.rejectBtn}>
                            <X size={20} /> Ignore
                        </button>
                        <button onClick={handleApprove} className={styles.approveBtn}>
                            <Check size={20} /> Approve & Deploy
                        </button>
                    </div>
                    {message && <div className={styles.message}>{message}</div>}
                </div>
            </div>
        </div>
    );
}
