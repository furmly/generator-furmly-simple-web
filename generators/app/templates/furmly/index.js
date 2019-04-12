import { setup } from "furmly-base-web";
import router from "furmly-react-router-web-addons";
import restaurantGrid from "./RestaurantGrid";

const config = {
  homeUrl: "/",
  providerConfig: []
};

const extend = (map, defaultMap) => {
  // Add all custom controls
  restaurantGrid(map);
  // Add react router addon.
  router(map, config);
  const c = map.cook();
  return c;
};

const controls = setup({ ...config, extend });

export default controls;
