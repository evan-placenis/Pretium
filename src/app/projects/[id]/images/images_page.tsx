"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase, ProjectImage } from '@/lib/supabase';


export default function ProjectImagesPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [editTag, setEditTag] = useState<'overview' | 'deficiency' | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

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

  const handleImageClick = (image: ProjectImage) => {
    setSelectedImage(image);
    setEditDescription(image.description || '');
    setEditTag(image.tag);
    setEditMode(false);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setEditMode(false);
    setEditDescription('');
    setEditTag(null);
  };

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
      if (selectedImage?.id === id) {
        closeModal();
      }
    }
    setDeleteLoading(null);
  };

  const handleUpdate = async () => {
    if (!selectedImage) return;
    
    setUpdateLoading(true);
    const { error } = await supabase
      .from('project_images')
      .update({
        description: editDescription,
        tag: editTag
      })
      .eq('id', selectedImage.id);

    if (error) {
      setError(error.message);
    } else {
      // Update the local state
      setImages(prev => prev.map(img => 
        img.id === selectedImage.id 
          ? { ...img, description: editDescription, tag: editTag }
          : img
      ));
      setSelectedImage(prev => prev ? { ...prev, description: editDescription, tag: editTag } : null);
      setEditMode(false);
    }
    setUpdateLoading(false);
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
                cursor: 'pointer',
              }}
              onClick={() => handleImageClick(img)}
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
              <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                {img.description}
              </div>
              {img.tag && (
                <span 
                  className={`badge ${img.tag === 'deficiency' ? 'badge-danger' : 'badge-info'}`}
                  style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}
                >
                  {img.tag}
                </span>
              )}
              <button
                className="btn btn-danger btn-sm"
                style={{ 
                  position: 'absolute', 
                  top: '1rem', 
                  right: '1rem', 
                  background: 'var(--color-danger)', 
                  color: 'white', 
                  border: 'none',
                  zIndex: 1
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(img.id);
                }}
                disabled={deleteLoading === img.id}
              >
                {deleteLoading === img.id ? 'Deleting...' : '×'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedImage && (
        <div 
          className="modal" 
          style={{ 
            display: 'block',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div 
            className="modal-content"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--color-bg-card)',
              padding: '2rem',
              borderRadius: '0.5rem',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              minWidth: '400px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Image Details</h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--color-text)',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <img
                src={selectedImage.url}
                alt={selectedImage.description || 'Project image'}
                style={{
                  width: '100%',
                  maxHeight: '60vh',
                  objectFit: 'contain',
                  borderRadius: '0.25rem',
                }}
              />
            </div>

            {editMode ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ color: 'var(--color-text)' }}>Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="form-input"
                    rows={3}
                    placeholder="Enter image description..."
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ color: 'var(--color-text)' }}>Tag</label>
                  <select
                    value={editTag || ''}
                    onChange={(e) => setEditTag(e.target.value === '' ? null : e.target.value as 'overview' | 'deficiency')}
                    className="form-input"
                    style={{ width: '100%' }}
                  >
                    <option value="">No tag</option>
                    <option value="overview">Overview</option>
                    <option value="deficiency">Deficiency</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleUpdate}
                    disabled={updateLoading}
                    className="btn btn-primary"
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--color-text)' }}>Description:</strong>
                  <p style={{ margin: '0.5rem 0', color: 'var(--color-text-light)' }}>
                    {selectedImage.description || 'No description'}
                  </p>
                </div>
                {selectedImage.tag && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: 'var(--color-text)' }}>Tag:</strong>
                    <span 
                      className={`badge ${selectedImage.tag === 'deficiency' ? 'badge-danger' : 'badge-info'}`}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      {selectedImage.tag}
                    </span>
                  </div>
                )}
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--color-text)' }}>Created:</strong>
                  <span style={{ marginLeft: '0.5rem', color: 'var(--color-text-light)' }}>
                    {new Date(selectedImage.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="btn btn-secondary"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(selectedImage.id)}
                disabled={deleteLoading === selectedImage.id}
                className="btn btn-danger"
              >
                {deleteLoading === selectedImage.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 