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

  // useEffect(() => {
  //   if (
  //     document.querySelector(".html").getAttribute("data-theme") === "halloween"
  //   ) {
  //     setTheme("halloween");
  //   } else {
  //     setTheme("bumblebee");
  //   }
  // }, [theme]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
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
        {/* <button
          className="btn btn-circle btn-lg"
          onClick={() => {
            setTheme(theme === "halloween" ? "bumblebee" : "halloween");
            document
              .querySelector(".html")
              .setAttribute(
                "data-theme",
                theme === "halloween" ? "bumblebee" : "halloween"
              );
          }}
        ></button> */}

        <div className="flex justify-end">
          <label className="swap swap-rotate ml-5 order-3">
            {/* this hidden checkbox controls the state */}
            <input
              type="checkbox"
              onClick={() => {
                setTheme(theme === "halloween" ? "bumblebee" : "halloween");
                document
                  .querySelector(".html")
                  .setAttribute(
                    "data-theme",
                    theme === "halloween" ? "bumblebee" : "halloween"
                  );
              }}
            />

            {/* sun icon */}
            <svg
              className="swap-on fill-current w-11 h-11"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-off fill-current w-11 h-11"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>

          <Search className="mt-5" onSearch={handleSearch} loading={loading} />
        </div>
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
