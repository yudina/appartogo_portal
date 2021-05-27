import React from "react";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import ListingPhoto from "./ListingPhoto";
import { Badge } from "reactstrap";
import moment from "moment";

const sortCaret = (order) => {
  return <FontAwesomeIcon icon={faSort} className="fa-fw text-muted" />;
};

export function createColumnDefinitions() {
  return [
    {
      dataField: "photo",
      text: "Photo",
      formatter: (cell, row) => <ListingPhoto listingId={row.listingId} />,
    },
    {
      dataField: "civicNumber",
      text: "Address",
      sort: true,
      sortCaret,
      formatter: (cell, row) => (
        <span>
          {cell} {row.streetName}
        </span>
      ),
    },
    {
      dataField: "rent",
      text: "Rent",
      sort: true,
      sortCaret,
      formatter: (cell) => <span>{_.isNumber(cell) && cell.toFixed(2)} $</span>,
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret,
      formatter: (cell) => {
        const color = (statusColor) => {
          const map = {
            Accepted: "success",
            Pending: "secondary",
            Rejected: "info",
          };
          return map[statusColor];
        };

        return <Badge color={color(cell)}>{cell}</Badge>;
      },
    },

    {
      dataField: "",
      text: "Submitted on",
      sortCaret,
      formatter: (cell, row) => moment(row.applicationDate).format("DD-MMM-YYYY"),
      // <Link onClick={(e) => e.stopPropagation()} to="/chat">
      //   <FontAwesomeIcon icon={faEnvelope} className="fa-fw fa-lg text-muted" />
      // </Link>
    },

    {
      dataField: "",
      text: "View Ad",
      formatter: () => (
        <a onClick={(e) => e.stopPropagation()} href="https://appartogo.com/">
          View Ad
        </a>
      ),
    },
  ];
}

export function createColumnDefinitionsFr() {
  return [
    {
      dataField: "photo",
      text: "Photo",
      formatter: (cell, row) => <ListingPhoto listingId={row.listingId} />,
    },
    {
      dataField: "civicNumber",
      text: "Adresse",
      sort: true,
      sortCaret,
      formatter: (cell, row) => (
        <span>
          {cell} {row.streetName}
        </span>
      ),
    },
    {
      dataField: "rent",
      text: "Loyer",
      sort: true,
      sortCaret,
      formatter: (cell) => <span>{_.isNumber(cell) && cell.toFixed(2)} $</span>,
    },
    {
      dataField: "status",
      text: "Statut",
      sort: true,
      sortCaret,
      formatter: (cell) => {
        const color = (statusColor) => {
          const map = {
            Accepté: "success",
            "En attente": "secondary",
            Rejeté: "info",
          };
          return map[statusColor];
        };

        return <Badge color={color(cell)}>{cell}</Badge>;
      },
    },

    {
      dataField: "",
      text: "Date d'envoie",
      sortCaret,
      formatter: (cell, row) => moment(row.applicationDate).format("DD-MMM-YYYY"),
      // <Link onClick={(e) => e.stopPropagation()} to="/chat">
      //   <FontAwesomeIcon icon={faEnvelope} className="fa-fw fa-lg text-muted" />
      // </Link>
    },

    {
      dataField: "",
      text: "Voir annonce",
      formatter: () => (
        <a onClick={(e) => e.stopPropagation()} href="https://appartogo.com/">
          Voir annonce
        </a>
      ),
    },
  ];
}
