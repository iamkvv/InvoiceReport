import React, { Component } from 'react'
import { Tabs, DatePicker, BackTop, Table, Icon } from 'antd';

import { getAllInvoices } from '../BXMethods'
import { clearArray } from '../BXMethods'

import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'
import filter from 'lodash/filter'
import moment from 'moment'

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { resizeWindow } from '../BXMethods'


const TabPane = Tabs.TabPane
const { RangePicker } = DatePicker;

class InvoiceReport extends Component {
    state = { data: [], isLoad: false }

    columns = [{
        title: 'Дата',
        dataIndex: 'invdate',
        key: 'invdate',
    },
    {
        title: 'есть оплата',
        dataIndex: 'есть',
    },
    {
        title: 'нет оплаты',
        dataIndex: 'нет',
    },
    {
        title: 'Сумма оплаченных счетов',
        dataIndex: 'sopl',
    },
    {
        title: 'Сумма неоплаченных счетов',
        dataIndex: 'snopl',
    }
    ]



    componentDidMount() { }


    monthRome = (mnum) => {
        switch (mnum) {
            case 0:
                return 'I'
                break;
            case 1:
                return 'II'
                break;
            case 2:
                return 'III'
                break;
            case 3:
                return 'IV'
                break;
            case 4:
                return 'V'
                break;
            case 5:
                return 'VI'
                break;
            case 6:
                return "VII"
                break;
            case 7:
                return 'VIII'
                break;
            case 8:
                return 'IX'
                break;
            case 9:
                return 'X'
                break;
            case 10:
                return 'XI'
                break;
            case 11:
                return 'XII'
                break;
            default:
                break;
        }
    }

    onChange = (date, dateString) => {

        clearArray()
        this.setState({ isLoad: true })

        getAllInvoices(null, dateString[0], dateString[1]).then(response => {
            console.log("Invoices ", response)

            let invArr = [];

            var groupedResults = groupBy(response, function (result) {
                return moment(result['DATE_BILL'], 'YYYY-MM-DD').startOf('month'); //ПО какой дате лучше группировать???
            });

            console.log(groupedResults)//Группировка по месяцам

            for (var prop in groupedResults) {
                console.log("obj." + new Date(prop).getFullYear() + " " + new Date(prop).getMonth(), groupedResults[prop]);

                invArr.push(Object.assign({}, {
                    invdate: new Date(prop).getFullYear() + " " + this.monthRome(new Date(prop).getMonth()),
                    есть: filter(groupedResults[prop], { PAYED: 'Y' }).length,
                    нет: filter(groupedResults[prop], { PAYED: 'N' }).length,

                    sopl: sumBy(groupedResults[prop], (obj) => {
                        if (obj.PAYED === "Y")
                            return parseFloat(obj.PRICE)
                    }),

                    snopl: sumBy(groupedResults[prop], (obj) => {
                        if (obj.PAYED === "N")
                            return parseFloat(obj.PRICE)
                    })
                }))
            }

            console.log('ARRAY ', invArr)
            this.setState({ data: invArr, isLoad: false });
        })
    }

    render() {
        return (
            <div style={{ width: '95%', height: 'auto', minHeight: '2000px', margin: '0 auto' }}>
                <BackTop>
                    <div className="ant-back-top-inner">UP</div>
                </BackTop>

                <Tabs defaultActiveKey="1">
                    <TabPane tab="График" key="1">

                        <div style={{
                            display: 'flex', flexDirection: 'row', fontSize: '16px',
                            justifyContent: 'left', alignItems: 'baseline', marginLeft: '20px'
                        }}>
                            <p>Диапазон дат </p>
                            <RangePicker onChange={this.onChange} style={{ textAlign: 'left', marginLeft: '20px' }} />
                            <p>
                                {this.state.isLoad ?
                                    <Icon type="loading" style={{ marginLeft: 20 }} /> :
                                    null
                                }
                            </p>
                        </div>
                        <div style={{ textAlign: 'left', marginLeft: '20px', fontSize: '18px' }}>
                            Оплата счетов
                        </div>

                        <BarChart width={700} height={400} data={this.state.data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="invdate" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="есть" stackId="a" fill="#8884d8" />
                            <Bar dataKey="нет" stackId="a" fill="#82ca9d" />
                        </BarChart>
                    </TabPane>

                    <TabPane tab="Таблица" key="2">
                        <h1>2</h1>
                        <Table columns={this.columns} dataSource={this.state.data} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default InvoiceReport