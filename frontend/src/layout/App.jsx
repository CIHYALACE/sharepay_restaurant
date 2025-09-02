import "../style/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Routes, Route } from "react-router-dom";
import SharedLayout from "../sharedLayout/SharedLayout";
import HomePage from "../pages/homePage";
import Checkout from "../pages/Checkout";
import OrderDetails from "../pages/OrderDetails";
import { CartProvider } from "../components/cartContext";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<HomePage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderDetails />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
