import api from '../utils/request';

// Upload ảnh
export const APIUploadImage = async (file) => {
  const formData = new FormData();
  formData.append('anh', file); // field name phải khớp với multer.single('anh')

  const res = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Upload video
export const APIUploadVideo = async (file) => {
  const formData = new FormData();
  formData.append('video', file); // field name phải khớp với multer.single('video')

  const res = await api.post('/upload/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
