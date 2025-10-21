"use client"

import { useState, useEffect } from 'react';
import { Save, Mail, Phone, MapPin, MessageCircle, Instagram, Youtube, Music, Twitter, Facebook, Plus, Trash2, Edit2, X, Check, AlertCircle } from 'lucide-react';
import { getContacts, createContact, updateContact, deleteContact } from '@/lib/api/contact';
import { Contact } from '@/types';
import { useApi } from '@/hooks/useApi';

const ContactPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Contact>>({
    email: '',
    phone: '',
    address: '',
    whatsapp: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    twitter: '',
    facebook: ''
  });

  const { loading: getLoading, error: getError, run: runGet } = useApi(getContacts);
  const { loading: createLoading, error: createError, success: createSuccess, run: runCreate } = useApi(createContact);
  const { loading: updateLoading, error: updateError, success: updateSuccess, run: runUpdate } = useApi(updateContact);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess, run: runDelete } = useApi(deleteContact);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      fetchContacts();
      setIsEditing(false);
      setIsCreating(false);
      setSelectedContact(null);
      resetForm();
    }
  }, [createSuccess, updateSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      fetchContacts();
      setSelectedContact(null);
    }
  }, [deleteSuccess]);

  const fetchContacts = async () => {
    const result = await runGet();
    if (result) {
      setContacts(result);
      if (result.length > 0 && !selectedContact) {
        setSelectedContact(result[0]);
        setFormData(result[0]);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      phone: '',
      address: '',
      whatsapp: '',
      instagram: '',
      youtube: '',
      tiktok: '',
      twitter: '',
      facebook: ''
    });
  };

  const handleInputChange = (field: keyof Contact, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (isCreating) {
      await runCreate(formData as Contact);
    } else if (selectedContact?._id) {
      await runUpdate(selectedContact._id, formData);
    }
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData(contact);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(false);
    setSelectedContact(null);
  };

  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
      if (contacts.length > 0) {
        setSelectedContact(contacts[0]);
        setFormData(contacts[0]);
      }
    } else {
      setIsEditing(false);
      if (selectedContact) {
        setFormData(selectedContact);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact information?')) {
      await runDelete(id);
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData(contact);
    setIsEditing(false);
    setIsCreating(false);
  };

  const loading = getLoading || createLoading || updateLoading || deleteLoading;
  const error = getError || createError || updateError || deleteError;

  const getSocialIcon = (platform: string) => {
    const icons = {
      whatsapp: <MessageCircle className="w-5 h-5" />,
      instagram: <Instagram className="w-5 h-5" />,
      youtube: <Youtube className="w-5 h-5" />,
      tiktok: <Music className="w-5 h-5" />,
      twitter: <Twitter className="w-5 h-5" />,
      facebook: <Facebook className="w-5 h-5" />
    };
    return icons[platform as keyof typeof icons];
  };

  const getSocialColor = (platform: string) => {
    const colors = {
      whatsapp: 'bg-green-100 text-green-700 hover:bg-green-200',
      instagram: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
      youtube: 'bg-red-100 text-red-700 hover:bg-red-200',
      tiktok: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      twitter: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      facebook: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    };
    return colors[platform as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-primary-100 text-black rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {(createSuccess || updateSuccess || deleteSuccess) && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <Check className="w-5 h-5" />
            {deleteSuccess ? 'Contact deleted successfully!' : 
             updateSuccess ? 'Contact updated successfully!' : 
             'Contact created successfully!'}
          </div>
        )}

        {getLoading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : contacts.length === 0 && !isCreating ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Contact Information</h2>
              <p className="text-gray-600 mb-6">Add your business contact details to get started.</p>
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Add Contact Information
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar - Contact List */}
            {!isCreating && contacts.length > 1 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Contacts</h2>
                  <div className="space-y-2">
                    {contacts.map((contact) => (
                      <div
                        key={contact._id}
                        onClick={() => handleSelectContact(contact)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedContact?._id === contact._id
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {contact.email}
                            </p>
                            {contact.phone && (
                              <p className="text-sm text-gray-600 mt-1">{contact.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className={contacts.length > 1 && !isCreating ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isCreating ? 'New Contact' : isEditing ? 'Edit Contact' : 'Contact Details'}
                  </h2>
                  <div className="flex gap-2">
                    {!isEditing && !isCreating && selectedContact && (
                      <>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(selectedContact._id!)}
                          disabled={loading}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </>
                    )}
                    {(isEditing || isCreating) && (
                      <>
                        <button
                          onClick={handleCancel}
                          disabled={loading}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {loading ? 'Saving...' : isCreating ? 'Create' : 'Update'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Form/Display Content */}
                <div className="space-y-6">
                  {/* Primary Contact */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      Primary Contact
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        {isEditing || isCreating ? (
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="contact@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            {selectedContact?.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        {isEditing || isCreating ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+234 xxx xxx xxxx"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            {selectedContact?.phone || <span className="text-gray-400 italic">Not set</span>}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        {isEditing || isCreating ? (
                          <textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="123 Main Street, Lagos, Nigeria"
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                            <span className="flex-1">{selectedContact?.address || <span className="text-gray-400 italic">Not set</span>}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      Social Media & Messaging
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* WhatsApp */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-green-600" />
                          WhatsApp
                        </label>
                        {isEditing || isCreating ? (
                          <input
                            type="text"
                            value={formData.whatsapp}
                            onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                            placeholder="+234xxxxxxxxxx or link"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : selectedContact?.whatsapp ? (
                          <a
                            href={selectedContact.whatsapp.startsWith('http') ? selectedContact.whatsapp : `https://wa.me/${selectedContact.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getSocialColor('whatsapp')} transition-colors`}
                          >
                            {getSocialIcon('whatsapp')}
                            <span className="font-medium">Open WhatsApp</span>
                          </a>
                        ) : (
                          <p className="text-gray-400 italic">Not set</p>
                        )}
                      </div>

                      {/* Instagram */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Instagram className="w-4 h-4 text-pink-600" />
                          Instagram
                        </label>
                        {isEditing || isCreating ? (
                          <input
                            type="text"
                            value={formData.instagram}
                            onChange={(e) => handleInputChange('instagram', e.target.value)}
                            placeholder="@username or full URL"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : selectedContact?.instagram ? (
                          <a
                            href={selectedContact.instagram.startsWith('http') ? selectedContact.instagram : `https://instagram.com/${selectedContact.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getSocialColor('instagram')} transition-colors`}
                          >
                            {getSocialIcon('instagram')}
                            <span className="font-medium">Visit Instagram</span>
                          </a>
                        ) : (
                          <p className="text-gray-400 italic">Not set</p>
                        )}
                      </div>

                      {/* YouTube */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Youtube className="w-4 h-4 text-red-600" />
                          YouTube
                        </label>
                        {isEditing || isCreating ? (
                          <input
                            type="text"
                            value={formData.youtube}
                            onChange={(e) => handleInputChange('youtube', e.target.value)}
                            placeholder="Channel URL"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : selectedContact?.youtube ? (
                          <a
                            href={selectedContact.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getSocialColor('youtube')} transition-colors`}
                          >
                            {getSocialIcon('youtube')}
                            <span className="font-medium">Visit YouTube</span>
                          </a>
                        ) : (
                          <p className="text-gray-400 italic">Not set</p>
                        )}
                      </div>

                      {/* TikTok */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Music className="w-4 h-4 text-gray-700" />
                          TikTok
                        </label>
                        {isEditing || isCreating ? (
                          <input
                            type="text"
                            value={formData.tiktok}
                            onChange={(e) => handleInputChange('tiktok', e.target.value)}
                            placeholder="@username or profile URL"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : selectedContact?.tiktok ? (
                          <a
                            href={selectedContact.tiktok.startsWith('http') ? selectedContact.tiktok : `https://tiktok.com/@${selectedContact.tiktok.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getSocialColor('tiktok')} transition-colors`}
                          >
                            {getSocialIcon('tiktok')}
                            <span className="font-medium">Visit TikTok</span>
                          </a>
                        ) : (
                          <p className="text-gray-400 italic">Not set</p>
                        )}
                      </div>

                      {/* Twitter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Twitter className="w-4 h-4 text-blue-400" />
                          Twitter/X
                        </label>
                        {isEditing || isCreating ? (
                          <input
                            type="text"
                            value={formData.twitter}
                            onChange={(e) => handleInputChange('twitter', e.target.value)}
                            placeholder="@username or profile URL"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : selectedContact?.twitter ? (
                          <a
                            href={selectedContact.twitter.startsWith('http') ? selectedContact.twitter : `https://twitter.com/${selectedContact.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getSocialColor('twitter')} transition-colors`}
                          >
                            {getSocialIcon('twitter')}
                            <span className="font-medium">Visit Twitter</span>
                          </a>
                        ) : (
                          <p className="text-gray-400 italic">Not set</p>
                        )}
                      </div>

                      {/* Facebook */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Facebook className="w-4 h-4 text-blue-600" />
                          Facebook
                        </label>
                        {isEditing || isCreating ? (
                          <input
                            type="text"
                            value={formData.facebook}
                            onChange={(e) => handleInputChange('facebook', e.target.value)}
                            placeholder="Page URL"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : selectedContact?.facebook ? (
                          <a
                            href={selectedContact.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getSocialColor('facebook')} transition-colors`}
                          >
                            {getSocialIcon('facebook')}
                            <span className="font-medium">Visit Facebook</span>
                          </a>
                        ) : (
                          <p className="text-gray-400 italic">Not set</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  {selectedContact && !isCreating && (
                    <div className="pt-6 border-t border-gray-200">
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Created: {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString() : 'N/A'}</p>
                        <p>Last Updated: {selectedContact.updatedAt ? new Date(selectedContact.updatedAt).toLocaleString() : 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;