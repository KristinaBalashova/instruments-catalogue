import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const useUploadImage = (image, storageBucket) => {
  const [signedUrl, setSignedUrl] = useState(null);
  const [errorUpload, setErrorUpload] = useState(null);
  const [statusUpload, setStatusUpload] = useState(null);

  useEffect(() => {
    const uploadImage = async () => {
      if (!image || !storageBucket) return;

      try {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from(storageBucket)
          .upload(filePath, image, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        const { data: signedURLData, error: signedURLError } = await supabase.storage
          .from(storageBucket)
          .createSignedUrl(filePath, 60 * 60 * 24);

        if (signedURLError) {
          throw signedURLError;
        }

        setSignedUrl(signedURLData.signedUrl);
        setStatusUpload(true);
      } catch (error) {
        setErrorUpload(error.message);
        setStatusUpload(false);
      }
    };

    uploadImage();
  }, [image, storageBucket]);

  return { signedUrl, statusUpload, errorUpload };
};

export default useUploadImage;
