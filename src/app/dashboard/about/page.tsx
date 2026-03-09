"use client"

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image, Video, Target, Eye, Award, TrendingUp, X } from 'lucide-react';
import { getAbout, updateAbout, createAbout, deleteAbout } from '@/lib/api/about';
import { About } from '@/types';
import { useApi } from '@/hooks/useApi';

const AboutPage = () => {
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<About>>({
    title: '',
    description: '',
    mission: '',
    vision: '',
    values: [],
    highlights: [],
    bannerImage: '',
    videoUrl: ''
  });
  const [newValue, setNewValue] = useState('');
  const [newHighlight, setNewHighlight] = useState({ label: '', value: '' });

  const { loading: getLoading, error: getError, run: runGet } = useApi(getAbout);
  const { loading: updateLoading, error: updateError, success: updateSuccess, run: runUpdate } = useApi(updateAbout);
  const { loading: createLoading, error: createError, success: createSuccess, run: runCreate } = useApi(createAbout);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess, run: runDelete } = useApi(deleteAbout);

  useEffect(() => {
    fetchAbout();
  }, []);

  useEffect(() => {
    if (updateSuccess || createSuccess) {
      fetchAbout();
      setIsEditing(false);
    }
  }, [updateSuccess, createSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      setAboutData(null);
      setFormData({
        title: '',
        description: '',
        mission: '',
        vision: '',
        values: [],
        highlights: [],
        bannerImage: '',
        videoUrl: ''
      });
    }
  }, [deleteSuccess]);

  const fetchAbout = async () => {
    const result = await runGet();
    if (result) {
      setAboutData(result);
      setFormData(result);
    }
  };

  const handleInputChange = (field: keyof About, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddValue = () => {
    if (!newValue.trim()) return;
    setFormData(prev => ({
      ...prev,
      values: [...(prev.values || []), newValue.trim()]
    }));
    setNewValue('');
  };

  const handleRemoveValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values?.filter((_, i) => i !== index)
    }));
  };

  const handleAddHighlight = () => {
    if (!newHighlight.label.trim() || !newHighlight.value.trim()) return;
    setFormData(prev => ({
      ...prev,
      highlights: [...(prev.highlights || []), { ...newHighlight }]
    }));
    setNewHighlight({ label: '', value: '' });
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (aboutData?._id) {
      await runUpdate(formData);
    } else {
      await runCreate(formData as About);
    }
  };

  const handleDelete = async () => {
    if (!aboutData?._id) return;
    if (window.confirm('Are you sure you want to delete the About page content?')) {
      await runDelete(aboutData._id);
    }
  };

  const handleCancel = () => {
    setFormData(aboutData || {
      title: '',
      description: '',
      mission: '',
      vision: '',
      values: [],
      highlights: [],
      bannerImage: '',
      videoUrl: ''
    });
    setIsEditing(false);
  };

  const loading = getLoading || updateLoading || createLoading || deleteLoading;
  const error = getError || updateError || createError || deleteError;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex gap-3">
            {aboutData && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/60 font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
            {(!aboutData || isEditing) && (
              <div className="flex gap-3">
                {aboutData && (
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : aboutData ? 'Update' : 'Create'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Success Messages */}
        {(updateSuccess || createSuccess || deleteSuccess) && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {deleteSuccess ? 'About page deleted successfully!' : 
             updateSuccess ? 'About page updated successfully!' : 
             'About page created successfully!'}
          </div>
        )}

        {getLoading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : !aboutData && !isEditing ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No About Page Content</h2>
              <p className="text-gray-600 mb-6">Get started by creating your company's about page content.</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Create About Page
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title <span className="text-red-500">*</span>
                  </label>
                  {isEditing || !aboutData ? (
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="About Us"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{aboutData.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  {isEditing || !aboutData ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Tell your story..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{aboutData.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Mission
                </h2>
                {isEditing || !aboutData ? (
                  <textarea
                    value={formData.mission}
                    onChange={(e) => handleInputChange('mission', e.target.value)}
                    placeholder="Our mission is to..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{aboutData.mission || 'Not set'}</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Vision
                </h2>
                {isEditing || !aboutData ? (
                  <textarea
                    value={formData.vision}
                    onChange={(e) => handleInputChange('vision', e.target.value)}
                    placeholder="We envision a future where..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{aboutData.vision || 'Not set'}</p>
                )}
              </div>
            </div>

            {/* Core Values */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Core Values
              </h2>
              {isEditing || !aboutData ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
                      placeholder="Add a core value..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddValue}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.values?.map((value, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{value}</span>
                        <button
                          onClick={() => handleRemoveValue(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {aboutData.values?.length ? (
                    aboutData.values.map((value, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {value}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No values added</p>
                  )}
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Key Highlights
              </h2>
              {isEditing || !aboutData ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHighlight.label}
                      onChange={(e) => setNewHighlight(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Label (e.g., Years in Business)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={newHighlight.value}
                      onChange={(e) => setNewHighlight(prev => ({ ...prev, value: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
                      placeholder="Value (e.g., 10+)"
                      className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddHighlight}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.highlights?.map((highlight, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">{highlight.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{highlight.value}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveHighlight(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aboutData.highlights?.length ? (
                    aboutData.highlights.map((highlight, index) => (
                      <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">{highlight.label}</p>
                        <p className="text-3xl font-bold text-blue-900">{highlight.value}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic col-span-3">No highlights added</p>
                  )}
                </div>
              )}
            </div>

            {/* Media */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Media</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Banner Image URL
                  </label>
                  {isEditing || !aboutData ? (
                    <input
                      type="text"
                      value={formData.bannerImage}
                      onChange={(e) => handleInputChange('bannerImage', e.target.value)}
                      placeholder="https://example.com/banner.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div>
                      {aboutData.bannerImage ? (
                        <div className="mt-2">
                          <img 
                            src={aboutData.bannerImage} 
                            alt="Banner" 
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
                            }}
                          />
                          <p className="text-sm text-gray-600 mt-2">{aboutData.bannerImage}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No banner image</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Video URL
                  </label>
                  {isEditing || !aboutData ? (
                    <input
                      type="text"
                      value={formData.videoUrl}
                      onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{aboutData.videoUrl || <span className="text-gray-500 italic">No video URL</span>}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Metadata */}
            {aboutData && (
              <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-500">
                <div className="flex justify-between items-center">
                  <span>Created: {aboutData.createdAt ? new Date(aboutData.createdAt).toLocaleString() : 'N/A'}</span>
                  <span>Last Updated: {aboutData.updatedAt ? new Date(aboutData.updatedAt).toLocaleString() : 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;