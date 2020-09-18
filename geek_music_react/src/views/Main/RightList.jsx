import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { Collapse } from "antd";
import httpRequest from "@/utils/HttpRequest";
import "@/assets/css/rightList.less";
const { Panel } = Collapse;

class RightList extends Component {
  constructor(props) {
    super(props);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
  }
  render() {
    return (
      <Fragment>
        <div className="item right right-list">
          <div className="collection right-top">
            <h5 className="collect-title">收藏列表</h5>
            <div className="collection-list-container">
              <ul className="collection-list">
                {this.props.state.collectList.map((item, idx) => {
                  return (
                    <li
                      onClick={this.playByName.bind(this, item, "collect")}
                      key={idx}
                      className={
                        this.props.state.curSongInfo.id === item.id
                          ? "songName active"
                          : ""
                      }
                    >
                      <span className="collect-song-name">
                        {item.fileNameChinese}
                      </span>{" "}
                      —{" "}
                      <span className="collect-album-name">
                        {item.albumChinese}
                      </span>
                    </li>
                  );
                })}
                {this.genHasNoCollect()}
              </ul>
            </div>
          </div>
          <div
            id="drag"
            className="right-middle"
            onMouseDown={this.mouseDownHandler}
            onMouseMove={this.mouseMoveHandler}
            onMouseUp={this.mouseUpHandler}
          ></div>
          <div className="all-list right-bottom">
            <h5 className="all-list-title">全部歌曲</h5>
            <div className="all-list-container">
              {this.props.state.allList.map((item, idx) => {
                return (
                  <Collapse className="collapse" accordion key={idx}>
                    <Panel className="panel" header={item.albumChinese}>
                      {item.children.map((item, idx) => {
                        return (
                          <p
                            onClick={this.playByName.bind(
                              this,
                              item,
                              "allList"
                            )}
                            className={
                              this.props.state.curSongInfo.id === item.id
                                ? "songName active"
                                : "songName"
                            }
                            key={idx}
                          >
                            {item.fileNameChinese}
                          </p>
                        );
                      })}
                      <p>{item.fileNameChinese}</p>
                    </Panel>
                  </Collapse>
                );
              })}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  componentDidMount() {
    let allList = this.props.state.allList;
    let collectionList = this.props.state.collectList
    if (allList.length === 0 || collectionList.length === 0) {
      this.getRightAllList();
    }
  }

  genHasNoCollect() {
    if (this.props.state.collectList.length === 0) {
      if (this.props.state.userInfo.id) {
        return <div className="empty-collect">暂无</div>;
      } else {
        return <div className="empty-collect">请登录后使用此功能</div>;
      }
    }
  }

  playByName(item, type) {
    let curSongId = this.props.state.curSongInfo.id;
    if (item.id === curSongId) {
      if (this.props.state.isPlaying === 1) {
        return;
      }
    }
    this.props.playByUrl(item, type);
    this.props.sendCurSongInfo(item);
  }

  getRightAllList() {
    let songsConfig = {
      method: "post",
      url: "/songs/getSongsList.music",
      showLoading: true,
    };
    let collectConfig = {
      method: "post",
      url: "/songs/getCollectList.music",
      data: {
        userId: this.props.state.userInfo.id,
      },
      showLoading: true,
    };
    let songListRequest = httpRequest(songsConfig);
    let collectListRequest = httpRequest(collectConfig);
    Promise.all([songListRequest, collectListRequest])
      .then((res) => {
        let songListRes = res[0].data.songsList;
        // console.log(songListRes);
        this.props.sendAllList(songListRes);
        this.props.sendCurSongInfo(songListRes[0].children[0]);
        let songUrl = `${songListRes[0].children[0].albumName}/${songListRes[0].children[0].fileName}`;
        document.querySelector("#audio").src =
          "/src/getSongStream.music?url=" + songUrl;
        let collectListRes = res[1].data.songsList;
        this.computeCollectList(songListRes, collectListRes);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // 根据全部歌曲列表，及收藏列表的歌曲id，获取收藏列表具体信息
  computeCollectList(allList, collectList) {
    let result = [];
    for (let i = 0; i < allList.length; i++) {
      let allCellChildren = allList[i].children;
      allCellChildren.forEach((item, idx) => {
        collectList.forEach((colItem, colIdx) => {
          // console.log(item);
          if (item.id === colItem.songId) {
            item.orderId = colItem.id;
            result.push(item);
          }
        });
      });
    }
    // console.log(result);
    let r = result.sort(function (a, b) {
      return a.orderId - b.orderId;
    });
    this.props.sendCollectList(r);
  }

  // 获取收藏列表
  getCollectList() {
    let config = {
      method: "post",
      url: "/songs/getCollectList.music",
      data: {
        userId: this.props.state.userInfo.id,
      },
    };
    httpRequest(config)
      .then((res) => {
        console.log(res.data);
        let data = res.data;
        if (data.code === 0) {
          console.log(this.props.state.allList);
          this.computeCollectList(this.props.state.allList, data.songsList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  mouseDownHandler() {
    console.log("mouseDownHandler");
  }
  mouseMoveHandler() {
    console.log("mouseMoveHandler");
  }
  mouseUpHandler() {
    console.log("mouseUpHandler");
  }
}

// 传入
const mapStateToProps = (state) => {
  // console.log("mapStateToProps", state);
  return {
    state,
  };
};
// 传出
const mapDispatchToProps = (dispatch) => {
  return {
    sendCollectList(list) {
      const action = {
        type: "collectList",
        collectList: list,
      };
      dispatch(action);
    },
    sendAllList(list) {
      const action = {
        type: "allList",
        allList: list,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(RightList);
