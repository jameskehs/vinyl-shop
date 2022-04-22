const seedUsers = [
  {
    email: "jamesekehs@gmail.com",
    password: "password",
    firstName: "James",
    lastName: "Kehs",
    address: "11000 Buddy Ellis Road",
    city: "Denham Springs",
    state: "LA",
    zip: "70726",
  },
];

const seedVinyls = [
  {
    name: "Dawn FM",
    artist: "The Weeknd",
    price: 59.99,
    image_url: "./Images/Albums/DawnFM/DawnFMCover.png",
  },
  {
    name: "After Hours",
    artist: "The Weeknd",
    price: 59.99,
    image_url: "./Images/Albums/AfterHours/AfterHoursCover.png",
  },
  {
    name: "Alone at Prom",
    artist: "Tory Lanez",
    price: 45.99,
    image_url: "./Images/Albums/AloneAtProm/AloneAtPromCover.png",
  },
  {
    name: "Harry's House",
    artist: "Harry Styles",
    price: 39.99,
    image_url: "./Images/Albums/HarrysHouse/HarrysHouseCover.png",
  },
  {
    name: "TV",
    artist: "Tai Verdes",
    price: 59.99,
    image_url: "./Images/Albums/TV/TVCover.png",
  },
];

module.exports = { seedVinyls, seedUsers };
