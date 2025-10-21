import instance from '../axios';

export interface UploadedMedia {
  _id: string;
  url: string;
  resource_type: 'image' | 'video';
}

export const uploadMedia = async (files: FileList | File[]) => {
  const formData = new FormData();
  Array.from(files).forEach(file => formData.append('files', file));

  const res = await instance.post<UploadedMedia[]>('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};
