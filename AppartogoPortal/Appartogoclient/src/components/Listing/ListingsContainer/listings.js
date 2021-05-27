const listings = [
  {
    id: 1,
    apartmentId: 1,
    apartment: {
      id: 1,
      apartmentNumber: "24",
      tenantId: 1,
      propertyId: 1,
      apartmentType: 'Normal',
      rooms: 10,
      bathrooms: 1,
      size: '5 1/2',
      hasWater: true,
      hasHeater: true,
      hasParking: true,
      hasFurniture: false,
      hasAirconditioner: false,
      hasCable: false,
      hasInternet: false,
      availibityDate: '8 Dec 2020'
    },
    titre: 'Condo d exception',
    description: 'Condo neuf DT MTL: Concordia, McGill, gare CN, Ste Catherine Ville-Marie',
    rent: 1250.50,
    imageUrls: '',
    postedDateTime: '1 Dec 2020',
    archived: false
  }
  ,
  {
    id: 2,
    apartmentId:2,
    apartment: {
      id: 2,
      apartmentNumber: "69",
      tenantId: 2,
      propertyId: 2,
      apartmentType: 'Condo',
      rooms: 20,
      bathrooms: 2,
      size: '3 1/2',
      hasWater: true,
      hasHeater: false,
      hasParking: true,
      hasFurniture: false,
      hasAirconditioner: true,
      hasCable: true,
      hasInternet: false,
      availibityDate: '13 Jul 2020'
    },
    titre: 'Mont-Royal Deluxe',
    description: 'Grand 7 1/2 au cœur du Plateau Mont-Royal',
    rent: 1950,
    imageUrls: '',
    postedDateTime: '1 Oct 2020',
    archived: true
  }
];

export default listings;