import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import Frame from "./pages/Frame";
import Frame1 from "./pages/Frame1";
import Frame2 from "./pages/Frame2";
import Frame3 from "./pages/Frame3";
import Frame4 from "./pages/Frame4";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "GOTONG";
        metaDescription = "";
        break;
      case "/1/:productId":
        title = "Product Details";
        metaDescription = "Details of the product";
        break;
      case "/2/:userId":
        title = "User Profile";
        metaDescription = "Details of the user profile";
        break;
      case "/3/:userId":
        title = "Another User Page";
        metaDescription = "Another page with user details";
        break;
      case "/4":
        title = "Page 4";
        metaDescription = "Details of page 4";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Frame />} />
      <Route path="/1/:productId" element={<Frame1 />} />
      <Route path="/2/:userId" element={<Frame2 />} />
      <Route path="/3/:userId" element={<Frame3 />} />
      <Route path="/4" element={<Frame4 />} />
    </Routes>
  );
}

export default App;
