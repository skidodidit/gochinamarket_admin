"use client"

import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Globe, Mail, Phone, Image, DollarSign, Search, Truck, FileText, Plus, X, AlertCircle, Check } from 'lucide-react';
import { getSettings, updateSettings, createSettings, deleteSetting } from '@/lib/api/settings';
import { Settings } from '@/types';
import { useApi } from '@/hooks/useApi';

const SettingsPage = () => {
  const [settingsData, setSettingsData] = useState<Settings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Settings>>({
    siteName: '',
    tagline: '',
    bannerText: '',
    supportEmail: '',
    supportPhone: '',
    logoUrl: '',
    faviconUrl: '',
    currencySymbol: '₦',
    currencyCode: 'NGN',
    maintenanceMode: false,
    seo: {
      title: '',
      description: '',
      keywords: []
    },
    shippingInfo: '',
    taxInfo: '',
    customFields: {}
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [newCustomField, setNewCustomField] = useState({ key: '', value: '' });

  const { loading: getLoading, error: getError, run: runGet } = useApi(getSettings);
  const { loading: updateLoading, error: updateError, success: updateSuccess, run: runUpdate } = useApi(updateSettings);
  const { loading: createLoading, error: createError, success: createSuccess, run: runCreate } = useApi(createSettings);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess, run: runDelete } = useApi(deleteSetting);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (updateSuccess || createSuccess) {
      fetchSettings();
      setIsEditing(false);
    }
  }, [updateSuccess, createSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      setSettingsData(null);
      setFormData({
        siteName: '',
        tagline: '',
        bannerText: '',
        supportEmail: '',
        supportPhone: '',
        logoUrl: '',
        faviconUrl: '',
        currencySymbol: '₦',
        currencyCode: 'NGN',
        maintenanceMode: false,
        seo: {
          title: '',
          description: '',
          keywords: []
        },
        shippingInfo: '',
        taxInfo: '',
        customFields: {}
      });
    }
  }, [deleteSuccess]);

  const fetchSettings = async () => {
    const result = await runGet();
    if (result) {
      setSettingsData(result);
      setFormData(result);
    }
  };

  const handleInputChange = (field: keyof Settings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSeoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }));
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: [...(prev.seo?.keywords || []), newKeyword.trim()]
      }
    }));
    setNewKeyword('');
  };

  const handleRemoveKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo?.keywords?.filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddCustomField = () => {
    if (!newCustomField.key.trim() || !newCustomField.value.trim()) return;
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [newCustomField.key]: newCustomField.value
      }
    }));
    setNewCustomField({ key: '', value: '' });
  };

  const handleRemoveCustomField = (key: string) => {
    setFormData(prev => {
      const fields = { ...prev.customFields };
      delete fields[key];
      return { ...prev, customFields: fields };
    });
  };

  const handleSubmit = async () => {
    if (settingsData?._id) {
      await runUpdate(formData);
    } else {
      await runCreate(formData as Settings);
    }
  };

  const handleDelete = async () => {
    if (!settingsData?._id) return;
    if (window.confirm('Are you sure you want to delete all settings? This action cannot be undone.')) {
      await runDelete(settingsData?._id);
    }
  };

  const handleCancel = () => {
    setFormData(settingsData || {
      siteName: '',
      tagline: '',
      bannerText: '',
      supportEmail: '',
      supportPhone: '',
      logoUrl: '',
      faviconUrl: '',
      currencySymbol: '₦',
      currencyCode: 'NGN',
      maintenanceMode: false,
      seo: {
        title: '',
        description: '',
        keywords: []
      },
      shippingInfo: '',
      taxInfo: '',
      customFields: {}
    });
    setIsEditing(false);
  };

  const loading = getLoading || updateLoading || createLoading || deleteLoading;
  const error = getError || updateError || createError || deleteError;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex gap-3">
            {settingsData && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Edit
                </button>
              </>
            )}
            {(!settingsData || isEditing) && (
              <div className="flex gap-3">
                {settingsData && (
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
                  {loading ? 'Saving...' : settingsData ? 'Update' : 'Create'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {(updateSuccess || createSuccess || deleteSuccess) && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <Check className="w-5 h-5" />
            {deleteSuccess ? 'Settings deleted successfully!' : 
             updateSuccess ? 'Settings updated successfully!' : 
             'Settings created successfully!'}
          </div>
        )}

        {/* Maintenance Mode Alert */}
        {settingsData?.maintenanceMode && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Maintenance Mode is Active - Your site is currently inaccessible to visitors</span>
          </div>
        )}

        {getLoading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : !settingsData && !isEditing ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SettingsIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Settings Configured</h2>
              <p className="text-gray-600 mb-6">Set up your website's global settings to get started.</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Configure Settings
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* General Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                General Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  {isEditing || !settingsData ? (
                    <input
                      type="text"
                      value={formData.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      placeholder="My Awesome Store"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{settingsData?.siteName || <span className="text-gray-400 italic">Not set</span>}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  {isEditing || !settingsData ? (
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => handleInputChange('tagline', e.target.value)}
                      placeholder="Your one-stop shop"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{settingsData?.tagline || <span className="text-gray-400 italic">Not set</span>}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Text</label>
                  {isEditing || !settingsData ? (
                    <input
                      type="text"
                      value={formData.bannerText}
                      onChange={(e) => handleInputChange('bannerText', e.target.value)}
                      placeholder="Free shipping on orders over ₦5000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{settingsData?.bannerText || <span className="text-gray-400 italic">Not set</span>}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                  {isEditing || !settingsData ? (
                    <input
                      type="email"
                      value={formData.supportEmail}
                      onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                      placeholder="support@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{settingsData?.supportEmail || <span className="text-gray-400 italic">Not set</span>}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                  {isEditing || !settingsData ? (
                    <input
                      type="tel"
                      value={formData.supportPhone}
                      onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                      placeholder="+234 xxx xxx xxxx"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{settingsData?.supportPhone || <span className="text-gray-400 italic">Not set</span>}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Branding */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-blue-600" />
                Branding
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  {isEditing || !settingsData ? (
                    <input
                      type="text"
                      value={formData.logoUrl}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div>
                      {settingsData?.logoUrl ? (
                        <div className="mt-2">
                          <img 
                            src={settingsData?.logoUrl} 
                            alt="Logo" 
                            className="h-16 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <p className="text-sm text-gray-600 mt-2">{settingsData?.logoUrl}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">Not set</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
                  {isEditing || !settingsData ? (
                    <input
                      type="text"
                      value={formData.faviconUrl}
                      onChange={(e) => handleInputChange('faviconUrl', e.target.value)}
                      placeholder="https://example.com/favicon.ico"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div>
                      {settingsData?.faviconUrl ? (
                        <div className="mt-2">
                          <img 
                            src={settingsData?.faviconUrl} 
                            alt="Favicon" 
                            className="h-8 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <p className="text-sm text-gray-600 mt-2">{settingsData?.faviconUrl}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">Not set</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div> */}

            {/* Currency Settings */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Currency Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
                  {isEditing || !settingsData ? (
                    <input
                      type="text"
                      value={formData.currencySymbol}
                      onChange={(e) => handleInputChange('currencySymbol', e.target.value)}
                      placeholder="₦"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 text-2xl font-bold">{settingsData?.currencySymbol}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency Code</label>
                  {isEditing || !settingsData ? (
                    <input
                      type="text"
                      value={formData.currencyCode}
                      onChange={(e) => handleInputChange('currencyCode', e.target.value)}
                      placeholder="NGN"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{settingsData?.currencyCode}</p>
                  )}
                </div>
              </div>
            </div> */}

            {/* SEO Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                SEO Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                  {isEditing || !settingsData ? (
                    <input
                      type="text"
                      value={formData.seo?.title}
                      onChange={(e) => handleSeoChange('title', e.target.value)}
                      placeholder="Best Online Store - Shop Now"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{settingsData?.seo?.title || <span className="text-gray-400 italic">Not set</span>}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  {isEditing || !settingsData ? (
                    <textarea
                      value={formData.seo?.description}
                      onChange={(e) => handleSeoChange('description', e.target.value)}
                      placeholder="Discover amazing products..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700">{settingsData?.seo?.description || <span className="text-gray-400 italic">Not set</span>}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                  {isEditing || !settingsData ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                          placeholder="Add keyword..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleAddKeyword}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.seo?.keywords?.map((keyword, index) => (
                          <div key={index} className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            <span>{keyword}</span>
                            <button
                              onClick={() => handleRemoveKeyword(index)}
                              className="hover:text-blue-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {settingsData?.seo?.keywords?.length ? (
                        settingsData?.seo.keywords.map((keyword, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-400 italic">No keywords added</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Business Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Shipping Information
                  </label>
                  {isEditing || !settingsData ? (
                    <textarea
                      value={formData.shippingInfo}
                      onChange={(e) => handleInputChange('shippingInfo', e.target.value)}
                      placeholder="We ship nationwide within 3-5 business days..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{settingsData?.shippingInfo || <span className="text-gray-400 italic">Not set</span>}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Information</label>
                  {isEditing || !settingsData ? (
                    <textarea
                      value={formData.taxInfo}
                      onChange={(e) => handleInputChange('taxInfo', e.target.value)}
                      placeholder="VAT included in prices..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{settingsData?.taxInfo || <span className="text-gray-400 italic">Not set</span>}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Maintenance Mode
              </h2>
              {isEditing || !settingsData ? (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.maintenanceMode}
                    onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-gray-900 font-medium">Enable Maintenance Mode</span>
                    <p className="text-sm text-gray-600">When enabled, your site will be inaccessible to visitors</p>
                  </div>
                </label>
              ) : (
                <div className={`px-4 py-2 rounded-lg inline-flex items-center gap-2 ${
                  settingsData?.maintenanceMode 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {settingsData?.maintenanceMode ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Maintenance Mode Active</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="font-medium">Site is Live</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Custom Fields */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Fields</h2>
              {isEditing || !settingsData ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCustomField.key}
                      onChange={(e) => setNewCustomField(prev => ({ ...prev, key: e.target.value }))}
                      placeholder="Field name"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={newCustomField.value}
                      onChange={(e) => setNewCustomField(prev => ({ ...prev, value: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomField()}
                      placeholder="Field value"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddCustomField}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(formData.customFields || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{key}</p>
                          <p className="text-sm text-gray-600">{value}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveCustomField(key)}
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
                  {Object.entries(settingsData?.customFields || {}).length ? (
                    Object.entries(settingsData?.customFields || {}).map(([key, value]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{key}</p>
                        <p className="text-sm text-gray-600">{value}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No custom fields added</p>
                  )}
                </div>
              )}
            </div>

            {/* Metadata */}
            {settingsData && (
              <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-500">
                <div className="flex justify-between items-center">
                  <span>Created: {settingsData?.createdAt ? new Date(settingsData?.createdAt).toLocaleString() : 'N/A'}</span>
                  <span>Last Updated: {settingsData?.updatedAt ? new Date(settingsData?.updatedAt).toLocaleString() : 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;