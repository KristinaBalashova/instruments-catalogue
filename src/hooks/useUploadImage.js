import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const useUploadImage = (image, folderName) => {
  const [signedUrl, setSignedUrl] = useState(null);
  const [errorUpload, setErrorUpload] = useState(null);
  const [statusUpload, setStatusUpload] = useState(null);

  useEffect(() => {
    const uploadImage = async () => {
      if (!image || !folderName) return;

      try {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${folderName}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(folderName)
          .upload(filePath, image, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        const { data: signedURLData, error: signedURLError } = await supabase.storage
          .from(folderName)
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
  }, [image, folderName]);

  return { signedUrl, statusUpload, errorUpload };
};

export default useUploadImage;
