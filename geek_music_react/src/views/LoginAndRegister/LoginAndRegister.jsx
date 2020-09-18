import React, { Component } from "react";
import { Form, Input, Button } from "antd";
// import { Link } from "react-router-dom";
import httpRequest from "@/utils/HttpRequest";
import MyAlert from "@/utils/MyAlert";
import Logo from "@/assets/imgs/lizhi.png";
import { connect } from "react-redux";
import md5 from "js-md5";
import '@/assets/css/LoginAndRegister.less'
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curPage: "/login", //   /register
      timerId: null,
    };
  }

  render() {
    return (
      <div className="login-register-wrapper">
        <div className="content">
          <div className="title">
            <img className="logo-img" src={Logo} alt="" />
            <p>Geek Music</p>
          </div>
          <Form
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={this.submitHandler.bind(this)}
          >
            <Form.Item
              name="username"
              label="Username"
              className="label"
              getValueFromEvent={(event) => {
                return event.target.value.replace(/[\u4E00-\u9FA5]/g, "");
              }}
              rules={[
                {
                  required: true,
                  message: "请输入用户名",
                },
                {
                  validator: (_, value) => {
                    if (value !== undefined) {
                      if (value.length > 0) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("账号长度不得小于1位!");
                      }
                    } else {
                      return Promise.reject("账号不得为空!");
                    }
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>

            {this.genNickName()}

            <Form.Item
              label="Password"
              name="password"
              className="label"
              rules={[
                {
                  required: true,
                  message: "请输入密码",
                },
              ]}
            >
              <Input.Password className="ipt" />
            </Form.Item>

            {this.genLoginBtn()}
            {this.genRegisterBtn()}
          </Form>
        </div>
      </div>
    );
  }
  // judgeChinese() {
  //   οnkeyup = "value=value.replace(/[\u4E00-\u9FA5]/g,'')";
  // }
  componentDidMount() {
    this.setCurPageState();
    // 用户如果是退出登录，清空收藏的列表。 场景可能是，用户登出，重新注册
    this.props.sendCollectList();
  }
  debounce = (fn, delay = 3000) => {
    //期间间隔执行 节流
    return (...rest) => {
      //箭头函数是没有arguments的 所以用...rest 来代替
      let args = rest;
      if (this.state.timerId) clearTimeout(this.state.timerId); //要用this.timerId 而不能直接定义var timerId=null;
      this.setState({
        timerId: setTimeout(() => {
          fn.apply(this, args);
        }, delay),
      });
    };
  };

  onDebounceKeyUpClick = (e) => {
    e.persist(); // 如果要传递
    //加入防抖动后 在频繁输入后 不会发送请求
    let debounceAjax = this.debounce(this.checkUserName, 800);
    debounceAjax(e);
  };

  //根据当前路由设置state
  setCurPageState() {
    if (this.props.match.url.indexOf("login") !== -1) {
      this.setState({
        curPage: "/login",
      });
    } else {
      this.setState({
        curPage: "/register",
      });
    }
  }

  // 检查用户名是否可用
  checkUserName(e) {
    if (this.getCurPage() === "/register") {
      console.log("在注册页");
      let regName = e.target.value;
      console.log(e.target.value);
      let config = {
        data: {
          regName,
        },
        method: "post",
        url: "/register/user_register/checkname.music",
      };
      httpRequest(config)
        .then((res) => {
          if (res.data.code === 1) {
            MyAlert.show(res.data.val, 2500);
          } else {
            console.log("用户名可用");
          }
        })
        .catch((err) => {});
    } else {
      // console.log('在登录页');
      return;
    }
  }

  // 登录按钮 登录和注册的 按钮 是不一样的
  genLoginBtn() {
    if (this.getCurPage() === "/login") {
      return (
        <Form.Item>
          <Button
            size="large"
            block
            className="login"
            type="primary"
            htmlType="submit"
          >
            登录
          </Button>
        </Form.Item>
      );
    } else {
      return (
        <Form.Item>
          <Button
            size="large"
            block
            className="login"
            type="primary"
            onClick={() => this.props.history.push("/player/login")}
          >
            已有账号？<span className="click-me"> 点我 </span> 登陆
          </Button>
        </Form.Item>
      );
    }
  }
  // 注册按钮
  genRegisterBtn() {
    if (this.getCurPage() === "/login") {
      return (
        <Form.Item>
          <Button
            size="large"
            block
            className="register"
            type="primary"
            onClick={() => this.props.history.push("/player/register")}
          >
            还没有账号？ <span className="click-me">去注册</span>
          </Button>
        </Form.Item>
      );
    } else {
      return (
        <Form.Item>
          <Button
            size="large"
            block
            className="register"
            type="primary"
            htmlType="submit"
          >
            确认注册
          </Button>
        </Form.Item>
      );
    }
  }

  // 昵称输入框
  genNickName() {
    if (this.getCurPage() === "/login") {
      return "";
    } else {
      return (
        <Form.Item label="Nickname" name="nickname" className="label">
          <Input className="ipt" />
        </Form.Item>
      );
    }
  }

  getCurPage() {
    if (this.state.curPage.indexOf("login") !== -1) {
      return "/login";
    } else {
      return "/register";
    }
  }

  // 登录
  submitHandler(values) {
    let config;
    let userName = values.username;
    let pwd = md5(values.password);
    if (this.getCurPage() === "/login") {
      config = {
        method: "post",
        data: {
          userName,
          pwd,
        },
        url: "/login/user_login.music",
      };
      this.loginHandler(config);
    } else {
      let nickname = values.nickname;
      config = {
        method: "post",
        data: {
          userName,
          nickname,
          pwd,
        },
        url: "/register/user_register.music",
      };
      this.registerHandler(config);
    }
  }
  // 登录
  loginHandler(config) {
    httpRequest(config)
      .then((res) => {
        let data = res.data;
        if (data.code !== 0) {
          MyAlert.show(data.val, 3000);
        } else {
          this.props.setUserInfo(data.userInfo);
          this.props.setAuthed(true);
          this.props.goToLogin(false);
          this.props.history.replace("/player/index");
        }
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //点击注册按钮
  registerClickHandler() {
    this.props.history.push("/player/register");
  }

  // 注册
  registerHandler(config) {
    httpRequest(config)
      .then((res) => {
        if (res.data.code !== 0) {
          MyAlert.show(res.data.val, 2500);
        } else {
          MyAlert.show("注册成功，即将跳转到登录页", 2000);
          setTimeout(() => {
            this.props.history.push("/player/login");
          }, 2000);
        }
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
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
    setUserInfo(userInfo) {
      const action = {
        type: "userInfo",
        userInfo: userInfo,
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
    // 这里不传参数，是想将收藏列表置空。
    sendCollectList(){
      const action = {
        type: "collectList",
        collectList: [],
      };
      dispatch(action);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(Login);
