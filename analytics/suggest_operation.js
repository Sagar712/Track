import { fetch_subject_for_query, main } from "./suggest.js";

console.log("Hello there..");
let ALL_DATA = JSON.parse(localStorage.getItem("AllTrackMeData"))

async function callFirst() {
    await main('./analytics/subjects.json')
}
callFirst()

document.getElementById('nameOfItem').addEventListener('keyup', () => {
    if(ALL_DATA.enable_suggestion == 'off')
        return

    let text = document.querySelector('#nameOfItem').value

    console.log(text);
    let k = 0, temp

    fetch_subject_for_query(text)
        .then(res => {
            let all_result = res
            console.log(all_result);
            let suggest_block = document.getElementById('suggest')
            suggest_block.innerHTML = ''
            if (text.length > 2) {
                while (all_result[k] != undefined) {
                    temp = document.createElement('li')
                    temp.id = 'li-'+k
                    temp.setAttribute('onclick', 'suggestionSelected("li-'+k+'")')
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