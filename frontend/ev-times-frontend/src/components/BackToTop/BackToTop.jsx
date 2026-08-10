import { useEffect, useState } from "react";
import "./BackToTop.css";

const BackToTop = () => {

  const [show, setShow] =
    useState(false);

  useEffect(() => {

    const handleScroll = () => {

      if (window.scrollY > 400) {
        setShow(true);
      } else {
        setShow(false);
      }

    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  const scrollToTop = () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };

  return (
    <>
      {show && (
        <button
          className="back-to-top"
          onClick={scrollToTop}
        >
          ⬆
        </button>
      )}
    </>
  );
};

export default BackToTop;