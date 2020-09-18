import React, { Component } from "react";
import Player from "@/views/Main/Player";
import RightList from "@/views/Main/RightList";
import { connect } from "react-redux";
import '@/assets/css/main.less'
class Main extends Component {
  constructor(props) {
    super(props);
    this.playByUrl = this.playByUrl.bind(this);
  }
  render() {
    return (
      <div className="main">
        <div className="item player-container left">
          <Player
            ref="player"
            refreshCollectList={this.refreshCollectList.bind(this)}
          ></Player>
        </div>
        <RightList ref="RightList" playByUrl={this.playByUrl}></RightList>
        
      </div>
    );
  }

  // 被父级调用 搜索
  searchCallByParent(keyWords) {
    // this.props.searchByKeyWords(keyWords);
    this.refs.player.searchHandler(keyWords);
  }
  //刷新收藏列表
  refreshCollectList() {
    console.log(this.refs);
    this.refs.RightList.getCollectList();
    console.log("刷新收藏列表");
  }
  playByUrl(item, type) {
    console.log(type);

    this.props.sendCurSongInfo(item);
    this.refs.player.getAudioStream(item, type);
  }
}

const mapStateToProps = (state) => {
  // console.log("Main组件的mapStateToProps中的state", state);
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
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
})(Main);
