"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
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
        // Fetch update details
        const fetchUpdate = async () => {
            try {
                const res = await fetch(`${API_URL}/api/admin/updates/${id}`);
                if (!res.ok) throw new Error("Update not found");
                const data = await res.json();
                setUpdate(data);

                // Initialize form data based on type
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
            const res = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: data
            });
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

    const techOptions = [
        "React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL",
        "JavaScript", "TypeScript", "Python", "Flask", "Django",
        "HTML5", "CSS3", "TailwindCSS", "Framer Motion",
        "Docker", "AWS", "Firebase", "Git", "C++", "Java"
    ];

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

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.content}>
                <h1 className={styles.title}>Review {update.type} Update</h1>

                <div className={styles.card}>
                    {/* Common Name Field */}
                    <div className={styles.formGroup}>
                        <label>Name / Title</label>
                        <input name="name" value={formData.name || ''} onChange={handleChange} className={styles.input} />
                    </div>

                    {/* GitHub-specific fields */}
                    {update.type === 'github' && (
                        <>
                            <div className={styles.formGroup}>
                                <label>Description (Summary)</label>
                                <textarea name="description" value={formData.description || ''} onChange={handleChange} className={styles.textarea} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Case Study (README Content)</label>
                                <textarea
                                    name="readme"
                                    value={formData.readme || ''}
                                    onChange={handleChange}
                                    className={styles.textarea}
                                    style={{ height: '200px', fontFamily: 'monospace', fontSize: '12px' }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Tech Stack</label>
                                <div className={styles.techGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', marginTop: '8px' }}>
                                    {techOptions.map(tech => {
                                        const isChecked = formData.tech?.split(',').map(t => t.trim()).includes(tech);
                                        return (
                                            <label key={tech} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleTechToggle(tech)}
                                                />
                                                {tech}
                                            </label>
                                        );
                                    })}
                                </div>
                                <input
                                    name="tech"
                                    value={formData.tech || ''}
                                    onChange={handleChange}
                                    placeholder="Or type custom here..."
                                    className={styles.input}
                                    style={{ marginTop: '10px' }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>GitHub URL</label>
                                <input name="github" value={formData.github || ''} onChange={handleChange} className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Demo URL</label>
                                <input name="demo" value={formData.demo || ''} onChange={handleChange} className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Cover Image</label>
                                <input type="file" onChange={handleImageUpload} className={styles.input} accept="image/*" />
                                {formData.image && (
                                    <div style={{ marginTop: 10 }}>
                                        <img src={formData.image} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* LinkedIn Experience fields */}
                    {update.type === 'linkedin_experience' && (
                        <>
                            <div className={styles.formGroup}>
                                <label>Job Title *</label>
                                <input name="title" value={formData.title || ''} onChange={handleChange} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Company *</label>
                                <input name="company" value={formData.company || ''} onChange={handleChange} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Duration *</label>
                                <input name="duration" value={formData.duration || ''} onChange={handleChange} className={styles.input} placeholder="e.g. April 2025 – August 2025" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Location</label>
                                <input name="location" value={formData.location || ''} onChange={handleChange} className={styles.input} placeholder="e.g. Nagpur, Maharashtra" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Company Logo / Image * (Required)</label>
                                <input type="file" onChange={handleImageUpload} className={styles.input} accept="image/*" required />
                                {formData.image && formData.image !== '/images/experience/default.png' && (
                                    <div style={{ marginTop: 10, padding: '10px', background: 'rgba(40,167,69,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <img src={formData.image} alt="Preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                                        <span style={{ color: '#28a745' }}>✅ Image uploaded</span>
                                    </div>
                                )}
                                {(!formData.image || formData.image === '/images/experience/default.png') && (
                                    <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: 6 }}>⚠️ Please upload a company logo or relevant image</p>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Highlights (each line = one bullet point)</label>
                                <textarea
                                    name="highlights"
                                    value={formData.highlights || ''}
                                    onChange={handleChange}
                                    className={styles.textarea}
                                    placeholder="Completed 3-month internship...&#10;Built the official website...&#10;Led a team of 5 developers..."
                                    style={{ height: '120px' }}
                                />
                                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: 4 }}>Each line will become a bullet point in the Experience section</p>
                            </div>
                        </>
                    )}

                    {/* LinkedIn Skills fields */}
                    {update.type === 'linkedin_skill' && (
                        <div className={styles.formGroup}>
                            <label>Select Skills to Add (Uncheck to exclude)</label>
                            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 12 }}>These skills were found on your LinkedIn. Select the ones you want to add to your portfolio.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px', marginTop: '8px', maxHeight: '300px', overflowY: 'auto', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                                {[...new Set(update.data?.skills || [])].map((skill, index) => {
                                    const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
                                    const isChecked = currentSkills.includes(skill);
                                    return (
                                        <label key={`${skill}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer', padding: '4px 8px', background: isChecked ? 'rgba(40,167,69,0.2)' : 'transparent', borderRadius: 4, transition: 'all 0.2s' }}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {
                                                    if (isChecked) {
                                                        setFormData({ ...formData, skills: currentSkills.filter(s => s !== skill).join(', ') });
                                                    } else {
                                                        setFormData({ ...formData, skills: [...currentSkills, skill].join(', ') });
                                                    }
                                                }}
                                            />
                                            {skill}
                                        </label>
                                    );
                                })}
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#28a745', marginTop: 8 }}>✓ Selected: {formData.skills ? formData.skills.split(',').filter(s => s.trim()).length : 0} skills</p>
                        </div>
                    )}

                    {/* LinkedIn Certification fields */}
                    {update.type === 'linkedin_certification' && (
                        <>
                            <div className={styles.formGroup}>
                                <label>Issuer</label>
                                <input name="issuer" value={formData.issuer || ''} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Date</label>
                                <input name="date" value={formData.date || ''} onChange={handleChange} className={styles.input} />
                            </div>
                        </>
                    )}

                    <div className={styles.actions}>
                        <button onClick={handleReject} className={styles.rejectBtn}>Cancel / Ignore</button>
                        <button onClick={handleApprove} className={styles.approveBtn}>Approve & Deploy</button>
                    </div>
                    {message && <p className={styles.message}>{message}</p>}
                </div>
            </div>
        </div>
    );
}
