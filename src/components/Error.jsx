import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  const homeBtn = () => {
    navigate("/");
  };
  return (
    <>
      <div className="flex h-screen w-full justify-center items-center">
        <div className="container flex flex-col items-center">
          <img
            className="w-5/12 h-5/12 -mt-[10%] items-center"
            src="/assets/404_new.svg"
            alt=""
          />

          <button
            onClick={homeBtn}
            className="btn btn-primary font-inter normal-case"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </>
  );
}

export default Error;
