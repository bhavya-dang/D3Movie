import { useNavigate } from "react-router-dom";

function MovieCard({ data, theme, searchTerm, query, loading }) {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/movie/${id}`);
  };

  if (!loading && data.length !== 0) {
    return (
      <div className="container mb-[5%] mt-[5.6%]">
        <h1 className="ml-1 font-inter text-3xl">
          Search &quot;{searchTerm || query}&quot;
        </h1>
        {data
          .filter((i) => i.Type === "movie" && i.Poster !== "N/A")
          .map((movie) => (
            <div
              className="card flex w-full flex-row gap-[20px] rounded bg-base-200 p-5 opacity-80 shadow-xl hover:cursor-pointer [&:not(:first-child)]:mt-[1%]"
              key={movie.imdbID}
              onClick={() => handleCardClick(movie.imdbID)}
            >
              <img
                className="poster h-auto w-[100px]"
                src={movie.Poster}
                alt={movie.Title}
              />
              <div className="details mt-6 grow">
                {theme === "halloween" ? (
                  <>
                    <h2 className="title text-[18px] font-bold text-[#cecaca]">
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
                    {/* <p className="hidden plot text-[#cecaca] text-[16px] mt-3">
                        {movie.Plot}
                      </p> */}
                  </>
                ) : (
                  <>
                    <h2 className="title text-[18px] font-bold text-[#0f0f0f]">
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
                    {/* <p className="hidden plot text-[#0f0f0f] text-[16px] mt-3">
                        {movie.Plot}
                      </p> */}
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    );
  } else if (!loading && data.length === 0) {
    return (
      <>
        <h1 className="ml-1 mt-10 font-inter text-3xl">
          Search &quot;{searchTerm || query}&quot;
        </h1>
        <div className="card mt-3 flex w-full flex-row gap-[20px] rounded bg-base-200 p-5 opacity-90 shadow-xl">
          <h1>No results found for {searchTerm || query}</h1>
        </div>
      </>
    );
  }
}

export default MovieCard;
