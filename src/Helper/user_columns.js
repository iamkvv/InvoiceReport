import React, { Component } from 'react'
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

export default columns