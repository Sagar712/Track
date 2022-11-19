import { fetch_subject_for_query, main } from "./suggest.js";

let App_data = JSON.parse(localStorage.getItem('AllTrackMeData'))

console.log(App_data);
let genrated_report = false

async function Start() {
    await main()
    await main_controller()
}
Start()

async function main_controller() {
    let Result_div = document.querySelector('.result_table')
    let para;
    Result_div.innerHTML = ''

    let result_obj = await aiAnalytics();

    let categories_sum = {
        food: 0,
        shopping: 0,
        'money-transfer': 0,
        entertainment: 0,
        health: 0,
        travel: 0,
        other: 0,
        unrecognized: 0
    }

    console.log(result_obj);
    let whole_sum = 0, itr = 0, l = 0
    let all_keys = Object.keys(result_obj)

    while (all_keys[l] != null) {
        let temp_sum = 0
        while (result_obj[all_keys[l]][itr] != null) {
            if (result_obj[all_keys[l]][itr].price == '') {
                result_obj[all_keys[l]][itr].price = 0
                console.log(result_obj[all_keys[l]][itr]);
            }
            whole_sum = await mod_add(result_obj[all_keys[l]][itr].price, whole_sum)
            temp_sum = await mod_add(result_obj[all_keys[l]][itr].price, temp_sum)

            itr++
        }
        itr = 0
        categories_sum[all_keys[l]] = temp_sum
        l++
    }


    console.log(categories_sum);

    let table_big = document.createElement('table')
    table_big.className = 'analytics'
    let table = document.createElement('tbody')
    let row = document.createElement('tr')
    para = document.createElement('th')
    para.innerText = 'Category'
    row.appendChild(para)
    para = document.createElement('th')
    para.innerText = 'Spendings'
    row.appendChild(para)
    table.appendChild(row)

    l = 0
    while (all_keys[l] != null) {
        row = document.createElement('tr')
        para = document.createElement('td')
        para.className = 'special'
        para.innerText = all_keys[l]
        row.appendChild(para)
        para = document.createElement('td')
        para.className = 'special'
        para.innerText = `₹${Readable_number(categories_sum[all_keys[l]])} (${((categories_sum[all_keys[l]] / whole_sum) * 100).toFixed(1)}%)`
        row.appendChild(para)
        table.appendChild(row)

        l++
    }
    row = document.createElement('tr')
    para = document.createElement('th')
    para.innerText = 'Total'
    row.appendChild(para)
    para = document.createElement('th')
    para.innerText = `₹ ${Readable_number(whole_sum)}`
    row.appendChild(para)
    table.appendChild(row)
    table_big.appendChild(table)
    Result_div.appendChild(table_big)
}

function Readable_number(num) {
    let parts = `${num}`.split('').reverse()
    let new_str = '', thousand = false

    for (let i = 0; i <parts.length; i++) {
        const element = parts[i];
        if (i == 3 && !thousand) {
            new_str += ','
            new_str += element
            thousand = true
        }
        else if (i % 2 != 0 && thousand) {
            new_str += ','
            new_str += element
        }
        else
            new_str += element
    }
    return new_str.split('').reverse().join('')
}

async function aiAnalytics() {
    let i = 0
    let categories = {
        food: [],
        shopping: [],
        'money-transfer': [],
        entertainment: [],
        health: [],
        travel: [],
        other: [],
        unrecognized: []
    }

    while (App_data[i] != null) {
        let current_data = App_data[i].data
        if(App_data.report_for_default == 'on' && i>0){
            break;
        }

        let j = 1

        while (current_data[j] != null) {

            let temp_result = await fetch_subject_for_query(current_data[j]['name'], true, App_data.my_dictonary)
            let bridge_obj = { item_name: '', found_name: '', category: '', match: '', price: 0 }

            bridge_obj.item_name = current_data[j]['name']
            bridge_obj.found_name = temp_result[0]['closest word found']
            bridge_obj.category = temp_result[0]['category']
            bridge_obj.match = temp_result[0]['match percentage']
            bridge_obj.price = current_data[j]['price']

            if (temp_result[0]['match percentage'] >= 0.75)
                categories[temp_result[0]['category']].push(bridge_obj)
            else
                categories.unrecognized.push(bridge_obj)
            j++
        }
        i++
    }
    return categories;
}

async function mod_add(num1, num2) {
    num1 = parseInt(num1)
    num2 = parseInt(num2)
    if (num1 < 0)
        num1 = -num1
    if (num2 < 0)
        num2 = -num2
    return num1 + num2
}

function suggestion_rules(all_ranks) {
    let new_list = {}

}