import { useState, useEffect } from "react";
import axios from "axios";
import TrendingCard from "./TrendingCard";

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
      // console.log(movies.slice(0, 10));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      {data.length > 0 && (
        <div className="container mb-10">
          {theme === "halloween" ? (
            <h1 className="mt-[6%] text-white font-bold text-3xl">
              <i className="text-red-600 fa-solid fa-fire-flame-curved"></i>{" "}
              Trending Movies
            </h1>
          ) : (
            <h1 className="mt-[6%] text-slate-900 font-bold text-3xl">
              {" "}
              <i className="text-red-600 fa-solid fa-fire-flame-curved"></i>{" "}
              Trending Movies
            </h1>
          )}
          {theme === "halloween" ? (
            <hr className="mt-2.5 mb-5 w-full opacity-30" />
          ) : (
            <hr className="mt-2.5 mb-5 w-full opacity-90 bg-slate-950" />
          )}
          <TrendingCard data={data} theme={theme} />
        </div>
      )}
    </>
  );
}

export default TrendingMovies;
