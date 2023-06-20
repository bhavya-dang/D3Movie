import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChartModal from "./ChartModal";

function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(0) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(0) + "k";
  } else {
    return number.toString();
  }
}

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
        setPosterSrc(response);
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
        `http://www.omdbapi.com/?apikey=${
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
          // console.log("arr: ", arr);
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
        `http://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_APP_OMDB
        }&i=${id}&plot=full`
      );

      setMovie(movie.data);
      // getMovieTMDBPoster(movie.data.imdbID);
      // console.log("current movie data: ", movie.data);
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

  // getMovieTMDBPoster("tt12263384").then((res) => console.log(res));
  return (
    <>
      <div className="movie-container font-inter mt-[5.6%]">
        {movie && posterSrc && (
          <div className="backdrop-container relative card w-full bg-base-200 opacity-90 shadow-xl">
            {/* <figure>
              <img src={backdropSrc} alt={movie.Title} />
            </figure> */}
            <div
              className="card-body [&:not(:first-child)]:mt-[3%] flex flex-row gap-[20px]"
              key={movie.imdbID}
            >
              <a href={posterSrc}>
                <img
                  className="poster w-[400px] h-auto object-center"
                  src={posterSrc}
                  alt={movie.Title}
                />
              </a>
              {/* <div className="w-[500px] h-[500px] bg-gray-200 overflow-hidden">
            <a href={posterSrc}>
              <img
                className="poster w-full h-full object-cover object-center"
                src={posterSrc}
                alt={movie.Title}
              />
            </a>
          </div> */}
              {/* <div className="poster-wrapper relative w-full overflow-hidden pb-[150%]">
            <img
              className="poster absolute w-full h-full object-cover left-0 top-0"
              src={posterSrc}
              alt={movie.Title}
            />
          </div> */}
              {theme === "halloween" ? (
                <div className="details grow font-inter">
                  <h2 className="title text-white text-[18px] font-bold">
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
                  <p className="plot text-white text-[16px] mt-3">
                    {movie.Plot}
                  </p>

                  {movie.imdbRating !== "N/A" ? (
                    <p className="rating text-white mt-10">
                      <span className="font-semibold">
                        IMDb Rating: &#9733;
                      </span>
                      <span className="score">{movie.imdbRating}</span>
                      <span className="outOf text-[16px] text-white">/10 </span>
                      <span className="ml-1">
                        (
                        {formatNumber(
                          parseInt(movie.imdbVotes.replace(/,/g, ""))
                        )}
                        )
                      </span>
                    </p>
                  ) : (
                    <p className="rating text-white mt-10">
                      <span className="font-semibold">IMDb Rating:</span>
                      <span className="score ml-1">No Rating</span>
                      {/* <span className="outOf text-[16px] text-white">/10 </span>
                  <span className="ml-1">
                    (
                    {formatNumber(
                      parseInt(movie.imdbVotes.replace(/,/g, ""))
                    )}
                    )
                  </span> */}
                    </p>
                  )}

                  <p className="box-office text-white mt-1">
                    <span className="font-semibold">Box Office Revenue:</span>
                    <span className="box-office-revenue ml-1">
                      {movie.BoxOffice}
                    </span>
                  </p>

                  <p className="genre-list mt-4">
                    {movie.Genre.split(",").map((genre) => (
                      <span
                        className="genre [&:not(:first-child)]:ml-[10px] text-[15px] bg-[#96431a] px-[9px] py-[6px] rounded-full text-white"
                        key={genre}
                      >
                        {genre}
                      </span>
                    ))}
                  </p>

                  {/* <button className="btn bg-halloween-orange text-white font-inter glass normal-case mt-[30%]">
                  Compare All
                </button> */}
                  <ChartModal movie={movie} similarIMDB={similarIMDB} />
                </div>
              ) : (
                <div className="details grow font-inter">
                  <h2 className="title text-[#0f0f0f] text-[18px] font-bold">
                    {movie.Title}
                  </h2>
                  <p className="minorDetails mt-[5px] text-[13px] text-[#0f0f0f ]">
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
                  <p className="plot text-[#0f0f0f] text-[16px] mt-3">
                    {movie.Plot}
                  </p>

                  {movie.imdbRating !== "N/A" && (
                    <p className="rating text-[#0f0f0f] mt-10">
                      <span className="font-semibold">
                        IMDb Rating: &#9733;
                      </span>
                      <span className="score">{movie.imdbRating}</span>
                      <span className="outOf text-[16px] text-[#0f0f0f]">
                        /10{" "}
                      </span>
                      <span className="ml-1">
                        (
                        {formatNumber(
                          parseInt(movie.imdbVotes.replace(/,/g, ""))
                        )}
                        )
                      </span>
                    </p>
                  )}

                  <p className="box-office text-[#0f0f0f] mt-1">
                    <span className="font-semibold">Box Office:</span>
                    <span className="box-office-revenue ml-1">
                      {movie.BoxOffice}
                    </span>
                  </p>

                  <p className="genre-list mt-4">
                    {movie.Genre.split(",").map((genre) => (
                      <span
                        className="genre [&:not(:first-child)]:ml-[10px] text-[15px] bg-[#96431a] px-[9px] py-[6px] rounded-full text-white"
                        key={genre}
                      >
                        {genre}
                      </span>
                    ))}
                  </p>

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
          <h2 className="text-white text-2xl font-bold mt-[5.6%]">
            <i className="text-red-600 fa-solid fa-fire-flame-curved"></i> More
            like this
          </h2>
          <div className="container grid grid-cols-5 gap-8 mt-[2%] mb-10">
            {similarMovies.map((movie) => (
              <div
                className="card hover:scale-105 transition-all hover:cursor-pointer"
                key={movie.id}
                onClick={() => handleCardClick(movie.id)}
              >
                <div className="poster-wrapper rounded-md transition-all ease-in-out duration-200 relative w-full overflow-hidden pb-[150%]">
                  <img
                    className="poster absolute w-full h-full object-cover left-0 top-0"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>

                <div className="details">
                  <h2 className="title font-inter text-gray-300 text-[15px] mt-2 font-semibold">
                    {movie.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : movie && theme !== "halloween" ? (
        <div className="similar-movies font-inter">
          <h2 className="text-[#0f0f0f] text-2xl font-bold mt-[5.6%]">
            <i className="text-red-600 fa-solid fa-fire-flame-curved"></i> More
            like this
          </h2>
          <div className="container grid grid-cols-5 gap-8 mt-[2%] mb-10">
            {similarMovies.map((movie) => (
              <div
                className="card hover:scale-105 transition-all hover:cursor-pointer"
                key={movie.id}
                onClick={() => handleCardClick(movie.id)}
              >
                <div className="poster-wrapper rounded-md transition-all ease-in-out duration-200 relative w-full overflow-hidden pb-[150%]">
                  <img
                    className="poster absolute w-full h-full object-cover left-0 top-0"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>

                <div className="details">
                  <h2 className="title text-gray-600 text-[15px] mt-2 font-semibold">
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
