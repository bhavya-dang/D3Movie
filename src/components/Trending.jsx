import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Trending({ theme, loading }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(0); // Total number of pages;

  useEffect(() => {
    getTrendingMovies(page);
  }, [page]);

  const getImdbID = async (tmdbID) => {
    const data = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbID}/external_ids`,
      {
        headers: {
          accept: "application/json",
          Authorization: `${import.meta.env.VITE_APP_TMDB}`,
        },
      }
    );
    // console.log("id data: ", data);
    return data.data;
  };
  // for trending movies: use tmdb api
  async function getTrendingMovies(page) {
    try {
      const data = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=${page}`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZGEwNzVlYjM1Yzc1ZGY0NTk0NWRkYzQ1NTc2YzJjOSIsInN1YiI6IjY0N2NkOWM0ZTMyM2YzMDBhN2Q2NDAxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FN9e6gATlxF_zdmkJRXQ_jK6LRlw_FhWPEKUNmvRqmE",
          },
        }
      );
      const movies = data.data.results;
      const totalPages = data.data.total_pages;
      setData(movies);
      setTotalPages(totalPages);
      console.log(movies.slice(0, 10));
    } catch (error) {
      console.log(error.message);
    }
  }
  const navigate = useNavigate();

  const handleCardClick = async (id) => {
    const { imdb_id } = await getImdbID(id);
    navigate(`/movie/${imdb_id}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (!loading) {
    return (
      <>
        <div className="container mb-[5%] mt-[5.6%]">
          {data.map((movie) => (
            <>
              <div
                className="card flex w-full flex-row gap-[20px] rounded bg-base-200 p-5 opacity-80 shadow-xl hover:cursor-pointer [&:not(:first-child)]:mt-[1%]"
                key={movie.id}
                onClick={() => handleCardClick(movie.id)}
              >
                <img
                  className="poster h-auto w-[100px]"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="details mt-6 grow">
                  {theme === "halloween" ? (
                    <>
                      <h2 className="title text-[18px] font-bold text-[#cecaca]">
                        {movie.title}
                      </h2>
                      <p className="minorDetails mt-[5px] text-[12.5px] text-[#cecaca]">
                        <span>
                          {movie.release_date !== null
                            ? movie.release_date.slice(0, 4)
                            : "Not Yet Released"}
                        </span>{" "}
                      </p>
                      {movie.vote_average !== null ? (
                        <p className="rating mt-2 text-slate-100">
                          <span className="flex justify-between font-semibold">
                            IMDb Rating:{" "}
                            <svg
                              className="ml-1 mt-1 h-4 w-4 fill-current text-halloween-orange"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 576 512"
                            >
                              <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                            </svg>
                          </span>
                          <span className="score ml-[0.22rem]">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </p>
                      ) : (
                        <p className="rating mt-10 text-white">
                          <span className="font-semibold">IMDb Rating:</span>
                          <span className="score ml-1">No Rating</span>
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <h2 className="title text-[18px] font-bold text-black-gray">
                        {movie.title}
                      </h2>
                      <p className="minorDetails mt-[5px] text-[12.5px] text-black-gray">
                        <span>
                          {movie.release_date !== null
                            ? movie.release_date.slice(0, 4)
                            : "Not Yet Released"}
                        </span>{" "}
                      </p>
                      {movie.vote_average !== null ? (
                        <p className="rating mt-2 text-gray-900">
                          <span className="flex justify-between font-semibold">
                            IMDb Rating:{" "}
                            <svg
                              className="ml-1 mt-1 h-4 w-4 fill-current text-halloween-orange"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 576 512"
                            >
                              <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                            </svg>
                          </span>
                          <span className="score ml-[0.22rem]">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </p>
                      ) : (
                        <p className="rating mt-10 text-white">
                          <span className="font-semibold">IMDb Rating:</span>
                          <span className="score ml-1">No Rating</span>
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          ))}
        </div>
        {data && (
          <div className="flex justify-between gap-3">
            <div className="join mb-3 flex items-center justify-center">
              {Array.from(
                { length: totalPages >= 10 ? 10 : totalPages },
                (_, index) => (
                  <input
                    key={index}
                    className="btn-square join-item btn"
                    type="radio"
                    name="options"
                    aria-label={index + 1}
                    checked={page === index + 1}
                    onChange={() => handlePageChange(index + 1)}
                  />
                )
              )}
            </div>
            <button
              className="btn-primary btn-circle"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        )}
      </>
    );
  }
}

export default Trending;
