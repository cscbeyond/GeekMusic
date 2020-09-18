import React, { Component } from "react";
import UserCenter from "./UserCenter";
import httpRequest from "@/utils/HttpRequest";
import myAlert from "@/utils/MyAlert";
import { connect } from "react-redux";
import "@/assets/css/header.less";
import logo from "@/assets/imgs/lizhi.png";
import { withRouter } from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <div className="header">
        <div
          className="logo-container"
          onClick={() => this.props.history.push("/player/index")}
        >
          <span>我愛</span> <img src={logo} alt="" /> <span>南京</span>
        </div>
        <div className="search-container">
          <input type="text" id="search-val" className="search-input" />
          <button
            placeholder="请输入专辑名或歌名"
            className="search-btn"
            onClick={this.searchHandler.bind(this)}
          >
            <i className="iconfont icon-search">搜索</i>
          </button>
        </div>
        <UserCenter></UserCenter>
      </div>
    );
  }
  // 搜索
  searchHandler() {
    let searchVal = document.querySelector("#search-val").value;
    if (!searchVal) {
      myAlert.show("请输入关键字", 2500);
      return;
    }
    this.props.history.push("/player/index");
    let config = {
      data: { keyWords: searchVal },
      method: "post",
      url: "/songs/searchByKeyWords.music",
    };
    httpRequest(config)
      .then((res) => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          if (!data.songsList.length) {
            myAlert.show("Sorry，曲库还未录入您所搜索的歌曲😢", 2500);
          }
          this.props.setSearchResult(data.songsList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSearchResult(list) {
      const action = {
        type: "searchList",
        searchList: list,
      };
      dispatch(action);
    },

  };
};

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(withRouter(Header));
