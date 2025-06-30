import React, { useEffect, useState } from 'react'
import { Col, Row, Card, Table } from 'antd'
import { getData } from '../../api'
import "./home.css"
import * as Icon from "@ant-design/icons";
import MyEcharts from '../../components/Echarts'

const columns = [
  {
    title: '课程',
    dataIndex: 'name'
  },
  {
    title: '今日购买',
    dataIndex: 'todayBuy'
  },
  {
    title: '本月购买',
    dataIndex: 'monthBuy'
  },
  {
    title: '总购买',
    dataIndex: 'totalBuy'
  }
]
const countData = [
  {
    "name": "今日支付订单",
    "value": 1234,
    "icon": "CheckCircleOutlined",
    "color": "#2ec7c9"
  },
  {
    "name": "今日收藏订单",
    "value": 3421,
    "icon": "ClockCircleOutlined",
    "color": "#ffb980"
  },
  {
    "name": "今日未支付订单",
    "value": 1234,
    "icon": "CloseCircleOutlined",
    "color": "#5ab1ef"
  },
  {
    "name": "本月支付订单",
    "value": 1234,
    "icon": "CheckCircleOutlined",
    "color": "#2ec7c9"
  },
  {
    "name": "本月收藏订单",
    "value": 3421,
    "icon": "ClockCircleOutlined",
    "color": "#ffb980"
  },
  {
    "name": "本月未支付订单",
    "value": 1234,
    "icon": "CloseCircleOutlined",
    "color": "#5ab1ef"
  }
]

const iconToElement = (name) => React.createElement(Icon[name]);

const Home = () => {
  const userImg = require("../../assets/images/user.png")

  //const [tableData, setTableData] = useState([]) 这行代码通过解构赋值从useState返回的数组中提取了两个值。
  //第一个值（在这个例子中是tableData）是当前的状态值。初始情况下，它的值是你传给useState的那个值，即一个空数组。
  //第二个值（在这个例子中是setTableData）是一个函数，用于更新状态值。当你调用这个函数并传入一个新的值时，React会重新渲染组件，此时tableData将包含你传入的新值
  const [tableData, setTableData] = useState([])//初始值是一个空数组[]

  const [echartData, setEchartData] = useState({})
  useEffect(() => {
    getData().then(({ data }) => {
      const { tableData, orderData, userData, videoData } = data.data
      setTableData(tableData)
      const order = orderData
      const xData = order.date
      const keyArray =  Object.keys(order.data[0])
      const series = []
      keyArray.forEach(key => {
        series.push({
          name: key,
          data: order.data.map(item => item[key]),
          type: 'line'
        })
      })
      setEchartData({
        ...echartData,
        order: {
          xData,
          series
        },
        user: {
          xData: userData.map(item => item.date),
          series: [
            {
              name: '新增用户',
              data: userData.map(item => item.new),
              type: 'bar'
            },
            {
                name: '活跃用户',
                data: userData.map(item => item.active),
                type: 'bar'
            }
          ]
        },
        video: {
          series: [
            {
              data: videoData,
              type: 'pie'
            }
          ]
        }
      })
    })
  }, [])

  //获取当天时间的年月日
  const getCurrentDateFormatted = function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，加1后确保是两位数
    const day = String(now.getDate()).padStart(2, '0'); // 确保日期是两位数

    return `${year}-${month}-${day}`;
  }

  return (
    <Row className="home">
      <Col span={8}>
        <Card hoverable>
          <div className="user">
            <img src={userImg} />
            <div className="userinfo">
              <p className="name">Admin</p>
              <p className="access">超级管理员</p>
            </div>
          </div>
          <div className="login-info">
            <p>登录时间：<span>{getCurrentDateFormatted()}</span></p>
            <p>登录地点：<span>成都</span></p>
          </div>
        </Card>
        <Card style={{ marginTop: '20px' }} hoverable>
          <Table rowKey={"name"} columns={columns} dataSource={tableData} pagination={false} />
        </Card>
      </Col>
      <Col style={{ marginTop: '20px' }} span={16}>
        <div className="num">
          {
            countData.map((item, index) => {
              return (
                <Card key={index}>
                    <div className="icon-box" style={{background: item.color}}>
                      {iconToElement(item.icon)}
                    </div>
                    <div className="detail">
                        <p className="num">￥{item.value}</p>
                        <p className="txt">{item.name}</p>
                    </div>
                </Card>
              )
            })
          }
        </div>
        { echartData.order && <MyEcharts chartData={echartData.order} style={{ height: '280px' }} /> }
        <div className="graph">
          { echartData.user && <MyEcharts chartData={echartData.user} style={{ width: '50%', height: '240px' }} /> }
          { echartData.video && <MyEcharts chartData={echartData.video} isAxisChart={false} style={{ width: '50%', height: '260px' }} /> }
        </div>
      </Col>
    </Row>
  )
}

export default Home