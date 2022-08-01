import usersRoute from "./usersRoute";
import categoryRoute from "./categoryRoute";
import productRoute from "./productRoute";

function Routes(app) {
	usersRoute(app);
	productRoute(app)
	categoryRoute(app);
}

export default Routes;