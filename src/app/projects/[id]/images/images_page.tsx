"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProjectImagesPage() {
  const router = useRouter();
  const params = useParams();
  // Robustly get projectId (works for both string and array)
  const projectId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (error) setError(error.message);
      setImages(data || []);
      setLoading(false);
    };
    if (projectId) fetchImages();
  }, [projectId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    setDeleteLoading(id);
    const { error } = await supabase
      .from('project_images')
      .delete()
      .eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      setImages(prev => prev.filter(img => img.id !== id));
    }
    setDeleteLoading(null);
  };

  return (
    <div className="container page-content" style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>All Project Images</h1>
      <button
        className="btn btn-secondary"
        style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}
        onClick={() => router.push(`/projects/${projectId}`)}
      >
        ← Back to Project
      </button>
      {loading ? (
        <div style={{ color: 'var(--color-primary)' }}>Loading...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : images.length === 0 ? (
        <div style={{ color: 'var(--color-text-light)' }}>No images found for this project.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {images.map(img => (
            <div
              key={img.id}
              className="card"
              style={{
                padding: '1rem',
                position: 'relative',
                background: 'var(--color-bg-card)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border-dark)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <img
                src={img.url}
                alt={img.description || 'Project image'}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '0.25rem',
                  marginBottom: '1rem',
                  background: 'var(--color-primary)',
                }}
              />
              <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>{img.description}</div>
              <button
                className="btn btn-danger btn-sm"
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--color-primary)', color: 'white', border: 'none' }}
                onClick={() => handleDelete(img.id)}
                disabled={deleteLoading === img.id}
              >
                {deleteLoading === img.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 