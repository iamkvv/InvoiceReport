import React, { Component } from 'react'

//столбцы для корневой таблицы по анализу счетов
export const rootTableColumns = [
    { title: 'Период', dataIndex: 'period', key: 'period' },
    { title: '∑ оплаченных счетов', dataIndex: "оплачено ₽", key: "оплачено ₽" },
    { title: '∑ не оплаченных счетов', dataIndex: "не оплачено ₽", key: "не оплачено ₽" },
    { title: '∑ оплаченных - ∑ не оплаченных ', dataIndex: "deltasum", key: "не оплачено ₽" }
]




//структура столбцов для таблицы пользователей в отчете по Activities
const columns = [
    {
        title: 'ID',
        dataIndex: 'ID',
        key: 'ID'
    },
    {
        title: 'Имя, Фамилия ',
        dataIndex: 'FIO',
        key: 'FIO',
        render: fio => (
            <span style={{ color: 'blue', cursor: 'pointer' }}>{fio}</span>
        )
    },
    {
        title: 'Должность',
        dataIndex: 'WORK_POSITION',
        key: 'WORK_POSITION'
    }
]

//export default columns