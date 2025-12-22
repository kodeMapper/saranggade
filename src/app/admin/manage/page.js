"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Briefcase, Code, Award, Upload, Check,
    Calendar, MapPin, Building, Type, Layers
} from 'lucide-react';
import styles from './Manage.module.css';

export default function ManagePortfolio() {
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const [activeTab, setActiveTab] = useState('experience');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Initial States
    const initialExperience = {
        title: '',
        company: '',
        duration: '',
        location: '',
        highlights: '',
        image: ''
    };
    const initialSkill = {
        category: 'languages',
        skillName: '' // Generic input, user can enter comma separated
    };

    const [expData, setExpData] = useState(initialExperience);
    const [skillData, setSkillData] = useState(initialSkill);

    // Handlers
    const handleExpChange = (e) => setExpData({ ...expData, [e.target.name]: e.target.value });
    const handleSkillChange = (e) => setSkillData({ ...skillData, [e.target.name]: e.target.value });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('coverImage', file);

        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok) {
                setExpData(prev => ({ ...prev, image: data.imageUrl }));
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            console.error(err);
            alert('Upload error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        let payload = {};
        let type = '';

        if (activeTab === 'experience') {
            type = 'linkedin_experience';
            // Format highlights to array if needed, but backend often stores as array.
            // Resume.json expects array of strings (often HTML strings).
            // We'll send it as generic data and let the Review page handle final formatting if needed.
            // Actually, let's keep it simple: send raw data, backend makes it a "PendingUpdate".
            payload = {
                title: expData.title,
                company: expData.company,
                duration: expData.duration,
                location: expData.location,
                image: expData.image,
                highlights: expData.highlights.split('\n').filter(line => line.trim() !== '')
            };
        } else if (activeTab === 'skills') {
            type = 'linkedin_skill'; // We reuse this type, but maybe need differentiation for Category?
            // "linkedin_skill" in backend usually expects { skills: [] }
            // If we want to support categories, we might need a new type or Hack it.
            // Let's stick to "linkedin_skill" and pass specific structure.
            // Wait, standard backend logic for 'linkedin_skill' expects `data.skills` array.
            // It puts them into a generic pile. 
            // If we want categories, we might need to update the backend logic later.
            // For now, let's just add them to the system as generic skills.
            payload = {
                skills: skillData.skillName.split(',').map(s => s.trim()).filter(Boolean)
            };
        }

        try {
            const res = await fetch(`${API_URL}/api/admin/manual-update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data: payload })
            });
            const result = await res.json();

            if (res.ok) {
                setMessage('✅ Update Created! Redirecting to Review...');
                // Redirect to review page to verify and deploy
                setTimeout(() => {
                    router.push(result.reviewUrl);
                }, 1500);
            } else {
                setMessage('❌ Error: ' + result.error);
            }
        } catch (err) {
            console.error(err);
            setMessage('❌ Network Error');
        } finally {
            setLoading(false);
        }
    };

    // Helper for Image Preview
    const getPreviewUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        if (path.includes('/images/uploads/')) {
            const filename = path.split('/').pop();
            return `${API_URL}/uploads/${filename}`;
        }
        return path;
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Manage Portfolio</h1>
                    <p className={styles.subtitle}>Add new experiences and skills manually</p>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'experience' ? styles.active : ''}`}
                        onClick={() => setActiveTab('experience')}
                    >
                        <Briefcase size={18} /> Experience
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'skills' ? styles.active : ''}`}
                        onClick={() => setActiveTab('skills')}
                    >
                        <Code size={18} /> Skills
                    </button>
                </div>

                <form className={styles.formCard} onSubmit={handleSubmit}>

                    {activeTab === 'experience' && (
                        <>
                            <div className={styles.formGroup}>
                                <label><Type size={16} /> Job Title</label>
                                <input
                                    name="title"
                                    className={styles.input}
                                    placeholder="e.g. Senior Developer"
                                    value={expData.title}
                                    onChange={handleExpChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label><Building size={16} /> Company Name</label>
                                <input
                                    name="company"
                                    className={styles.input}
                                    placeholder="e.g. Google"
                                    value={expData.company}
                                    onChange={handleExpChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label><Calendar size={16} /> Duration</label>
                                <input
                                    name="duration"
                                    className={styles.input}
                                    placeholder="e.g. Jan 2024 - Present"
                                    value={expData.duration}
                                    onChange={handleExpChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label><MapPin size={16} /> Location</label>
                                <input
                                    name="location"
                                    className={styles.input}
                                    placeholder="e.g. San Francisco, CA"
                                    value={expData.location}
                                    onChange={handleExpChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label><Upload size={16} /> Company Logo</label>
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    className={styles.input}
                                    accept="image/*"
                                />
                                {expData.image && (
                                    <img
                                        src={getPreviewUrl(expData.image)}
                                        className={styles.previewImage}
                                        alt="Preview"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label><Layers size={16} /> Highlights (One per line)</label>
                                <textarea
                                    name="highlights"
                                    className={styles.textarea}
                                    placeholder="Led a team of 5...&#10;increased performance by 20%..."
                                    value={expData.highlights}
                                    onChange={handleExpChange}
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'skills' && (
                        <>
                            <div className={styles.formGroup}>
                                <label><Layers size={16} /> Add Skills (Comma Separated)</label>
                                <textarea
                                    name="skillName"
                                    className={styles.textarea}
                                    placeholder="Rust, Go, Kubernetes, AWS..."
                                    value={skillData.skillName}
                                    onChange={handleSkillChange}
                                    required
                                />
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 8 }}>
                                    These will be processed and you can select/deselect them in the next step.
                                </p>
                            </div>
                        </>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Processing...' : (
                            <>
                                <Check size={20} /> Create & Review
                            </>
                        )}
                    </button>

                    {message && <div className={styles.message}>{message}</div>}
                </form>
            </div>
        </div>
    );
}
