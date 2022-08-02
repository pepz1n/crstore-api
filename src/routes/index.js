import usersRoute from "./usersRoute";
import categoryRoute from "./categoryRoute";
import productRoute from "./productRoute";
import paymentRoute from "./paymentRoute";
import cupomRoute from "./cupomRoute";
import adressRoute from "./adressRoute";
import orderRoute from "./orderRoute";

function Routes(app) {
  usersRoute(app);
  cupomRoute(app);
  productRoute(app)
  categoryRoute(app);
  paymentRoute(app);
  adressRoute(app);
  orderRoute(app);
}

export default Routes;