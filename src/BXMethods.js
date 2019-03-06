import axios from 'axios';

export const resizeWindow = (w, h) => {
    BX24.resizeWindow(w, h,
        (e) => {
            console.log('resize e - this ', e, this)
        })
}

let arr = [];

export const getAllInvoices = (startpos) => {
    let tkn = BX24.getAuth(); //вынести из функции

    let req = `https://its74.bitrix24.ru/rest/crm.invoice.list.json?auth=${tkn.access_token}${startpos ? '&start=' + startpos : ''}`

    return axios.get(req)
        .then(response => {
            if (response.data.next) {
                arr = arr.concat(response.data.result)
                return getAllInvoices(response.data.next)
            } else {
                arr = arr.concat(response.data.result)
                return arr
            }
        })
        .catch(err => {
            console.log(err)
        })
}



///=========================================///

export const getCurrentUser = () => {
    if (window.BX24) {
        return new Promise((resolve, reject) => {
            window.BX24.callMethod(
                'user.current',
                {},
                function (result) {
                    if (!result.error()) {
                        resolve(result)
                    } else {
                        reject(result)
                    }
                }
            )
        }
        )
    } else {
        return null
    }
}

export const leadList = (resolve, reject) => {
    if (window.BX24) {
        //  return new Promise((resolve, reject) => {
        BX24.callMethod(
            "crm.lead.list",
            {
                order: { "STATUS_ID": "ASC" },
                filter: { ">=OPPORTUNITY": 0 },
                select: ["ID", "TITLE", "EMAIL", "STATUS_ID", "OPPORTUNITY", "CURRENCY_ID"]
            },
            function (result) {
                if (result.error()) {
                    console.error('lead ERR', result.error());
                    reject(result.error())
                }
                else {
                    console.log('callMethod ', result.data());
                    resolve(result)
                    if (result.more()) {
                        result.next();
                    }
                }
            }
            //)
            // }
        )
    } else {
        return null
    }
}



var options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

export const sendMessage = (rate, cb) => {
    //    , ctx) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const mess = `[P][B]Уважаемые коллеги![/B][/P]Примите к сведению, что курс доллара на ${new Date().toLocaleString("ru", options)} составляет ${rate} руб.
    Учитывайте это при заключении сделок.`

    BX24.callMethod('log.blogpost.add',
        { USER_ID: 1, POST_MESSAGE: mess },
        (r) => cb(r)) //, ctx))
}


export const getUsersProm = () => {
    if (window.BX24) {
        return new Promise((resolve, reject) => {
            window.BX24.callMethod(
                'user.get',
                {
                    select: ["*"]
                }
                // , function (result) {
                //     console.log("prom result", result)
                // }
            )
        })
    } else {
        return null;
    }
}




export const getUsers = (userArr, returnResult) => {
    if (window.BX24) {
        //return new Promise((resolve, reject) => {
        window.BX24.callMethod(
            'user.get',
            {
                "filter": { "ACTIVE": true },
                "select": ["ID", "NAME", "LAST_NAME", "UF_DEPARTMENT"]
            },
            //cb

            function (result) {
                if (result.error()) {
                    console.error('get users', result.error());
                }
                else {
                    // console.log('callMethod ', result.data());
                    Array.prototype.push.apply(userArr, result.data());

                    if (result.more()) {
                        result.next();
                    } else {
                        console.log("userArr end", userArr)
                        let tmpArr = userArr.filter((user) => { return (user.WORK_POSITION !== "" && user.WORK_POSITION !== null) })
                        console.log("userArr filter", tmpArr)
                        //OK!!
                        returnResult(tmpArr); //возвращает в компонент массив польз-й и запускает функцию получения подразделений
                    }
                }
            }
        )
        //}
        //)
    } else {
        return null
    }
}


// export const getActivity = () => {
//     BX24.callMethod(
//         "crm.activity.list",
//         {
//             order: { "ID": "DESC" },

//             select: ["*", "COMMUNICATIONS"]
//         },
//         function (result) {
//             if (result.error())
//                 console.error(result.error());
//             else {
//                 console.dir(result.data());
//                 if (result.more())
//                     result.next();
//             }
//         }
//     );
// }


export const getActivity = () => {
    // "=RESPONSIBLE_ID": [923, 925, 1067, 1577]
    //"=DIRECTION": 2
    //"COMMUNICATIONS"
    let tmpArr = [];
    BX24.callMethod(
        "crm.activity.list",
        {
            "order": { "START_TIME": "DESC" },
            // "filter": {
            //     ">START_TIME": "2018-11-01T00:00:00+03:00"
            // },

            "filter": {
                ">=START_TIME": "2019-01-01",
                "<=START_TIME": "2019-01-17",
                "RESPONSIBLE_ID": ['923']
            },
            "select": ["COMMUNICATIONS", "START_TIME", "END_TIME", "RESPONSIBLE_ID", "DIRECTION", "PROVIDER_TYPE_ID", "ASSOCIATED_ENTITY_ID"]
        },
        function (result) {
            if (result.error())
                console.error(result.error());
            else {
                //console.log('Activity ', result.data());

                Array.prototype.push.apply(tmpArr, result.data());

                if (result.more())
                    result.next();
                else {
                    console.log(tmpArr)
                }
            }
        }
    );
}


export const getUser = (id) => {
    if (window.BX24) {
        //  return new Promise((resolve, reject) => {
        window.BX24.callMethod(
            'user.get',
            {
                "filter": { "ID": id },
                'select': ["ID", "NAME", "LAST_NAME", "UF_DEPARTMENT"]
            },
            function (result) {
                if (!result.error()) {
                    console.log('OK', result)
                } else {
                    console.log('ERR', result)
                }
            }
        )
        // }
        //)
    } else {
        return null
    }
}


export const getDeparts = (depArr, returnResult) => {
    if (window.BX24) {
        //  return new Promise((resolve, reject) => {
        //[1, 677, 679]
        window.BX24.callMethod(
            'department.get',
            {
                //"filter": { "ID": id },
                'select': ["ID", "NAME", "PARENT"]

            },
            function (result) {
                if (result.error()) {
                    console.log('Err', result)
                } else {
                    Array.prototype.push.apply(depArr, result.data());

                    if (result.more()) {
                        result.next();
                    } else {
                        console.log("depArr end", depArr)
                        returnResult(depArr)
                    }
                }
            }
        )
        // }
        //)
    } else {
        return null
    }
}



export const getUserDepart = (id) => {
    //'$result[get_user][UF_DEPARTMENT]'
    //'result[get_user][0][UF_DEPARTMENT]'

    //result['get_user'].data()[0]["UF_DEPARTMENT"]

    BX24.callBatch({
        get_user: ['user.get', {
            "filter": { "ID": id },
            "select": ["ID", "NAME", "LAST_NAME", "UF_DEPARTMENT"]
        }],
        get_department: {
            method: 'department.get',
            params: {
                ID: "$result[get_user][0][UF_DEPARTMENT]"
            }
        }
    }, function (result) {
        console.log('getUserDepart -- ', result)

        var l = result.get_department.data().length;
        var d = result.get_department.data()[0].NAME;
        var str = 'Текущий пользователь ' + result.get_user.data()[0].NAME + ' ' + result.get_user.data()[0].LAST_NAME + ' приписан к подразделени' + (l > 1 ? 'ям ' : 'ю ');

        debugger;

        for (var i = 0; i < l; i++) {
            str += i == 0 ? '' : ', ';
            str += result.get_department.data()[i].NAME;
        }

        alert(str);
    });

}