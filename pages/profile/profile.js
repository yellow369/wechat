import request from "../../utils/request";

let startY = 0; // 手指起始的坐标
let moveY = 0; // 手指移动的坐标
let moveDistance = 0; // 手指移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coveTransition: '',
    userInfo: {}, // 用户信息
    recentPlayList: [], // 用户播放记录
    flag: 0, //判断滑动坐标
    flag1: false //为1时表示在底部
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户的基本信息
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) { // 用户登录
      // 更新userInfo的状态
      this.setData({
        userInfo: JSON.parse(userInfo)
      })

      // 获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId)
    }
  },
  // 获取用户播放记录的功能函数
  async getUserRecentPlayList(userId) {
    let recentPlayListData = await request('/user/record', { uid: userId, type: 0 });
    let index = 0;
    let recentPlayList = recentPlayListData.allData.splice(0, 20).map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      recentPlayList
    })
  },

  handleTouchStart(event) {
    this.setData({
      coveTransition: ''
    })
    // 获取手指起始坐标
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event) {
    if (this.data.flag1 == 0) {
      moveY = event.touches[0].clientY;
      moveDistance = moveY - startY;

      if (moveDistance <= 0) {
        this.setData({
          flag: moveDistance
        })
      }
      if (moveDistance > 0 && moveDistance < 120) {
        this.setData({
          flag: moveDistance
        })
      }
      if (moveDistance >= 120) {
        moveDistance = 120;
      }
      // 动态更新coverTransform的状态值
      if (this.data.flag > 0) {
        this.setData({
          coverTransform: `translateY(${moveDistance}rpx)`
        })
      }
    }

  },
  handleTouchEnd() {
    if (this.data.flag1 == 0) {
      // 动态更新coverTransform的状态值
      if (moveDistance == 120) {
        this.setData({
          coverTransform: `translateY(400rpx)`,
          coveTransition: 'transform 1s linear',
          flag1: true
        })
      } else if (this.data.flag > 0 && this.data.flag < 120) {
        this.setData({
          coverTransform: `translateY(0rpx)`,
          coveTransition: 'transform 1s linear',

        })
      }
    }

  },
  goBack() {
    this.setData({
      flag1: false,
      coverTransform: `translateY(0rpx)`,
      coveTransition: 'transform 1s linear',
    })
  },

  toSong(event) {
    // 路由跳转传参： query参数
    wx.navigateTo({
      url: '/package/pages/song/song?song=' + event.currentTarget.dataset.id
    })
  },
  // 跳转至登录login页面的回调
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  //登出
  logOut() {
    wx.removeStorage({
      key: 'userInfo',
    })
    wx.reLaunch({
      url: '/pages/login/login'
    })
  }

})
