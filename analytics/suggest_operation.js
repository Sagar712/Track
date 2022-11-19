import { fetch_subject_for_query, main } from "./suggest.js";

let DB_NAME = "AllTrackMeData"
let ALL_DATA = JSON.parse(localStorage.getItem(DB_NAME))
let all_result = []
let text = ''

async function callFirst() {
    await main('./analytics/subjects.json')
}
callFirst()

document.getElementById('nameOfItem').addEventListener('keyup', () => {
    if (ALL_DATA.enable_suggestion == 'off')
        return

    text = document.querySelector('#nameOfItem').value
    ALL_DATA = JSON.parse(localStorage.getItem(DB_NAME))

    console.log(text);
    let k = 0, temp

    fetch_subject_for_query(text, true, ALL_DATA.my_dictonary)
        .then(res => {
            all_result = res
            console.log(all_result);
            let suggest_block = document.getElementById('suggest')
            suggest_block.innerHTML = ''
            if (text.length > 2) {
                while (all_result[k] != undefined) {
                    temp = document.createElement('li')
                    temp.id = 'li-' + k
                    temp.setAttribute('onclick', 'suggestionSelected("li-' + k + '")')
                    temp.innerText = all_result[k]["closest word found"]
                    suggest_block.appendChild(temp)
                    k++
                    if (k >= 3)
                        break;
                }
            }
            else
                suggest_block.innerHTML = ''
        })

})


document.getElementById('addBtn').addEventListener('click', () => {
    console.log(text);
    console.log(all_result);
    if (all_result[0] != null)
        if (all_result[0]['match percentage'] < 0.85) {
            console.log("Low confidence");
            if (ALL_DATA.enable_suggestion == 'off')
                return
            document.querySelector('#current_word').textContent = `"${text}"`
            document.querySelector('.chooseCategory').classList.remove('hide')
        }
})

document.querySelector('.closebutn').addEventListener('click', () => {
    document.querySelector('.chooseCategory').classList.add('hide')
})

document.querySelectorAll('.categoryButn').forEach(button => {
    button.addEventListener('click', () => {
        ALL_DATA = JSON.parse(localStorage.getItem(DB_NAME))
        if (ALL_DATA.my_dictonary == null) {
            let obj_temp = {
                entertainment: [],
                food: [],
                health: [],
                "money-transfer": [],
                other: [],
                shopping: [],
                travel: []
            }
            ALL_DATA.my_dictonary = obj_temp
            localStorage.setItem('AllTrackMeData', JSON.stringify(ALL_DATA))
        }
        ALL_DATA = JSON.parse(localStorage.getItem(DB_NAME))

        console.log(button.textContent);
        ALL_DATA.my_dictonary[button.textContent.toLowerCase()].push(text.toLowerCase())
        localStorage.setItem('AllTrackMeData', JSON.stringify(ALL_DATA))
        ALL_DATA = JSON.parse(localStorage.getItem(DB_NAME))
        console.log(ALL_DATA);
        document.querySelector('.chooseCategory').classList.add('hide')
    })
})