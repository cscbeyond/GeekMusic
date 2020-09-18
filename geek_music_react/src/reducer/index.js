const initState = {
	collectList: [],
	allList: [],
	curSongInfo: {},
	playerCom: {
		optionMenus: [{
				option: "collect",
				iconfont: "icon-xin",
				toolTip: "收藏",
			},
			{
				option: "prev",
				iconfont: "icon-shangyishou",
				toolTip: "上一首",
			},
			{
				option: "play big",
				iconfont: "icon-bofang",
				toolTip: "播放",
			},
			{
				option: "paused big",
				iconfont: "icon-zanting1",
				toolTip: "暂停",
			},
			{
				option: "next",
				iconfont: "icon-xiayishou",
				toolTip: "下一首",
			},
		],
	},
	isPlaying: 2, // 1是正在播放，2是没有播放
	searchList: [],
	userInfo: {},
	commentList: [], // 评论内列表
	mouseStatus: 2, // 1 代表按下  2 代表抬起
	authed: false,
	toLogin: false, // 用户是否想要去登陆
}

// 要返回一个新的state 
let reducer = (state = initState, action) => {
	let newState = JSON.parse(JSON.stringify(state));
	switch (action.type) {
		case 'allList':
			newState.allList = action.allList;
			return newState;
		case 'collectList':
			newState.collectList = action.collectList;
			return newState;
		case 'curSongInfo':
			newState.curSongInfo = action.curSongInfo;
			return newState;
		case 'searchList':
			newState.searchList = action.searchList;
			return newState;
		case 'userInfo':
			newState.userInfo = action.userInfo;
			return newState;
		case 'isPlaying':
			newState.isPlaying = action.isPlaying;
			return newState;
		case 'commentList':
			newState.commentList = action.commentList;
			return newState;
		case 'authed':
			newState.authed = action.authed;
			return newState;
		case 'mouseDown':
			newState.mouseStatus = action.mouseStatus;
			return newState;
		case 'goToLogin':
			newState.toLogin = action.toLogin;
			return newState;
		default:
			return state;
	}
}

export default reducer;