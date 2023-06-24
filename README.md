# D3Movie

A simple movie app that uses D3.js to visualize movie data.

## Tech Stack

- React.js
- TailwindCSS and Daisy UI
- D3.js

## Todo

- [x] Add error handlers, 404 page and toast message
- [x] Add theme switcher
- [ ] Finish responsive design
- [x] Finish styling for light theme
- [ ] Extract all the utility functions in one file
- [x] Add bar chart for box office revenue
- [x] Add trending page with pagination

## Documentation

The OMDB API only provides

```json
{
  "Title": "Spider-Man",
  "Year": "2002",
  "imdbID": "tt0145487",
  "Type": "movie",
  "Poster": "https://m.media-amazon.com/images/M/MV5BZDEyN2NhMjgtMjdhNi00MmNlLWE5YTgtZGE4MzNjMTRlMGEwXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_SX300.jpg"
}
```

this much data when you search using a query. This is the reason why, I had to use the two API calls to get my movie data.
Firstly, I did an API call to the search endpoint and got the imdbIDs of all the results. Then, I did another API call to the id endpoint for each of the imdbIDs to get the rest of the data.
