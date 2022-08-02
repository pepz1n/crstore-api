import usersRoute from "./usersRoute";
import categoryRoute from "./categoryRoute";
import productRoute from "./productRoute";
import paymentRoute from "./paymentRoute";

function Routes(app) {
	usersRoute(app);
	productRoute(app)
	categoryRoute(app);
  paymentRoute(app);
}

export default Routes;