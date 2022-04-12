// index.js

import request from "../../utils/request"
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    bannerList: [],
    recommendList: [],
    topList: []
  },

  onLoad: async function () {
    let bannerListData = await request('/banner', { type: 1 })
    // console.log(result);
    this.setData({
      bannerList: bannerListData.banners
    })

    let recommendListData = await request('/personalized', { limit: 10 })
    this.setData({
      recommendList: recommendListData.result
    })

    let index = 0;
    let resultArr = [];
    while (index < 10) {
      let topListData = await request('/top/list', { idx: index++ });
      let topListItem = { name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0, 10) };
      resultArr.push(topListItem);
      this.setData({
        topList: resultArr
      })
    }

    const query = wx.createSelectorQuery()
    query.select('.test').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res);
    })
  },
  toSong(event) {
    console.log(event.currentTarget.dataset);
    wx.navigateTo({
      url: '/package/pages/song/song?song=' + event.currentTarget.dataset.id
    })
  },
  toSearchPage() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  toRecommendSong() {
    wx.navigateTo({
      url: '/package/pages/recommendSong/recommendSong'
    })
  },
  toRankSong() {
    wx.navigateTo({
      url: '/package/pages/rankSong/rankSong'
    })
  }
})