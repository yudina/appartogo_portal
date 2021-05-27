import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Loader } from "../Loader/Loader";
import Application from "./Application";
import Axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Translate } from "react-translated";

export default function Apply(props) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [haventAppliedYet, setHaventAppliedYet] = useState(true);

  const [listingTitle, setListingTitle] = useState("");
  const [listingId, setListingId] = useState("");
  const [ownerAccountId, setOwnerAccountId] = useState("");

  const fetchListingData = async () => {
    // ***** RANDOMLY GET A LISTING FROM DB ********************************************************
    // *********************************************************************************************
    // *********************************************************************************************
    const firstResponse = await Axios.get(`/Listing/`).catch(function (error) {
      console.log(error);
    });

    if (firstResponse && firstResponse.data) {
      const randomIndex = Math.floor(Math.random() * firstResponse.data.length);
      if (firstResponse.data[randomIndex] && firstResponse.data[randomIndex].id) {
        // Check if user already applied to this Listing

        const applicationsListResponse = await Axios.get(
          `/Application/byaccountid/${props.auth.getAccountId()}`
        );
        if (applicationsListResponse && applicationsListResponse.status === 200) {
          if (applicationsListResponse.data && applicationsListResponse.data.length > 0) {
            if (
              applicationsListResponse.data.some(
                (application) => application.listingId === firstResponse.data[randomIndex].id
              )
            ) {
              setHaventAppliedYet(false);
              setLoading(false);
            } else {
              setHaventAppliedYet(true);
            }
          } else {
            setHaventAppliedYet(true);
          }
        } else {
          setError(true);
          setLoading(false);
        }

        // Proceed only if we know if user has applied or not
        if (!error && haventAppliedYet) {
          // fetch listing title
          const secondResponse = await Axios.get(
            `/Listing/${firstResponse.data[randomIndex].id}`
          ).catch(function (error) {
            console.log(error);
          });

          if (secondResponse && secondResponse.data) {
            setListingTitle(secondResponse.data.titre);
            setListingId(secondResponse.data.id);

            const urlToGetApartment = `/Apartment/${secondResponse.data.apartmentId}`;
            const thirdResponse = await Axios.get(urlToGetApartment).catch(function (error) {
              console.log(error);
            });

            if (thirdResponse && thirdResponse.data) {
              const urlToGetProperty = `/Property/${thirdResponse.data.propertyId}`;
              const fourthResponse = await Axios.get(urlToGetProperty).catch(function (error) {
                console.log(error);
              });

              if (fourthResponse && fourthResponse.data) {
                const urlToGetOrganization = `/Organization/${fourthResponse.data.organizationId}`;
                const fifthResponse = await Axios.get(urlToGetOrganization).catch(function (error) {
                  console.log(error);
                });

                if (fifthResponse && fifthResponse.data) {
                  const urlToGetAccountArray = `/OrganizationAccount/byorganizationid/${fifthResponse.data.id}`;
                  const sixthResponse = await Axios.get(urlToGetAccountArray).catch(function (
                    error
                  ) {
                    console.log(error);
                  });
                  if (sixthResponse && sixthResponse.data.length > 0) {
                    setOwnerAccountId(sixthResponse.data[0].accountId);
                    setLoading(false);
                  } else {
                    setLoading(false);
                    setError(true);
                  }
                } else {
                  setLoading(false);
                  setError(true);
                }
              } else {
                setLoading(false);
                setError(true);
              }
            } else {
              setLoading(false);
              setError(true);
            }
          } else {
            setLoading(false);
            setError(true);
          }
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
    const getListing = async () => {
      await fetchListingData();
    };
    getListing();
  }, []);

  return (
    <div>
      <div className="col-12 border-bottom">
        <h3>
          <Translate text="Apply"></Translate>
        </h3>
        {loading && <Loader />}
      </div>
      {!haventAppliedYet && (
        <Container>
          <Row>
            <Col xl={12} className="mt-3 d-flex justify-content-center">
              <span>
                <Translate text="Sorry you have already applied to this listing."></Translate>
              </span>
            </Col>
          </Row>

          <Row>
            <Col xl={12} className="mt-3 d-flex justify-content-center">
              <Link to="/applications-history" className="text-primary">
                <Translate text="View your applications history "></Translate>
                <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </Col>
          </Row>
        </Container>
      )}
      {!error && haventAppliedYet && (
        <Application
          {...props}
          listingTitle={listingTitle}
          listingId={listingId}
          ownerAccountId={ownerAccountId}
        ></Application>
      )}

      {error && <span>An error has occured.</span>}
    </div>
  );
}
