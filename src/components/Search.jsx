import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Search({ onSearch, loading, theme }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.length < 1) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return;
    } else {
      onSearch(searchTerm);
      const url = `/search?query=${encodeURIComponent(searchTerm)}`;

      document.querySelector("#searchInput").value = searchTerm;
      navigate(url);
    }
  };

  const handleToastClose = () => {
    setShowToast(false);
  };

  return (
    <>
      <form className="mt-2.5" onSubmit={handleSubmit}>
        <input
          id="searchInput"
          // className="box-border text-left text-[grey] mx-0 my-2 px-5 py-[7px] border-none font-inter font-regular text-md"
          className="input-bordered input-primary input mr-1 rounded-full font-inter"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search for a movie..."
        />

        {loading ? (
          <button
            className="btn-disabled btn-primary btn-circle btn ml-2 rounded-full font-inter normal-case"
            type="submit"
            id="btn"
          >
            <span className="loading loading-spinner"></span>
          </button>
        ) : (
          <button
            className="btn-primary btn-circle btn ml-2 rounded-full font-inter normal-case"
            type="submit"
            id="btn"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        )}
      </form>

      {showToast && (
        <div className="toast toast-top">
          <div className="alert alert-info bg-red-600 font-inter text-white">
            <span>Search field is empty</span>
            {theme === "halloween" ? (
              <span
                className="btn-circle btn border-none bg-red-700 hover:bg-red-800"
                onClick={handleToastClose}
              >
                <i className="fa-solid fa-xmark"></i>
              </span>
            ) : (
              <span
                className="btn-circle btn border-none bg-red-700 text-white hover:bg-red-800"
                onClick={handleToastClose}
              >
                <i className="fa-solid fa-xmark"></i>
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Search;
