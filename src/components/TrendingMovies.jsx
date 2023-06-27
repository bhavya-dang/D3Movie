import { useState, useEffect } from "react";
import axios from "axios";
import TrendingCard from "./TrendingCard";
import { Link } from "react-router-dom";

function TrendingMovies({ theme }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getTrendingMovies();
  }, []);
  // for trending movies: use tmdb api
  async function getTrendingMovies() {
    try {
      const data = await axios.get(
        "https://api.themoviedb.org/3/trending/movie/week?language=en-US",
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZGEwNzVlYjM1Yzc1ZGY0NTk0NWRkYzQ1NTc2YzJjOSIsInN1YiI6IjY0N2NkOWM0ZTMyM2YzMDBhN2Q2NDAxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FN9e6gATlxF_zdmkJRXQ_jK6LRlw_FhWPEKUNmvRqmE",
          },
        }
      );
      const movies = data.data.results;
      setData(movies.slice(0, 10));
      console.log(movies.slice(0, 10));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      {data.length > 0 && (
        <div className="container mb-10">
          {theme === "halloween" ? (
            <div className="flex justify-between">
              <h1 className="mt-[6%] font-inter text-3xl font-bold text-gray-200">
                <i className="fa-solid fa-fire-flame-curved text-red-600"></i>{" "}
                Trending Movies
              </h1>
              <h1
                id="more-btn"
                className="mt-[6%] font-inter text-xl text-gray-200 hover:text-white"
              >
                <Link to="/trending">
                  More <i className="fa-solid fa-arrow-right ml-1"></i>
                </Link>
              </h1>
            </div>
          ) : (
            <div className="flex justify-between">
              <h1 className="mt-[6%] font-inter text-3xl font-bold text-gray-900">
                <i className="fa-solid fa-fire-flame-curved text-red-600"></i>{" "}
                Trending Movies
              </h1>
              <h1
                id="more-btn"
                className="mt-[6%] font-inter text-xl text-gray-800 hover:text-black"
              >
                <Link to="/trending">
                  More <i className="fa-solid fa-arrow-right ml-1"></i>
                </Link>
              </h1>
            </div>
          )}
          {theme === "halloween" ? (
            <hr className="mb-5 mt-2.5 w-full opacity-30" />
          ) : (
            <hr className="mb-5 mt-2.5 w-full bg-black" />
          )}
          <TrendingCard data={data} theme={theme} />
        </div>
      )}
    </>
  );
}

export default TrendingMovies;
