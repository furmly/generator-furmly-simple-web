import React from "react";
import Client from "./client";
const client = new Client("");
class Menu extends React.Component {
  state = {
    menu: []
  };
  async componentDidMount() {
    let menu = await client.getMenu("DEMO");
    const categories = {};
    menu = menu.reduce((sum, x) => {
      if (typeof categories[x.group] == "undefined") {
        sum.push({ name: x.group, items: [], key: x.group });
        categories[x.group] = sum.length - 1;
      }
      sum[categories[x.group]].items.push(x);
      return sum;
    }, []);

    this.setState({ menu });
  }
  open(x) {
    this.props.openProcess(x);
  }
  render() {
    const { menu } = this.state;
    return (
      <header>
        {menu.map(x => (
          <div className="menu-group" key={x.key}>
            <p className="title">{x.name}</p>
            <ul className="menu-items">
              {x.items.map(v => (
                <li
                  onClick={() => this.open(v)}
                  className="menu-item"
                  key={v._id}
                >
                  {v.displayLabel}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </header>
    );
  }
}
export default Menu;
