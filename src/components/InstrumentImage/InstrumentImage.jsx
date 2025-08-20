import ImageDownloader from "./components/ImageDownloader/ImageDownloader";
import styles from "./InstrumentImage.module.css";

function InstrumentImage({ isEditable, imageFile, editableItem, setImageFile }) {
  return isEditable ? (
    <ImageDownloader setFile={setImageFile} image={editableItem?.image} />
  ) : (
    <img
      src={imageFile ? URL.createObjectURL(imageFile) : editableItem?.image}
      alt={editableItem?.name}
      className={styles.image}
    />
  );
}

export default InstrumentImage;