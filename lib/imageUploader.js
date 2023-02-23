import imageCompression from "browser-image-compression";
import { firebaseStorage } from "./firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const imageUploader = async ({ image, imageName, onUploaded, onError }) => {
  // compress image
  const imageCompressOption = {
    maxSizeMB: 0.25,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressImage = await imageCompression(image, imageCompressOption);
    // upload image
    const metadata = {
      contentType: "image/jpeg",
    };
    const storageRef = ref(firebaseStorage, imageName);
    const uploadTask = uploadBytesResumable(
      storageRef,
      compressImage,
      metadata
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");

        switch (snapshot.state) {
          case "paused":
            // console.log("Upload is paused");
            break;
          case "running":
            // console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          if (onUploaded) {
            onUploaded(downloadURL);
          }
        });
      }
    );
  } catch (error) {
    console.log("image is not uploaded", error);
    if (onError) {
      onError(error);
    }
  }
};

export default imageUploader;
