let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

let app = express();
let PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

/* Exercise 1: Get All Restaurants

Objective: Fetch all restaurants from the database.

Query Parameters: None

Tasks: Implement a function to fetch all restaurants.

Example Call:

http://localhost:3000/restaurants */

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants ';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'no restorant found' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.messgae });
  }
});

/*  Exercise 2: Get Restaurant by ID

Objective: Fetch a specific restaurant by its ID.

Query Parameters:

id (integer)

Tasks: Implement a function to fetch a restaurant by its ID.

Example Call:

http://localhost:3000/restaurants/details/1 */

async function fetchRestaurantsById(id, []) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, id);
  return { restaurants: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let results = await fetchRestaurantsById(id, []);
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*  Exercise 3: Get Restaurants by Cuisine

Objective: Fetch restaurants based on their cuisine.

Query Parameters:

cuisine (string)

Tasks: Implement a function to fetch restaurants by cuisine.

Example Call:

http://localhost:3000/restaurants/cuisine/Indian */

// async function fetchByCuisine(cuisine) {
//   let query = 'SELECT * FROM restaurants WHERE cuisine = ? ';
//   let response = await db.all(query, [cuisine]);
//   return { restauratns: response };
// }

// app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
//   try {
//     let cuisine = req.params.cuisine;
//     let results = await fetchByCuisine(cuisine);
//     if (results.restaurants.length === 0) {
//       return res.status(404).json({ message: 'no restaurant found' });
//     }
//     return res.status(200).json(results);
//   } catch (error) {
//     res.status(500).json({ error: error.messgae });
//   }
// });

async function fetchRestaurantByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine=?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let results = await fetchRestaurantByCuisine(cuisine);
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    return res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*  Exercise 4: Get Restaurants by Filter

Objective: Fetch restaurants based on filters such as veg/non-veg, outdoor seating, luxury, etc.

Query Parameters:

isVeg (string)

hasOutdoorSeating (string)

isLuxury (string)

Tasks: Implement a function to fetch restaurants by these filters.

Example Call:

http://localhost:3000/restaurants/filter?isVeg=true&hasOutdoorSeating=true&isLuxury=false */

// const filterRestaurants = (filters) => {
//   return restaurants.filter((restaurant) => {
//     const isVegMatch = filters.isVeg
//       ? restaurant.isVeg === filters.isVeg
//       : true;
//     const hasOutdoorSeatingMatch = filters.hasOutdoorSeating
//       ? restaurant.hasOutdoorSeating === filters.hasOutdoorSeating
//       : true;
//     const isLuxuryMatch = filters.isLuxury
//       ? restaurant.isLuxury === filters.isLuxury
//       : true;

//     return isVegMatch && hasOutdoorSeatingMatch && isLuxuryMatch;
//   });
// };

// app.get('/restaurants/filter', (req, res) => {
//   const filters = {
//     isVeg: req.query.isVeg,
//     hasOutdoorSeating: req.query.hasOutdoorSeating,
//     isLuxury: req.query.isLuxury,
//   };

//   const filteredRestaurants = filterRestaurants(filters);

//   if (filteredRestaurants.length > 0) {
//     return res.status(200).json(filteredRestaurants);
//   } else {
//     return res
//       .status(404)
//       .json({ message: 'No restaurants found matching the filters.' });
//   }
// });

async function filterByAmenaties(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let results = await filterByAmenaties(isVeg, hasOutdoorSeating, isLuxury);
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'no restaurant found' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*  Exercise 5: Get Restaurants Sorted by Rating

Objective: Fetch restaurants sorted by their rating ( highest to lowest ).

Query Parameters: None

Tasks: Implement a function to fetch restaurants sorted by rating.

Example Call:

http://localhost:3000/restaurants/sort-by-rating  */

async function sortByRatings() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC ';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await sortByRatings();
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'restaurant not able to sort the data' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*  Exercise 6: Get All Dishes

Objective: Fetch all dishes from the database.

Query Parameters: None

Tasks: Implement a function to fetch all dishes.

Example Call:

http://localhost:3000/dishes  */

async function FetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let results = await FetchAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.mesage });
  }
});

/*  Exercise 7: Get Dish by ID

Objective: Fetch a specific dish by its ID.

Query Parameters:

id (integer)

Tasks: Implement a function to fetch a dish by its ID.

Example Call:

http://localhost:3000/dishes/details/1 */

// async function fetchById(id) {
//   let query = 'SELECT * FROM dishes WHERE id = ?';
//   let response = await db.all(query,[id]);
//   return { dish: response };
// }

// app.get('/dishes/details/:dish', async (req, res) => {
//   let id = req.params.id;
//   try {
//     let results = await fetchById(id);
//     if (results.dishes.length === 0) {
//       return res.status(404).json({ message: 'No Dish found for this Id' });
//     }
//     return res.status(200).json(results);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

async function fetchById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]); // Pass id as an array
  return { dish: response }; // Return the dish
}

app.get('/dishes/details/:dish', async (req, res) => {
  let id = req.params.dish; // Access the correct parameter
  try {
    let results = await fetchById(id);
    if (results.dish.length === 0) {
      // Check results.dish instead of results.dishes
      return res.status(404).json({ message: 'No Dish found for this Id' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*  Exercise 8: Get Dishes by Filter

Objective: Fetch dishes based on filters such as veg/non-veg.

Query Parameters:

isVeg (boolean)

Tasks: Implement a function to fetch dishes by these filters.

Example Call:

http://localhost:3000/dishes/filter?isVeg=true */

async function filterByDish(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ? ';
  let response = await db.all(query, [isVeg]);
  return { dish: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let results = await filterByDish(isVeg);
    if (results.dish.length === 0) {
      return res
        .status(404)
        .json({ message: 'Dish not found for this category' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Exercise 9: Get Dishes Sorted by Price

Objective: Fetch dishes sorted by their price ( lowest to highest ).

Query Parameters: None

Tasks: Implement a function to fetch dishes sorted by price.

Example Call:

http://localhost:3000/dishes/sort-by-price  */

async function SortedByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price ';
  let response = await db.all(query, []);
  return { dish: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await SortedByPrice();
    if (results.dish.length === 0) {
      return res.status(404).json({ message: 'Dish not found for thsi proce' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log('server runniong on port 3000'));
