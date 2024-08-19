import { useState, useEffect } from 'react';
import { supabase } from '../helpers/supabaseClient';

const useUploadImage = (image, storageBucket) => {
  const [signedUrl, setSignedUrl] = useState(null);
  const [errorUpload, setErrorUpload] = useState(false);

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
      } catch (error) {
        setErrorUpload(error.message);
      }
    };

    uploadImage();
  }, [image, storageBucket]);

  return { signedUrl, errorUpload };
};

export default useUploadImage;
