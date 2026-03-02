let membersNumer;
let lootList = [];
const LOOT_KEY = "Dungeon_loot_splitter";
let total = 0;

document.getElementById("addParty").addEventListener("click", addMembers);

function addMembers() {
    let members = document.getElementById("partySize").value;
    if (members <= 0) {
        return false;
    }
    render(members);
}
function showAddLot() {

}
function renderLootList() {
    let listDiv = document.getElementById("lootList");
    total = 0;
    listDiv.innerHTML = "";
    for (i = 0; i < lootList.length; i++) {
        let list = document.createElement("li");
        list.className = "lootItems";
        list.textContent = lootList[i]["lootName"] + " : " + lootList[i]["lootValue"];
        listDiv.appendChild(list);
        total += Number(lootList[i]["lootValue"]);
        
    }
    document.getElementById("runningTotal").value = total;
    document.getElementById("finalTotal").value = total;
    document.getElementById("perMember").value = membersNumer;

}

function addLot() {
    let lootName = document.getElementById("lootName").value;
    let lootValue = document.getElementById("lootValue").value;

    lootList.push({ lootName, lootValue });
    writeLootList(lootList);//saving looList
    renderLootList();
}

function readLootList() {
    try {
        return JSON.parse(localStorage.getItem(LOOT_KEY)) || [];
    } catch {
        return [];
    }
}

function writeLootList(loot) {
    localStorage.setItem(LOOT_KEY, JSON.stringify(loot));
}



function render(members) {
    let party = document.getElementById("partyList");
    let partyItems = document.createElement("div");
    partyItems.className = "partyItems";
    partyItems.textContent = members;
    membersNumer = members;
    partyItems.style.backgroundColor = "#4ab8ef";
    party.appendChild(partyItems);
    party.addEventListener("click", showAddLot);
}