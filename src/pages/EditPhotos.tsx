import Navbar from "../components/Navbar";
import PhotoUploader from "../components/PhotoUploader";
import "../index.css";

const EditPhotos = () => {
  return (
    <div className="">
      <Navbar />

      <h1 className="text-2xl font-bold">Edytuj zdjęcia</h1>
      <p className="mt-4">Tutaj możesz edytować swoje zdjęcia.</p>

      <PhotoUploader maxFiles={5} onChange={console.log} />

      <div className="mt-6">
        <button className="btn btn-primary">Zapisz zmiany</button>
      </div>
    </div>
  );
};

export default EditPhotos;
