// import Movie from "./Movie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TrendingCard({ data, theme }) {
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

  return (
    <>
      <div className="container grid grid-cols-5 gap-8 mt-[2%]">
        {data.map((movie) => (
          <div
            className="card hover:scale-105 transition-all hover:cursor-pointer"
            key={movie.id}
            onClick={() => handleCardClick(movie.id)}
          >
            <div className="rounded-md shadow-md hover:shadow-xl transition-all ease-in-out duration-200 poster-wrapper relative w-full overflow-hidden pb-[150%]">
              <img
                className="poster absolute w-full h-full object-cover left-0 top-0"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            </div>

            <div className="details">
              {theme === "halloween" ? (
                <h2 className="title text-gray-300 text-[15px] mt-2 font-semibold">
                  {movie.title}
                </h2>
              ) : (
                <h2 className="title text-gray-900 text-[15px] mt-2 font-semibold">
                  {movie.title}
                </h2>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TrendingCard;
