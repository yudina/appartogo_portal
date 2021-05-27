import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Image } from "react-bootstrap";
import noimage from "../../../assets/listingPictures/no-image.png";
import { Loader } from "../../Loader/Loader";

export default function ListingPhoto(props) {
  const [error, setError] = useState(false);
  const [noPhoto, setNoPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [arrayOfImages, setArrayOfImages] = useState([]);

  const fetchPhotoList = async () => {
    if (props.listingId) {
      // fetch photos for this listing
      const firstResponse = await Axios.get(`/Attachment/bylistingid/${props.listingId}`).catch(
        function (error) {
          console.log(error);
        }
      );

      if (firstResponse && firstResponse.status === 200) {
        if (firstResponse.data && firstResponse.data.length > 0) {
          firstResponse.data.map((url, index) => {
            if (url && index === 0) {
              try {
                import(`../../../assets/listingPictures/${url.pathFile.split("\\").pop()}`)
                  .then((image) => {
                    setArrayOfImages((oldarray) => [...oldarray, image.default]);
                  })
                  .catch((err) => {
                    console.log(err);
                    setError(true);
                  });
              } catch {
                setError(true);
              }
            }
          });
          setLoading(false);
          setNoPhoto(false);
        } else {
          setLoading(false);
          setNoPhoto(true);
        }
      } else {
        setLoading(false);
        setError(true);
      }
    } else {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    const getPhoto = async () => {
      await fetchPhotoList();
    };
    getPhoto();
  }, []);

  return (
    <>
      {loading && <Loader />}
      {(noPhoto || error || !arrayOfImages) && (
        <Image style={{ width: "50px" }} src={noimage} rounded />
      )}
      {arrayOfImages &&
        arrayOfImages.map((image) => <Image style={{ width: "50px" }} src={image} rounded />)}
    </>
  );
}
