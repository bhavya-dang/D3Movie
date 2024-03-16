import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChartModal from "./ChartModal";
import Error from "./Error";
import formatNumber from "../functions";

function Movie({ theme }) {
  const { id } = useParams();

  // console.log("id params: ", id);
  const [movie, setMovie] = useState("");
  const [posterSrc, setPosterSrc] = useState("");
  // const [backdropSrc, setBackdropSrc] = useState("");
  const [similarMovies, setSimilarMovies] = useState([]);
  const [tmdbID, setTMDBID] = useState("");
  const [similarIMDB, setSimilarIMDB] = useState([]);

  useEffect(() => {
    getMovie(id);
    getTmdbId(id);
    // console.log(movie.imdbID);
    getSimilarMovies(tmdbID);
    const fetchPosterSrc = async () => {
      try {
        const response = await getMovieTMDBPoster(id);
        if (response !== undefined) {
          setPosterSrc(response);
        } else {
          setPosterSrc(
            "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg"
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // const fetchBackdropSrc = async () => {
    //   try {
    //     const response = await getMovieTMDBBackdrop(id);
    //     setBackdropSrc(response);
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // };
    fetchPosterSrc();
    // fetchBackdropSrc();
  }, [id, tmdbID]);

  useEffect(() => {
    const getSimilarMoviesIMDB = async (id) => {
      const { imdb_id } = await getImdbID(id);
      // console.log("imdb id: ", imdb_id);
      const data = await axios.get(
        `https://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_APP_OMDB
        }&i=${imdb_id}&plot=full`
      );
      return data.data;

      // console.log("similar movies: ", data);
    };

    if (similarMovies.length > 0 && movie) {
      const fetchSimilarIMDB = async () => {
        const promises = similarMovies.map((movie) =>
          getSimilarMoviesIMDB(movie.id)
        );
        try {
          const responses = await Promise.all(promises);
          const arr = responses.map((response) => response);
          setSimilarIMDB(arr);
          console.log("arr: ", arr);
        } catch (error) {
          console.log(error.message);
        }
      };

      fetchSimilarIMDB();
    }
  }, [similarMovies, movie]); // Include similarMovies and movie as dependencies

  const navigate = useNavigate();

  const handleCardClick = async (id) => {
    const { imdb_id } = await getImdbID(id);
    navigate(`/movie/${imdb_id}`); // navigate to the movie/id page
  };

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

  async function getMovie(id) {
    try {
      const movie = await axios.get(
        `https://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_APP_OMDB
        }&i=${id}&plot=full`
      );

      setMovie(movie.data);
      // getMovieTMDBPoster(movie.data.imdbID);
      console.log("current movie data: ", movie.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getMovieTMDBPoster(imdbId) {
    try {
      const data = await axios.get(
        `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`,
        {
          headers: {
            accept: "application/json",
            Authorization: `${import.meta.env.VITE_APP_TMDB}`,
          },
        }
      );
      // console.log("tmdb data: ", data);
      const posterPath = `https://image.tmdb.org/t/p/w500${data.data.movie_results[0].poster_path}`;
      // data.data.map((movie) => console.log(movie.poster_path));
      // console.log("poster path: ", posterPath);
      return posterPath;
    } catch (error) {
      console.log(error.message);
    }
  }

  // async function getMovieTMDBBackdrop(imdbId) {
  //   try {
  //     const data = await axios.get(
  //       `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`,
  //       {
  //         headers: {
  //           accept: "application/json",
  //           Authorization: `${import.meta.env.VITE_APP_TMDB}`,
  //         },
  //       }
  //     );
  //     // console.log("tmdb data: ", data);
  //     const backdropPath = `https://image.tmdb.org/t/p/w500${data.data.movie_results[0].backdrop_path}`;
  //     // data.data.map((movie) => console.log(movie.poster_path));
  //     // console.log("poster path: ", backdropPath);
  //     return backdropPath;
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  async function getTmdbId(imdbId) {
    try {
      const data = await axios.get(
        `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`,
        {
          headers: {
            accept: "application/json",
            Authorization: `${import.meta.env.VITE_APP_TMDB}`,
          },
        }
      );
      // console.log("tmdb ID data: ", data.data.movie_results[0].id);
      const tmdbID = data.data.movie_results[0].id;
      setTMDBID(tmdbID);
      return tmdbID;
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getSimilarMovies(id) {
    try {
      const data = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization: `${import.meta.env.VITE_APP_TMDB}`,
          },
        }
      );

      const similarMovies = data.data.results;
      // console.log("Similar: ", similarMovies.slice(0, 5));
      setSimilarMovies(similarMovies.slice(0, 5));
    } catch (error) {
      console.log(error.message);
    }
  }

  // Regular expression to match IMDb ID format (e.g., tt10366206)
  const imdbIdRegex = /^tt\d{6,8}$/;

  // Check if the id matches the IMDb ID format
  const isValidImdbId = imdbIdRegex.test(id);

  // Redirect to a not-found page if the id format is invalid
  if (!isValidImdbId) {
    return <Error theme={theme} />;
  }

  if (!movie && !similarMovies) {
    return <Error theme={theme} />;
  }

  return (
    <>
      <div className="movie-container mt-[5.6%] font-inter">
        {movie && posterSrc && (
          <div className="backdrop-container card relative w-full bg-base-200 opacity-90 shadow-xl">
            {/* <figure>
              <img src={backdropSrc} alt={movie.Title} />
            </figure> */}
            <div
              className="card-body flex flex-row gap-[20px] [&:not(:first-child)]:mt-[3%]"
              key={movie.imdbID}
            >
              <a href={posterSrc}>
                <img
                  className="poster h-auto w-[400px] object-center"
                  src={posterSrc}
                  alt={movie.Title}
                />
              </a>

              {theme === "halloween" ? (
                <div className="details grow font-inter">
                  <h2 className="title text-[18px] font-bold text-white">
                    {movie.Title}
                  </h2>
                  <p className="minorDetails mt-[5px] text-[13px] text-[#cecaca]">
                    <span>{movie.Year ?? "Not Yet Released"} </span> &bull;{" "}
                    <span>
                      {movie.Rated !== "N/A" ? movie.Rated : "Not Yet Rated"}
                    </span>{" "}
                    &bull;{" "}
                    <span>
                      {movie.Runtime !== "N/A"
                        ? movie.Runtime
                        : "Not Yet Released"}
                    </span>
                  </p>
                  <p className="plot mt-3 text-[16px] text-white">
                    {movie.Plot}
                  </p>

                  {movie.imdbRating !== "N/A" ? (
                    <p className="rating mt-10 text-white">
                      <span className="flex justify-between font-semibold">
                        {/* IMDb Rating: &#9733; */}
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
                        {movie.imdbRating}
                      </span>
                      {/* <span className="outOf text-[16px] text-white">/10 </span> */}
                      <span className="ml-1">
                        (
                        {formatNumber(
                          parseInt(movie.imdbVotes.replace(/,/g, ""))
                        )}
                        )
                      </span>
                    </p>
                  ) : (
                    <p className="rating mt-10 text-white">
                      <span className="font-semibold">IMDb Rating:</span>
                      <span className="score ml-1">No Rating</span>
                    </p>
                  )}

                  <p className="box-office mt-1 text-white">
                    <span className="font-semibold">Box Office Revenue:</span>
                    <span className="box-office-revenue ml-1">
                      {movie.BoxOffice}
                    </span>
                  </p>

                  <p className="genre-list mt-4">
                    {movie.Genre.split(",").map((genre) => (
                      <span
                        className="genre rounded-full bg-[#96431a] px-[9px] py-[6px] text-[15px] text-white [&:not(:first-child)]:ml-[10px]"
                        key={genre}
                      >
                        {genre}
                      </span>
                    ))}
                  </p>

                  {/* <ChartModal movie={movie} similarIMDB={similarIMDB} /> */}
                  <ChartModal
                    movie={movie}
                    similarIMDB={similarIMDB}
                    theme={theme}
                  />
                </div>
              ) : (
                <div className="details grow font-inter">
                  <h2 className="title font-inter text-[18px] font-bold text-black">
                    {movie.Title}
                  </h2>
                  <p className="minorDetails mt-[5px] text-[13px] text-black-gray">
                    <span>{movie.Year ?? "Not Yet Released"} </span> &bull;{" "}
                    <span>
                      {movie.Rated !== "N/A" ? movie.Rated : "Not Yet Rated"}
                    </span>{" "}
                    &bull;{" "}
                    <span>
                      {movie.Runtime !== "N/A"
                        ? movie.Runtime
                        : "Not Yet Released"}
                    </span>
                  </p>
                  <p className="plot mt-3 text-[16px] text-black">
                    {movie.Plot}
                  </p>

                  {movie.imdbRating !== "N/A" ? (
                    <p className="rating mt-10 text-black">
                      <span className="flex justify-between font-semibold">
                        {/* IMDb Rating: &#9733; */}
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
                        {movie.imdbRating}
                      </span>
                      {/* <span className="outOf text-[16px] text-white">/10 </span> */}
                      <span className="ml-1">
                        (
                        {formatNumber(
                          parseInt(movie.imdbVotes.replace(/,/g, ""))
                        )}
                        )
                      </span>
                    </p>
                  ) : (
                    <p className="rating mt-10 text-black">
                      <span className="font-semibold">IMDb Rating:</span>
                      <span className="score ml-1">No Rating</span>
                    </p>
                  )}

                  <p className="box-office mt-1 text-black">
                    <span className="font-semibold">Box Office Revenue:</span>
                    <span className="box-office-revenue ml-1">
                      {movie.BoxOffice}
                    </span>
                  </p>

                  <p className="genre-list mt-4">
                    {movie.Genre.split(",").map((genre) => (
                      <span
                        className="genre rounded-full bg-[#96431a] px-[9px] py-[6px] text-[15px] text-white [&:not(:first-child)]:ml-[10px]"
                        key={genre}
                      >
                        {genre}
                      </span>
                    ))}
                  </p>

                  {/* <ChartModal movie={movie} similarIMDB={similarIMDB} /> */}
                  <ChartModal
                    movie={movie}
                    similarIMDB={similarIMDB}
                    theme={theme}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {movie && theme === "halloween" ? (
        <div className="similar-movies font-inter">
          <h2 className="mt-[5.6%] text-2xl font-bold text-white">
            <i className="fa-solid fa-fire-flame-curved text-red-600"></i> More
            like this
          </h2>
          <div className="container mb-10 mt-[2%] grid grid-cols-5 gap-8">
            {similarMovies.map((movie) => (
              <div
                className="card transition-all hover:scale-105 hover:cursor-pointer"
                key={movie.id}
                onClick={() => handleCardClick(movie.id)}
              >
                <div className="poster-wrapper relative w-full overflow-hidden rounded-md pb-[150%] transition-all duration-200 ease-in-out">
                  <img
                    className="poster absolute left-0 top-0 h-full w-full object-cover"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>

                <div className="details">
                  <h2 className="title mt-2 font-inter text-[15px] font-semibold text-gray-300">
                    {movie.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : movie && theme !== "halloween" ? (
        <div className="similar-movies font-inter">
          <h2 className="mt-[5.6%] text-2xl font-bold text-[#0f0f0f]">
            <i className="fa-solid fa-fire-flame-curved text-red-600"></i> More
            like this
          </h2>
          <div className="container mb-10 mt-[2%] grid grid-cols-5 gap-8">
            {similarMovies.map((movie) => (
              <div
                className="card transition-all hover:scale-105 hover:cursor-pointer"
                key={movie.id}
                onClick={() => handleCardClick(movie.id)}
              >
                <div className="poster-wrapper relative w-full overflow-hidden rounded-md pb-[150%] transition-all duration-200 ease-in-out">
                  <img
                    className="poster absolute left-0 top-0 h-full w-full object-cover"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>

                <div className="details">
                  <h2 className="title mt-2 text-[15px] font-semibold text-gray-600">
                    {movie.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        () => {
          return null;
        }
      )}
    </>
  );
}

export default Movie;
