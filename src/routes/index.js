import usersRoute from "./usersRoute";
import categoryRoute from "./categoryRoute";
import productRoute from "./productRoute";
import paymentRoute from "./paymentRoute";
import cupomRoute from "./cupomRoute";
import adressRoute from "./adressRoute";

function Routes(app) {
  usersRoute(app);
  cupomRoute(app);
  productRoute(app)
  categoryRoute(app);
  paymentRoute(app);
  adressRoute(app);
}

export default Routes;