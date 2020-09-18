import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "@/views/Header/Header";
import "@/assets/css/edituserInfo.less";
import { Button, Input, Space, Modal } from "antd";
import avatar from "@/assets/imgs/lizhi.png";
import httpRequest from "@/utils/HttpRequest";
import MyAlert from "@/utils/MyAlert";
import md5 from "js-md5";
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: "",
      editNickNameStatus: false,
      showModal: false,
      canEditPassword: false,
    };
  }
  render() {
    return (
      <div className="index">
        <Header></Header>
        <div className="user-info">
          <div className="content">
            <h3 className="title">个人资料</h3>
            <div className="items">
              <div className="item avatar">
                <p className="label avatar-title">头像</p>
                <img ref="avatar" src={this.props.userInfo.avatar} alt="头像" />
                <div className="opt">
                  <span className="des">
                    支持jpg、png格式，大小为5M以内的图片
                  </span>
                  <label className="new-avatar-label" htmlFor="new-avatar">
                    选择文件
                  </label>
                  <input
                    onChange={this.handleAvatarIptChange.bind(this)}
                    type="file"
                    id="new-avatar"
                    accept="image/jpg,image/png"
                  />
                </div>
              </div>
              <div className="item nick-name">
                <p className="label nick-name-title">用户名</p>
                <p className="detail">{this.props.userInfo.userName}</p>
              </div>
              <div className="item nick-name">
                <p className="label nick-name-title">昵称</p>
                <p className="detail">{this.renderNickName()}</p>
                <div className="btns-container">
                  <span
                    className="edit-btn"
                    onClick={this.editNickName.bind(this)}
                  >
                    <i className="iconfont icon-bianji">
                      {this.state.editNickNameStatus ? "完成" : "编辑"}
                    </i>
                  </span>
                  <span
                    className={
                      this.state.editNickNameStatus ? "cancel" : "hide"
                    }
                    onClick={this.setEditNickNameStatusFalse.bind(this)}
                  >
                    <i className="iconfont icon-bianji">取消</i>
                  </span>
                </div>
              </div>
              <div className="item password">
                <p className="label password-title">密码</p>
                <Button
                  onClick={this.showModal.bind(this)}
                  className="confirm"
                  type="primary"
                  size="medium"
                >
                  修改密码
                </Button>
              </div>
            </div>
            <Modal
              className="modal"
              title="修改密码"
              visible={this.state.showModal}
              onCancel={this.hideModal.bind(this)}
              footer={[
                <Button key="back" onClick={this.hideModal.bind(this)}>
                  取消
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={this.editPassword.bind(this)}
                >
                  确认
                </Button>,
              ]}
            >
              <Space className="space" direction="vertical">
                <label htmlFor="ori-password">请输入原密码：</label>
                <Input.Password
                  className="ipt"
                  id="ori-password"
                  placeholder="input password"
                />
                <label htmlFor="new-password">请输入新密码：</label>
                <Input.Password
                  className="ipt"
                  id="new-password"
                  placeholder="input password"
                />
                <label htmlFor="re-new-password">请再次输入新密码：</label>
                <Input.Password
                  className="ipt"
                  id="re-new-password"
                  placeholder="input password"
                  onChange={this.checkNewPassword.bind(this)}
                />
              </Space>
            </Modal>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      avatar: avatar,
    });
  }
  setEditNickNameStatusFalse() {
    this.setState({
      editNickNameStatus: false,
    });
  }
  // 确认密码的输入框改变事件
  checkNewPassword() {
    let newPassword = document.querySelector("#new-password").value.toString();
    let reNewPassword = document
      .querySelector("#re-new-password")
      .value.toString();
    if (newPassword !== reNewPassword) {
      MyAlert.show("两次密码输入不一致", 2500);
      this.setState({
        canEditPassword: false,
      });
      return;
    } else {
      this.setState({
        canEditPassword: true,
      });
    }
  }
  // 修改密码
  editPassword() {
    let status = this.state.canEditPassword;
    if (!status) {
      MyAlert.show("两次密码输入不一致", 2500);
      return;
    }
    let oldPwd = md5(document.querySelector("#ori-password").value.toString());
    let reNewPassword = md5(
      document.querySelector("#re-new-password").value.toString()
    );
    let config = {
      method: "post",
      url: "/users/edit_password.music",
      data: {
        oldPwd,
        reNewPassword,
        userId: this.props.userInfo.id,
      },
    };
    httpRequest(config)
      .then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          MyAlert.show("修改密码成功", 2500);
          this.hideModal();
        } else if (res.data.code === 4) {
          MyAlert.show("原密码输入有误", 2500);
        }
      })
      .catch((err) => {
        MyAlert.show("修改密码失败", 2500);
        console.log(err);
      });
  }

  // 修改后 重新获取用户信息
  getUserInfo() {
    let config = {
      method: "post",
      url: "/users/get_userInfo.music",
      data: {
        userId: this.props.userInfo.id,
      },
    };
    httpRequest(config)
      .then((res) => {
        if (res.data.code === 0) {
          // MyAlert.show("获取信息成功", 2500);
          this.props.setUserInfo(res.data.data);
        }
        console.log(res);
      })
      .catch((err) => {
        MyAlert.show("获取信息失败", 2500);
        console.log(err);
      });
  }
  // 生成昵称部分的span和input
  renderNickName() {
    if (!this.state.editNickNameStatus) {
      return <span>{this.props.userInfo.nickName}</span>;
    } else {
      return (
        <span>
          <input onChange={this.nickNameChange.bind(this)} />
          {/* <input onChange={this.nickNameChange.bind(this)} value={this.props.userInfo.nickName} /> */}
        </span>
      );
    }
  }
  nickNameChange(e) {
    let val = e.currentTarget.value;
    this.setState({
      nickName: val,
    });
    // console.log(e.currentTarget.value);
  }
  // 修改昵称
  editNickName() {
    let nickName = this.state.nickName;
    let status = this.state.editNickNameStatus;
    this.setState({
      editNickNameStatus: !status,
    });
    if (status) {
      // 是在修改的状态
      let config = {
        method: "post",
        url: "/users/edit_nickName.music",
        data: {
          userId: this.props.userInfo.id,
          nickName: nickName,
        },
      };
      httpRequest(config)
        .then((res) => {
          if (res.data.code === 0) {
            MyAlert.show("成功", 1000);
            this.getUserInfo();
          }
          // console.log(res);
        })
        .catch((err) => {
          MyAlert.show("修改昵称失败", 2500);
          console.log(err);
        });
    }
  }

  // 上传新头像
  handleAvatarIptChange(e) {
    let file = e.currentTarget.files[0];
    let size = file.size / 1024; //kb
    // console.log(size);
    if (size / 1024 > 5) {
      MyAlert.show("图片大于5M", 2000);
      return;
    }
    // let blob = window.URL.createObjectURL(file);
    // console.log(window.atob(file));
    // let base64 = window.atob(blob);
    // console.log(base64);
    let base64;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      base64 = reader.result;
      this.uploadAvatar(base64);
      // console.log(reader.result);
    };
  }

  uploadAvatar(fileBase64) {
    let config = {
      method: "post",
      url: "/users/edit_avatar.music", // 如果不加 / ，则接口会加上package.json里面的homepage里配的路径
      data: {
        userId: this.props.userInfo.id,
        url: fileBase64,
      },
    };
    httpRequest(config)
      .then((res) => {
        // console.log(res);
        if (res.data.code === 0) {
          MyAlert.show("修改成功", 2000);
          this.getUserInfo();
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // this.setState({
    //   avatar: blob,
    // });
  }

  hideModal() {
    this.setState({
      showModal: false,
    });
  }
  showModal() {
    this.setState({
      showModal: true,
    });
  }
}
const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo(userInfo) {
      const action = {
        type: "userInfo",
        userInfo: userInfo,
      };
      dispatch(action);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(EditPassword);
