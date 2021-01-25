import React, { Component } from "react";
import { Switch } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import routers from "@/routers/index.js";
import renderRoutes from "@/utils/renderRoutes";

const authPath = "/login"; // 默认未登录的时候返回的页面，可以自行设置
// 
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authed: false,
    };
  } 
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Switch>{renderRoutes(routers, this.props.authed, authPath)}</Switch>
        </header>
      </div>
    );
  }
  componentDidMount() {
    console.log(this.props);
    // this.props.match.url.indexOf("index")
    
    // if (this.props.toLogin) {
    //   this.props.history.push("/login");
    // } else {
    //   this.props.history.push("/index");
    // }
  }
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps, null, null, {
  forwardRef: true,
})(withRouter(App));
