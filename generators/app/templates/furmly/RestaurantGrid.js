import React from "react";
import "./restaurant.scss";
class RestaurantGrid extends React.Component {
  toggle = x => {
    this.props.valueChanged(x.name);
    const elem = document.getElementsByClassName("wrapper");
    elem[0].scrollTo(0, elem[0].scrollHeight);
  };
  render() {
    return (
      <div className="rs-grid">
        {this.props.items.map(x => (
          <div
            className={`tile ${(x.name == this.props.value && "selected") ||
              ""}`}
            key={x.name}
            onClick={() => this.toggle(x)}
          >
            <div
              style={{ backgroundImage: `url(${x.logo})` }}
              className="background"
            />
            <h1 className={"tile-title"}>
              {x.name}
              <small className={"tile-subtitle"}>{x.address}</small>
            </h1>
          </div>
        ))}
      </div>
    );
  }
}
const KEY = "RESTAURANT_GRID";
export default (map, defaultMap) => {
  const recipe = map.getRecipe(map.constants.SELECT);
  recipe[recipe.length - 1] = RestaurantGrid;
  map.addRecipe(KEY, recipe, map.SELECT);
};
