import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../helpers/supabaseClient';

const useUploadImage = (image, storageBucket) => {
  const [signedUrl, setSignedUrl] = useState(null);
  const [isSubmitable, setIsSubmitable] = useState(true);

  useEffect(() => {
    const uploadImage = async () => {
      if (!image || !storageBucket) return;

      setIsSubmitable(false);
      try {
        const options = {
          maxSizeMB: 0.08,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(image, options);

        const fileExt = compressedFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from(storageBucket)
          .upload(filePath, compressedFile, { upsert: true });

        if (uploadError) {
          alert(uploadError.message);
          setIsSubmitable(false);
          throw uploadError;
        }

        const { data: signedURLData, error: signedURLError } = await supabase.storage
          .from(storageBucket)
          .createSignedUrl(filePath, 60 * 60 * 24 * 365);

        if (signedURLError) {
          throw signedURLError;
        }

        setSignedUrl(signedURLData.signedUrl);
        setIsSubmitable(true);
      } catch (error) {
        setIsSubmitable(false);
      }
    };

    uploadImage();
  }, [image, storageBucket]);

  return { signedUrl, isSubmitable };
};

export default useUploadImage;
