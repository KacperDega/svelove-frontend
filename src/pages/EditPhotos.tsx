import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PhotoUploader from "../components/PhotoUploader";
import { apiRequest } from "../api/apiRequest";
import { emptyProfile } from "../types";
import ErrorPopup from "../components/ErrorPopup";

const EditPhotos = () => {
  const [photos, setPhotos] = useState<(File | string)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await apiRequest<{ photoUrls: string[] }>("/profile");
        setPhotos(profile.photoUrls || []);
      } catch (err) {
        console.error(err);
        setError("Nie udało się załadować zdjęć.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const formData = new FormData();

      photos.forEach((photo) => {
        if (typeof photo === "string") {
          formData.append("orderedPhotoUrls", photo);
        } else {
          formData.append("orderedPhotoUrls", "");
          formData.append("newPhotos", photo);
        }
      });

      const finalUrls = await apiRequest<string[]>("/profile/photos", {
        method: "PUT",
        body: formData,
      });

      setPhotos(finalUrls);
      navigate("/profile/edit/photos");
    } catch (err) {
      console.error(err);
      setError("Błąd podczas zapisywania zdjęć. Spróbuj ponownie.");
    } finally {
      setSaving(false);
    }
  };


  if (loading)
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <div className="flex justify-center items-center flex-grow">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );

  const displayPhotos = photos.length > 0 ? photos : emptyProfile.photoUrls;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="card bg-neutral shadow-xl mt-6 p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-primary">Edytuj zdjęcia</h1>

          <div className="carousel w-full rounded-lg overflow-hidden shadow-lg">
            {displayPhotos.map((url, index) => {
              const imageSrc =
                url instanceof File ? URL.createObjectURL(url) : url;

              return (
                <div
                  id={`slide${index}`}
                  key={index}
                  className="carousel-item relative w-full"
                >
                  <img
                    src={imageSrc}
                    className="w-full object-cover h-[300px] sm:h-[400px]"
                    alt={`Zdjęcie ${index + 1}`}
                  />
                  <div className="absolute flex justify-between transform -translate-y-1/2 left-4 right-4 top-1/2">
                    <a
                      href={`#slide${
                        (index - 1 + displayPhotos.length) %
                        displayPhotos.length
                      }`}
                      className="btn btn-circle btn-sm"
                    >
                      ❮
                    </a>
                    <a
                      href={`#slide${(index + 1) % displayPhotos.length}`}
                      className="btn btn-circle btn-sm"
                    >
                      ❯
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">
            <PhotoUploader maxFiles={5} value={photos} onChange={setPhotos} />
          </div>

          <div className="flex justify-between space-x-2 pt-2">
            <button
              className={`btn btn-secondary ${saving ? "opacity-65 cursor-not-allowed pointer-events-none" : ""}`}
              onClick={() => navigate("/profile/edit")}
            >
              Anuluj
            </button>
            <button
              className={`btn btn-primary ${saving ? "opacity-65 cursor-not-allowed pointer-events-none" : ""}`}
              onClick={handleSave}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  Zapisywanie...
                  <span className="loading loading-spinner loading-sm"></span>
                </span>
              ) : (
                "Zapisz zmiany"
              )}
            </button>
          </div>
        </div>
      </div>

      <ErrorPopup error={error} showError={showError} setShowError={setShowError}/>
    </div>
  );
};

export default EditPhotos;
