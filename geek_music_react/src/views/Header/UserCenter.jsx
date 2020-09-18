import React, { Component } from "react";
import { connect } from "react-redux";
import "@/assets/css/userCenter.less";
import avatar from "@/assets/imgs/lizhi.png";
import { Link, withRouter } from "react-router-dom";
class UserCenter extends Component {
  render() {
    return (
      <div className="user-center">
        <p
          className={this.props.authed ? "hide" : "go-to-login"}
          onClick={this.toLogin.bind(this)}
        >
          登录
        </p>
        <div className={this.props.authed ? "info-container" : "hide"}>
          <span className="nick-name">{this.props.userInfo.nickName}</span>
          <img
            className="avatar"
            src={
              this.props.userInfo.avatar ? this.props.userInfo.avatar : avatar
            }
            alt="avatar"
          />
          <div className="user-info-options">
            <ul>
              <div className="line-box">
                <li>
                  <Link to="/player/index">
                    <i className="iconfont icon-yinle"></i>去听歌
                  </Link>
                </li>
                <li>
                  <i className="iconfont icon-xin1"></i>我的收藏
                </li>
                <li>
                  <i className="iconfont icon-icon_good"></i>我的赞
                </li>
                <li>
                  <i className="iconfont icon-pinglun"></i>我发出的评论
                </li>
              </div>
              <li>
                <i className="iconfont icon-bianji"></i>
                <Link to="/player/editUserInfo">修改个人信息</Link>
              </li>
              <li onClick={this.logout.bind(this)}>
                <i className="iconfont icon-tuichu_huaban1"></i>退出
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  toLogin() {
    this.props.goToLogin(true);
    this.props.history.push("/player/login");
  }

  logout() {
    this.props.history.push("/player/login");
    this.props.setAuthed(false);
  }
}

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    goToLogin(status) {
      const action = {
        type: "goToLogin",
        toLogin: status,
      };
      dispatch(action);
    },
    sendCurSongInfo(songInfo) {
      const action = {
        type: "curSongInfo",
        curSongInfo: songInfo,
      };
      dispatch(action);
    },
    setAuthed(flag) {
      const action = {
        type: "authed",
        authed: flag,
      };
      dispatch(action);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(withRouter(UserCenter));
