import { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line react/prop-types
function Search({ onSearch, loading }) {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
    const url = `/search?query=${encodeURIComponent(searchTerm)}`;

    document.querySelector("#searchInput").value = searchTerm;
    navigate(url);
  };

  return (
    <form className="mt-2.5" onSubmit={handleSubmit}>
      <input
        id="searchInput"
        // className="box-border text-left text-[grey] mx-0 my-2 px-5 py-[7px] border-none font-inter font-regular text-md"
        className="input input-bordered input-primary rounded-full mr-1 font-inter"
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for a movie..."
      />

      {loading ? (
        <button
          className="btn btn-disabled btn-primary btn-circle ml-2 rounded-full normal-case font-inter"
          type="submit"
          id="btn"
        >
          <span className="loading loading-spinner"></span>
        </button>
      ) : (
        <button
          className="btn btn-primary btn-circle ml-2 rounded-full normal-case font-inter"
          type="submit"
          id="btn"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      )}
    </form>
  );
}

export default Search;
