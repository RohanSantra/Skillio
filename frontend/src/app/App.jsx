import { RouterProvider } from "react-router-dom";

import router from "./routes.jsx";
import Providers from "./providers.jsx";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
      <Toaster
        position="top-right"
        richColors
        closeButton
      />
    </>
  );
};

export default App;