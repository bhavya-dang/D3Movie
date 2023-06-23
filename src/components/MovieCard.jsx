import { useNavigate } from "react-router-dom";

function MovieCard({ data, theme, searchTerm, query }) {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="container mt-[5.6%] mb-[5%]">
      <h1 className="ml-1 font-inter text-3xl">
        Search &quot;{searchTerm || query}&quot;
      </h1>
      {data.length > 0 ? (
        data
          .filter((i) => i.Type === "movie" && i.Poster !== "N/A")
          .map((movie) => (
            <div
              className="card rounded p-5 [&:not(:first-child)]:mt-[1%] flex flex-row gap-[20px] hover:cursor-pointer w-full bg-base-200 opacity-80 shadow-xl"
              key={movie.imdbID}
              onClick={() => handleCardClick(movie.imdbID)}
            >
              <img
                className="poster w-[100px] h-auto"
                src={movie.Poster}
                alt={movie.Title}
              />
              <div className="details grow mt-6">
                {theme === "halloween" ? (
                  <>
                    {/* <h2 className="title text-white text-[18px] font-bold">
                      {movie.Title}
                    </h2>

                    <p className="minorDetails mt-[5px] text-[13px] text-[#cecaca]">
                      <span>
                        {movie.Year !== "N/A" ? movie.Year : "Not Yet Released"}
                      </span>{" "}
                      &bull;{" "}
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
                    </p> */}

                    <h2 className="title text-[#cecaca] text-[18px] font-bold">
                      {movie.Title}
                    </h2>
                    <p className="minorDetails mt-[5px] text-[13px] text-[#cecaca]">
                      <span>
                        {movie.Year !== "N/A" ? movie.Year : "Not Yet Released"}
                      </span>{" "}
                      &bull;{" "}
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
                    <p className="cast-list mt-2">{movie.Actors}</p>
                    <p className="hidden plot text-[#cecaca] text-[16px] mt-3">
                      {movie.Plot}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="title text-[#0f0f0f] text-[18px] font-bold">
                      {movie.Title}
                    </h2>
                    <p className="minorDetails mt-[5px] text-[13px] text-[#0f0f0f]">
                      <span>
                        {movie.Year !== "N/A" ? movie.Year : "Not Yet Released"}
                      </span>{" "}
                      &bull;{" "}
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
                    <p className="cast-list mt-2">{movie.Actors}</p>
                    <p className="hidden plot text-[#0f0f0f] text-[16px] mt-3">
                      {movie.Plot}
                    </p>
                  </>
                )}

                {/* {movie.imdbRating !== "N/A" && theme === "halloween" ? (
                  <p className="rating text-white mt-10">
                    IMDb Rating: &#9733;
                    <span className="score font-bold">{movie.imdbRating}</span>
                    <span className="outOf text-[16px] text-white">/10</span>
                    <span className="ml-1">
                      {" "}
                      (
                      {formatNumber(
                        parseInt(movie.imdbVotes.replace(/,/g, ""))
                      )}
                      )
                    </span>
                  </p>
                ) : movie.imdbRating !== "N/A" && theme !== "halloween" ? (
                  <p className="rating text-[#0f0f0f] mt-10">
                    IMDb Rating: &#9733;
                    <span className="score font-bold">{movie.imdbRating}</span>
                    <span className="outOf text-[16px] text-[#0f0f0f]">
                      /10
                    </span>
                    <span className="ml-1">
                      {" "}
                      (
                      {formatNumber(
                        parseInt(movie.imdbVotes.replace(/,/g, ""))
                      )}
                      )
                    </span>
                  </p>
                ) : (
                  () => {
                    return null;
                  }
                )} */}
                {/* <p className="genre-list mt-4">
                  {movie.Genre.split(",").map((genre) => (
                    <span
                      className="genre [&:not(:first-child)]:ml-[10px] text-[15px] bg-[#d97a0d] px-[9px] py-[6px] rounded-full text-white font-inter"
                      key={genre}
                    >
                      {genre}
                    </span>
                  ))}
                </p> */}
              </div>
            </div>
          ))
      ) : (
        <div className="card rounded mt-3 p-5 flex flex-row gap-[20px] w-full bg-base-200 opacity-90 shadow-xl">
          <h1>No results found for {searchTerm || query}</h1>
        </div>
      )}
    </div>
  );
}

export default MovieCard;
