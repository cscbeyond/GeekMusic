import React, { Component } from "react";
import $ from "jquery";
import { connect } from "react-redux";
import "@/assets/css/player.less";
import avatar from "@/assets/imgs/lizhi.png";
import { transformSecondsToMinutes } from "@/utils/Tools";
import httpRequest from "@/utils/HttpRequest";
import MyAlert from "@/utils/MyAlert";
class Player extends Component {
  constructor(props) {
    super(props);
    this.optionClickHandler = this.optionClickHandler.bind(this);
    this.state = {
      duration: 0,
      curTime: 0,
      curList: "allList", // allList, search,collect
      curPlayingTimePercent: 0,
      curState: false,
      canvas: null, // 当前的canvas
      timerId: null,
      isNoVoice: false, // 是否是静音状态
      curVolume: 0.5,
    };
  }

  render() {
    let optionsData = this.props.playerCom.optionMenus;
    let optionsDom = optionsData.map((item, idx) => {
      let classNames = "option " + item.option;
      if (item.option.indexOf("play") !== -1) {
        if (this.props.isPlaying === 1) {
          classNames = "option " + item.option + " hide";
        }
      }
      if (item.option.indexOf("paused") !== -1) {
        if (this.props.isPlaying === 2) {
          classNames = "option " + item.option + " hide";
        }
      }
      let iconfonts = "iconfont " + item.iconfont;
      return (
        <div
          title={item.toolTip}
          key={idx}
          className={classNames}
          onClick={this.optionClickHandler}
        >
          <i className={iconfonts}></i>
        </div>
      );
    });
    return (
      <div className="player">
        <div className="content">
          <audio
            id="audio"
            className="audio-tag"
            ref="audio"
            onEnded={this.audioEnded.bind(this)}
            onLoadedMetadata={this.loadMetaData.bind(this)}
            onTimeUpdate={this.timeUpdateHandler.bind(this)}
            onDurationChange={this.durationChangeHandler.bind(this)}
            controls
          ></audio>
          <div className="player-ui">
            <div className="top">
              <div className="top-left">
                <canvas id="canvas"></canvas>
              </div>
              <div className="common-list top-right">
                <h5 className="comments-title">热门评论</h5>
                <ul>{this.genCommentListDom()}</ul>

                <div className="comment-area">
                  <div className="ipt-container">
                    <label htmlFor="comment">发表评论：</label>
                    <div className="textarea-btn-container">
                      <textarea
                        name=""
                        id="comment"
                        ref="commentArea"
                        placeholder="请留下您的评论"
                      ></textarea>
                      <button
                        className="comment-btn"
                        onClick={this.submitComment.bind(this)}
                      >
                        评论
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                this.props.searchList.length ? "middle search-result" : "hide"
              }
            >
              <span
                onClick={this.closeSearchResult.bind(this)}
                className="close-x"
              >
                ×
              </span>
              <h5 className="sr-res-title">搜索结果</h5>
              <ul className="ul">
                {this.props.searchList.map((item, idx) => {
                  return (
                    <li
                      className={
                        this.props.curSongInfo.id === item.id ? "active" : ""
                      }
                      onClick={this.getAudioStream.bind(this, item, "search")}
                      key={idx}
                    >
                      {item.fileNameChinese}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="bottom">
              <div
                className="process-container"
                onClick={this.processContainerClickHandler.bind(this)}
              >
                <div ref="processBar" className="process-bar">
                  <span className="dot"></span>
                </div>
              </div>
              <div className="fragment">
                <div className="song-info">
                  <img className="info-left" src={avatar} alt="" />
                  <div className="info-right">
                    <p className="song-album-name">
                      <span>{this.props.curSongInfo.fileNameChinese}</span>
                      <span>{this.props.curSongInfo.albumChinese}</span>
                    </p>
                    <p
                      className={
                        this.props.curSongInfo.id ? "duration-time" : "hide"
                      }
                    >
                      {transformSecondsToMinutes(this.state.curTime)} /{" "}
                      {transformSecondsToMinutes(this.state.duration)}
                    </p>
                  </div>
                </div>
                <div className="controls">
                  <div className="wrapper">
                    {optionsDom}
                    <div
                      className="option volume"
                      onClick={this.closeVolume.bind(this)}
                    >
                      <i
                        className={
                          this.state.isNoVoice
                            ? "iconfont icon-jingyin1"
                            : "iconfont icon-shengyin"
                        }
                      ></i>
                      <div
                        onClick={this.setVolume.bind(this)}
                        className="vertical-container"
                      >
                        <div
                          className="vertical-bar"
                          style={{ height: this.state.curVolume * 100 + "%" }}
                        >
                          <div className="dot"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.initCanvasAndAudioContext();
  }
  // 是否要静音
  closeVolume() {
    let isNoVoice = this.state.isNoVoice;
    this.setState(
      {
        isNoVoice: !isNoVoice,
      },
      () => {
        if (this.state.isNoVoice) {
          this.refs.audio.volume = 0;
        } else {
          this.refs.audio.volume = this.state.curVolume;
        }
      }
    );
  }
  // 设置音频的音量
  setVolume(e) {
    if (this.state.isNoVoice) {
      this.setState({
        isNoVoice: false,
      });
    }
    // console.log("外层元素：", e);
    e.stopPropagation();
    //鼠标点击的绝对位置
    var mousePos = this.mouseCoords(e);
    var y = mousePos.y;
    //alert("鼠标点击的绝对位置坐标："+x+","+y);

    //获取div在body中的绝对位置
    var y1 = $(e.currentTarget).offset().top;
    let height = $(e.currentTarget).height();
    //鼠标点击位置相对于div的坐标
    var y2 = y - y1;
    let percent = (1 - y2 / height).toFixed(2) * 100;
    $(".vertical-bar").height(percent + "%");
    this.refs.audio.volume = Number((1 - y2 / height).toFixed(2));
    console.log(this.refs.audio.volume);
    this.setState({
      curVolume: Number((1 - y2 / height).toFixed(2)),
    });
  }

  // 关闭搜索结果窗口
  closeSearchResult() {
    document.querySelector("#search-val").value = "";
    this.props.setSearchResult([]);
  }

  // 生成评论列表
  genCommentListDom() {
    if (this.props.commentList.length) {
      return this.props.commentList.map((item, idx) => {
        return (
          <li key={idx}>
            {item.commentContent}
            <i className="iconfont icon-xin"></i>
          </li>
        );
      });
    } else {
      return (
        <div className="has-no-comment">
          <label htmlFor="comment">暂无评论，快来抢沙发吧！</label>
        </div>
      );
    }
  }

  // 音乐播放结束
  audioEnded() {
    this.props.setPlayingState(2);
    this.playNextSong();
  }

  // 提交评论
  submitComment() {
    if (!this.props.authed) {
      MyAlert.show("此功能需登录后使用", 2500);
      return;
    }
    let commentContent = this.refs.commentArea.value;
    if (!commentContent) {
      MyAlert.show("请输入您的评论", 2000);
      return;
    }
    let config = {
      method: "post",
      url: "/comments/songComments.music",
      data: {
        userId: this.props.userInfo.id || 3,
        userName: "GeekChen",
        songId: this.props.curSongInfo.id,
        commentContent: commentContent,
        type: "1", // 代表评论
      },
    };

    httpRequest(config)
      .then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          MyAlert.show("评论成功", 2500);
          this.getSongComments();
          this.refs.commentArea.value = "";
        }
      })
      .catch((err) => {
        MyAlert.show("提交评论失败", 2500);
        console.log(err);
      });
  }
  // 获取当前歌曲评论
  getSongComments() {
    console.log(this.props.curSongInfo.id);
    let config = {
      method: "post",
      url: "/comments/getSongComments.music",
      data: {
        userId: this.props.userInfo.id || 3,
        songId: this.props.curSongInfo.id,
        type: "1", // 代表评论
      },
    };
    httpRequest(config)
      .then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          let resList = res.data.data;
          let list = resList.sort((a, b) => {
            return b.id - a.id;
          });
          console.log(list);
          this.props.sendCommentList(res.data.data);
          // MyAlert.show("获取评论成功", 2500);
        }
      })
      .catch((err) => {
        MyAlert.show("获取评论失败", 2500);
        console.log(err);
      });
  }

  initCanvasAndAudioContext() {
    //开始播放时触发
    //part1: 画布
    var audio = document.getElementById("audio");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    //part2: 音频
    // var files = this.files; //声音文件
    // audio.src = URL.createObjectURL(files[0]);

    audio.load();
    //part3: 分析器
    var AudCtx = new AudioContext(); //音频内容
    var src = AudCtx.createMediaElementSource(audio);
    // console.log(src);
    var analyser = AudCtx.createAnalyser();
    src.connect(analyser);
    analyser.connect(AudCtx.destination);
    analyser.fftSize = 128; //快速傅里叶变换, 必须为2的N次方
    var bufferLength = analyser.frequencyBinCount; // = fftSize * 0.5
    //part4: 变量
    var barWidth = WIDTH / bufferLength - 1; //间隔1px
    var barHeight;

    var dataArray = new Uint8Array(bufferLength); //8位无符号定长数组

    //part5: 动态监听
    function renderFrame() {
      // console.log("renderFrame");
      requestAnimationFrame(renderFrame);
      // console.log(animationId);
      //方法renderFrame托管到定时器，无限循环调度，频率<16.6ms/次
      context.fillStyle = "#ACCAF8"; //背景色
      context.fillRect(0, 0, WIDTH, HEIGHT); //画布拓展全屏,动态调整

      analyser.getByteFrequencyData(dataArray); //获取当前时刻的音频数据

      //part6: 绘画声压条
      var x = 0;
      for (var i = 0; i < bufferLength; i++) {
        var data = dataArray[i]; //int,0~255

        var percentV = data / 255; //纵向比例
        var percentH = i / bufferLength; //横向比例

        barHeight = HEIGHT * percentV;

        //gbk,0~255
        var r = 255 * percentV; //值越大越红
        var g = 255 * percentH; //越靠右越绿
        var b = 50;

        context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        context.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1; //间隔1px
      }
    }
    renderFrame();
    //part7: 播放声音
    // audio.play();
  }

  //点击进度条外层
  processContainerClickHandler(e) {
    // console.log("外层元素：", e);
    e.stopPropagation();
    //鼠标点击的绝对位置
    var mousePos = this.mouseCoords(e);
    var x = mousePos.x;
    // var y = mousePos.y;
    //alert("鼠标点击的绝对位置坐标："+x+","+y);

    //获取div在body中的绝对位置
    var x1 = $(e.currentTarget).offset().left;
    // var y1 = $(e.currentTarget).offset().top;
    let width = $(e.currentTarget).width();
    //alert("div在body中的绝对位置坐标："+x1+","+y1);

    //鼠标点击位置相对于div的坐标
    var x2 = x - x1;
    // var y2 = y - y1;
    // console.log(x2 / width);
    let percent = (x2 / width).toFixed(2) * 100;
    $(".process-bar").width(percent + "%");
    // console.log(percent);
    // console.log(this.refs.audio);
    this.setState(
      {
        curPlayingTimePercent: percent,
      },
      () => {
        this.setAudioCurPlayingTime();
      }
    );
  }

  // 当前鼠标的绝对位置
  mouseCoords(event) {
    if (event.pageX || event.pageY) {
      return { x: event.pageX, y: event.pageY };
    }
    return {
      x: event.clientX + document.body.scrollLeft - document.body.clientLeft,
      y: event.clientY + document.body.scrollTop - document.body.clientTop,
    };
  }

  // 设置audio当前播放时间
  setAudioCurPlayingTime() {
    this.setState({
      curState: true,
    });
    let curTime = this.state.curPlayingTimePercent;
    // console.log(curTime);
    let duration = this.state.duration;
    // console.log(duration);
    let targetTime = ((curTime / 100) * duration).toFixed(2);
    // console.log(targetTime);
    let audio = this.refs.audio;
    console.log(audio);
    audio.currentTime = targetTime;
  }

  //获取音乐的数据流  被父组件调用的
  getAudioStream(item, type) {
    let curSongId = this.props.curSongInfo.id;
    if (item.id === curSongId) {
      if (this.props.isPlaying === 1) {
        return;
      }
    }
    this.setState({
      curList: type,
    });
    this.props.sendCurSongInfo(item);
    this.props.setPlayingState(1);
    setTimeout(() => {
      this.getSongComments();
    }, 0);
    console.log(type);
    let songUrl = `${item.albumName}/${item.fileName}`;
    let audio = document.querySelector("#audio");

    audio.src = "/src/getSongStream.music?url=" + songUrl;
    audio.play();
  }

  // 播放 暂停 切换等操作
  optionClickHandler(event) {
    let currentTarget = event.currentTarget;
    $(currentTarget).siblings().removeClass("active").end().addClass("active");
    if ($(currentTarget).hasClass("collect")) {
      console.log("collect");
      this.collectSongBySongId();
    } else if ($(currentTarget).hasClass("prev")) {
      this.playPrevSong();
    } else if ($(currentTarget).hasClass("paused")) {
      console.log("paused");
      this.pauseTheSong();
    } else if ($(currentTarget).hasClass("play")) {
      console.log("play");
      this.playTheSong();
    } else if ($(currentTarget).hasClass("next")) {
      this.playNextSong();
    } else if ($(currentTarget).hasClass("share")) {
      this.shareMusic();
    }
  }

  // 播放当前列表的下一首
  playNextSong() {

    let curList = this.state.curList;
    let curSongId = this.props.curSongInfo.id;
    var state = { //这里可以是你想给浏览器的一个State对象，为后面的StateEvent做准备。
      title: "rocker.pub",
      url: '/player/index?songId=' + curSongId
    };
    window.history.pushState(state, "", state.url);
    // console.log("curSongId:-----", curSongId);
    if (curList === "allList") {
      let allList = this.props.allList;
      allList.forEach((item, albumIdx) => {
        if (Array.isArray(item.children)) {
          let children = item.children;
          children.forEach((song, childIdx) => {
            if (song.id === curSongId) {
              if (childIdx < children.length - 1) {
                let songWillPlay = children[childIdx + 1];
                this.getAudioStream(songWillPlay, "allList");
                this.props.sendCurSongInfo(songWillPlay);
              } else {
                if (albumIdx < allList.length - 1) {
                  let songWillPlay = allList[albumIdx + 1].children[0];
                  this.getAudioStream(songWillPlay, "allList");
                  this.props.sendCurSongInfo(songWillPlay);
                } else {
                  MyAlert.show("已经是最后一首啦", 2000);
                }
              }
            }
          });
        }
      });
    } else if (curList === "collect") {
      let collectList = this.props.collectList;
      collectList.forEach((item, idx) => {
        if (curSongId === item.id) {
          if (idx < collectList.length - 1) {
            let songWillPlay = collectList[idx + 1];
            this.getAudioStream(songWillPlay, "collect");
            this.props.sendCurSongInfo(songWillPlay);
          } else {
            MyAlert.show("已经是您收藏的宝贝歌单的最后一首啦", 2000);
          }
        }
      });
    } else if (curList === "search") {
      let searchList = this.props.searchList;
      for (let idx = 0; idx < searchList.length; idx++) {
        let cell = searchList[idx];
        if (cell.id === curSongId) {
          if (idx < searchList.length - 1) {
            let songWillPlay = searchList[idx + 1];
            this.getAudioStream(songWillPlay, "search");
            this.props.sendCurSongInfo(songWillPlay);
          } else {
            MyAlert.show("已经是您搜索的宝贝歌单的最后一首啦", 2000);
          }
        }
      }
    }
  }

  // 播放当前列表的上一首
  playPrevSong() {
    let curList = this.state.curList;
    let curSongId = this.props.curSongInfo.id;
    if (curList === "allList") {
      let allList = this.props.allList;
      allList.forEach((item, albumIdx) => {
        if (Array.isArray(item.children)) {
          let children = item.children;
          children.forEach((song, childIdx) => {
            if (song.id === curSongId) {
              if (childIdx !== 0) {
                let songWillPlay = children[childIdx - 1];
                this.getAudioStream(songWillPlay, "allList");
                this.props.sendCurSongInfo(songWillPlay);
              } else {
                if (albumIdx !== 0) {
                  let songWillPlay = allList[albumIdx - 1].children[0];
                  this.getAudioStream(songWillPlay, "allList");
                  this.props.sendCurSongInfo(songWillPlay);
                } else {
                  MyAlert.show("已经是歌单的第一首啦", 2000);
                }
              }
            }
          });
        }
      });
    } else if (curList === "collect") {
      let collectList = this.props.collectList;
      collectList.forEach((item, idx) => {
        if (curSongId === item.id) {
          if (idx !== 0) {
            let songWillPlay = collectList[idx - 1];
            this.getAudioStream(songWillPlay, "collect");
            this.props.sendCurSongInfo(songWillPlay);
          } else {
            MyAlert.show("已经是您收藏的宝贝歌单的第一首啦", 2000);
          }
        }
      });
    } else if (curList === "search") {
      let searchList = this.props.searchList;
      for (let idx = 0; idx < searchList.length; idx++) {
        let cell = searchList[idx];
        if (cell.id === curSongId) {
          if (idx !== 0) {
            let songWillPlay = searchList[idx - 1];
            this.getAudioStream(songWillPlay, "search");
            this.props.sendCurSongInfo(songWillPlay);
          } else {
            MyAlert.show("已经是您搜索的宝贝歌单的第一首啦", 2000);
          }
        }
      }
    }
  }

  //根据歌曲id收藏
  collectSongBySongId() {
    if (!this.props.authed) {
      MyAlert.show("此功能需登录后使用", 2500);
      return;
    }
    let curSongId = this.props.curSongInfo.id;
    if (!curSongId) {
      MyAlert.show("暂无歌曲播放", 2000);
      return;
    }
    let config = {
      method: "post",
      url: "/songs/collect.music",
      data: {
        userId: this.props.userInfo.id,
        songId: curSongId,
      },
    };
    console.log(curSongId);
    httpRequest(config)
      .then((res) => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          this.props.refreshCollectList();
          // alert(data.val);
        } else {
          // alert(data.val);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // 搜索
  searchHandler(val) {
    let config = {
      data: { keyWords: val },
      method: "post",
      url: "/songs/searchByKeyWords.music",
    };
    httpRequest(config)
      .then((res) => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          if (!data.songsList.length) {
            MyAlert.show("Sorry，曲库还未录入您所搜索的歌曲😢", 2500);
          }
          this.props.setSearchResult(data.songsList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // 播放时 更新进度条
  durationChangeHandler() { }

  loadMetaData() {
    // let dur = this.refs.audio.duration;
    // console.log(dur);
    this.setState({
      duration: this.refs.audio.duration,
    });
    // console.log(this.refs.audio.duration);
    console.log("loadMetaData");
  }
  // 播放时间更新
  timeUpdateHandler() {
    this.setState({
      curTime: this.refs.audio.currentTime,
    });
    let percent =
      (this.refs.audio.currentTime / this.state.duration).toFixed(5) * 100;
    this.refs.processBar.style.width = percent + "%";
  }

  playTheSong() {
    console.log("playTheSong");
    if (this.props.curSongInfo.id) {
      this.refs.audio.play();
      this.props.setPlayingState(1);
    }
  }
  pauseTheSong() {
    if (this.props.curSongInfo.id) {
      this.refs.audio.pause();
      this.props.setPlayingState(2);
    }
  }
  shareMusic() {
    console.log("share music");
  }
}
// this.commit dispatch
const mapDispatchToProps = (dispatch) => {
  return {
    setSearchResult(list) {
      const action = {
        type: "searchList",
        searchList: list,
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
    setPlayingState(status) {
      const action = {
        type: "isPlaying",
        isPlaying: status,
      };
      dispatch(action);
    },
    sendCommentList(list) {
      const action = {
        type: "commentList",
        commentList: list,
      };
      dispatch(action);
    },
    setMouseDown(status) {
      const action = {
        type: "mouseDown",
        mouseStatus: status,
      };
      dispatch(action);
    },
  };
};
// this.props.state
const mapStateToProps = (state) => {
  // console.log("Player组件的mapStateToProps中的state", state);
  return state;
};
export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(Player);
