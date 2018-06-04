import * as React from "react";
import * as ReactDOM from "react-dom";
import { combineStores, observable, inject, observe } from "dob";
import { Connect } from "../src";

@observable
class Store {
  name = 123;
}

class Action {
  @inject(Store) store!: Store;

  changeName = () => {
    this.store.name = 456;
  };
}

const stores = combineStores({ Store, Action });

@Connect(stores)
class App extends React.Component<typeof stores, any> {
  render() {
    return (
      <div onClick={this.props.Action!.changeName}>
        {this.props.Store!.name}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-dom"));
