import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Props, State } from './layout.type';
import { PureComponent } from '../utils/pure-render'

import Page1 from '../pages/page1/index.component'

export default class Layout extends PureComponent<Props, State> {
  public static defaultProps = new Props();
  public state = new State();

  public render() {
    return (
      <Router>
        <div>
          <div>
            <Link to="/" >Page1</Link>
            <Link to="/page2" >page2</Link>
          </div>

          <Switch >
            <Route exact path="/" component={Page1} />
          </Switch>
        </div>
      </Router>
    );
  }
}