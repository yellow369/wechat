// page/video/video.js
import request from "../../utils/request";

let videoContext = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navList: [],
        videoList: [],
        navId: '',
        pid: '',
        videoId: '',
        isTriggered: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getNavList();
    },
    toSearchPage() {
        wx.navigateTo({
            url: '/pages/search/search'
        })
    },
    // 获取导航列表
    async getNavList() {
        let navData = await request("/video/group/list");
        let navList = navData.data.slice(0, 10)
        this.setData({
            navList,
            navId: navList[0].id
        })

        this.getVideoList(this.data.navId);
    },
    // 改变Nav
    changeNav(event) {
        this.setData({
            navId: event.currentTarget.id,
            videoList: []
        })
        wx.showLoading({
            title: '正在加载'
        })
        this.getVideoList(this.data.navId)
    },
    /**
     * 播放Video
     * 关闭上一个正在播放的video
     */
    playVideo(event) {
        let pid = event.currentTarget.id;
        pid !== this.data.pid && this.videoContext && this.videoContext.stop();
        this.videoContext = wx.createVideoContext(pid, this)
        this.videoContext.play();
        this.setData({
            pid
        })
    },
    play(event) {
        let videoId = event.currentTarget.id;
        this.setData({
            videoId
        })
    },
    // 下拉刷新
    handlerRefresh() {
        this.setData({
            isTriggered: true
        });
        this.getVideoList(this.data.navId);
    },
    // 滚动到底部
    handlerScrollLower() {
        // TODO 需要取更新的数据
        // 分页
        let videoList = this.data.videoList;
        videoList.push(...newVideoList);
        this.setData({
            videoList
        })
    },
    // 获取视频列表
    async getVideoList(navId) {

        let videoData = await request("/video/group", { id: navId })
        wx.hideLoading();
        let index = 0;
        let videoList = videoData.datas.map(item => {
            item.id = index++;
            return item;
        })
        this.setData({
            videoList,
            isTriggered: false
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function ({from}) {
        if (from == "button") {
            return {
                title: '分享视频',
                Page: '/pages/video/video',
                imageUrl: '/static/images/logo.png'
            }
        }else {
            return {
                title: '分享页面',
                Page: '/pages/video/video',
            }
        }
    }
})
