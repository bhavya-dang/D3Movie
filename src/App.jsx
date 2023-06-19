import { useState, useEffect } from "react";
import axios from "axios";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import TrendingMovies from "./components/TrendingMovies";
import Movie from "./components/Movie";
import { Routes, Route, useSearchParams } from "react-router-dom";

function App() {
  const [data, setData] = useState([]);
  const [theme, setTheme] = useState("halloween");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState({});
  const [imdbId, setIMDBId] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  // console.log(query);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    await getID(term);
    await imdbId.map((id) => getData(id));
  };

  useEffect(() => {
    if (
      document.querySelector(".html").getAttribute("data-theme") === "halloween"
    ) {
      setTheme("halloween");
    } else {
      setTheme("bumblebee");
    }
  }, [theme]);

  useEffect(() => {
    if (query) {
      console.log(query);
      handleSearch(query);
    }
  }, [query]);

  useEffect(() => {
    if (searchTerm) {
      const fetchData = async () => {
        setLoading(true); // Show loading spinner
        const promises = imdbId.map((id) => getData(id));
        try {
          const responses = await Promise.all(promises); // wait for all promises to resolve
          const arr = responses.map((response) => response.data);
          setData(arr);
          // console.log("arr: ", arr);
        } catch (error) {
          console.log(error.message);
        } finally {
          setLoading(false); // Hide loading spinner
        }
      };
      fetchData();
    }
  }, [imdbId, searchTerm]);

  async function getID(term) {
    try {
      const movie = await axios.get(
        `http://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_APP_OMDB
        }&s=${term}`
      );
      // console.log("movie: ", movie.data.Search);
      const searchResults = movie.data.Search;
      const imdbIds = searchResults.slice(0, 10).map((movie) => movie.imdbID);
      setIMDBId(imdbIds);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getData(id) {
    //caching mechanism
    if (cache[id]) {
      return cache[id];
    }

    try {
      const movie = await axios.get(
        `http://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_APP_OMDB
        }&i=${id}&plot=full&type=movie`
      );

      // Store fetched data in cache
      setCache((prevCache) => ({
        ...prevCache,
        [id]: movie,
      }));
      console.log("movie: ", movie.data);
      return movie;
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <>
      <div className="container flex justify-between mt-5">
        {theme === "halloween" ? (
          // <h1 className="font-inter font-semibold text-[3em] leading-[1.1] text-white flex-1">
          //   <a href="/">D3Movie</a>
          // </h1>
          <a href="/">
            <img
              className="w-16 h-16"
              src="../src/assets/icon-white.svg"
              alt=""
            />
          </a>
        ) : (
          // <h1 className="font-inter font-semibold text-[3em] leading-[1.1] text-black flex-1">
          //   <a href="/">D3Movie</a>
          // </h1>
          <a href="/">
            <img
              className="w-16 h-16"
              src="../src/assets/icon-black.svg"
              alt=""
            />
          </a>
        )}

        <Search className="mt-5" onSearch={handleSearch} loading={loading} />
      </div>

      <Routes>
        <Route
          path="/search"
          element={<MovieCard data={data} theme={theme} />}
        />
      </Routes>

      <Routes>
        <Route path="/" element={<TrendingMovies theme={theme} />} />
      </Routes>
      <Routes>
        <Route path="/movie/:id" element={<Movie theme={theme} />} />
      </Routes>
    </>
  );
}

export default App;
