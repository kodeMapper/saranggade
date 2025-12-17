"use client";
import React from 'react';
import { resumeData } from '@/data/resume';
import styles from '../project.module.css';
import Link from 'next/link';

// Helper to get project data by ID/Slug (using index for simplicity or adding slug to data)
const getProject = (id) => {
    // In a real app, you'd find by slug. Here we use array index for demo.
    return resumeData.projects[id];
};

export default function ProjectDetail({ params }) {
    const project = getProject(params.id);

    if (!project) return <div className={styles.page}>Project not found</div>;

    return (
        <main className={styles.page}>
            <div className={styles.hero}>
                {project.image && !project.image.startsWith('linear') ? (
                    <img src={project.image} className={styles.coverImage} alt={project.name} />
                ) : (
                    <div className={styles.coverImage} style={{ background: project.image || '#1e293b' }}></div>
                )}
                <div className={styles.overlay}>
                    <h1 className={styles.title}>{project.name}</h1>
                </div>
            </div>

            <div className={styles.meta}>
                <div className={styles.mainContent}>
                    <span className={styles.subtitle}>About Project</span>
                    <div className={styles.description}>
                        {project.points ? (
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                                {project.points.map((p, i) => <li key={i} style={{ marginBottom: '1rem' }}>{p}</li>)}
                            </ul>
                        ) : (
                            <p>{project.description}</p>
                        )}
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <Link href="/" style={{ textDecoration: 'underline' }}>← Back to Home</Link>
                    </div>
                </div>

                <aside className={styles.sidebar}>
                    <span className={styles.subtitle}>Tech Stack</span>
                    <div className={styles.techStack}>
                        {project.techStack?.map(t => <span key={t} className={styles.tag}>{t}</span>) ||
                            project.tech.split(', ').map(t => <span key={t} className={styles.tag}>{t}</span>)}
                    </div>

                    <span className={styles.subtitle}>Links</span>
                    <div className={styles.links}>
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`${styles.linkBtn} ${styles.primaryBtn}`}>
                            View Live
                        </a>
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                            GitHub
                        </a>
                    </div>
                </aside>
            </div>
        </main>
    );
}
