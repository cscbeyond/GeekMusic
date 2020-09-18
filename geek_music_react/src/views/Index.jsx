import React, { Component } from "react";
import Main from "./Main/Main";
import Header from "./Header/Header";

class Index extends Component {
  render() {
    return (
      <div className="index">
        <Header></Header>
        <Main ref="main"></Main>
      </div>
    );
  }
}
export default Index;
