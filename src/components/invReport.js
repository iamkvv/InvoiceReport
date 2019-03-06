import React, { Component } from 'react'
import { Tabs, DatePicker, BackTop } from 'antd';
import { getAllInvoices } from '../BXMethods'

import { resizeWindow } from '../BXMethods'

const TabPane = Tabs.TabPane
const { RangePicker } = DatePicker;

class InvoiceReport extends Component {

    componentDidMount() { }

    onChange = (date, dateString) => {
        console.log("DataString ", dateString);

        getAllInvoices(null, dateString[0],dateString[1]).then(response => {
            console.log("Invoices ", response)
        })
    }


    render() {
        return (
            <div style={{ width: '95%', height: 'auto', minHeight: '2000px', margin: '0 auto' }}>
                <BackTop>
                    <div className="ant-back-top-inner">UP</div>
                </BackTop>

                <Tabs defaultActiveKey="1">
                    <TabPane tab="Сводный отчет" key="1">
                        <h1>1</h1>
                        <RangePicker onChange={this.onChange} />
                    </TabPane>
                    <TabPane tab="Детальный отчет" key="2">
                        <h1>2</h1>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default InvoiceReport