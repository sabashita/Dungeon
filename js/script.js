let membersNumer; // members of party
let lootList = [];//loot list
const LOOT_KEY = "Dungeon_loot_splitter";
let total = 0;// total price

//document.getElementById("addParty").addEventListener("click", addMembers);

document.getElementById("partySize").addEventListener("input",changeMembers);


function removeItem(index){
    lootList.splice(index,1);
    renderLootList();
}
function changeMembers(){

    addMembers();
    if(lootList.length > 0){
        renderLootList();
    }
}
//add members
function addMembers() {
    let members = document.getElementById("partySize").value;
    if (members <= 0) {
        return false;
    }
    render(members);
}
function showAddLot() {

}
//render and calculation price after addlot
function renderLootList() {
    let listDiv = document.getElementById("lootList");
    total = 0;
    listDiv.innerHTML = "";
    for (let i = 0; i < lootList.length; i++) {
        let list = document.createElement("li");
        list.className = "lootItems";
        list.textContent = lootList[i]["lootName"] + " : " + lootList[i]["lootValue"];
        //create button of remove
        let rmBtn = document.createElement("button");
        rmBtn.className = "removeBtn";
        rmBtn.textContent = "remove";
        rmBtn.onclick = () => removeItem(i);
        list.append(rmBtn);
        listDiv.appendChild(list);
        total += Number(lootList[i]["lootValue"]);
        
    }
    document.getElementById("runningTotal").value = total;
    document.getElementById("finalTotal").value = total;
    document.getElementById("perMember").value = (total / membersNumer).toFixed(2);

}

//add lotname and lotvalue
function addLot() {
    let lootName = document.getElementById("lootName").value;
    let lootValue = document.getElementById("lootValue").value;

    lootList.push({ lootName, lootValue });
    //writeLootList(lootList);//saving looList
    renderLootList();
    document.getElementById("lootName").value = "";
    document.getElementById("lootValue").value = "";
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


//render partylist, create party bar
function render(members) {
    let party = document.getElementById("partyList");
    party.innerHTML = "";
    let partyItems = document.createElement("div");
    partyItems.className = "partyItems";
    partyItems.textContent = members;
    membersNumer = members;
    partyItems.style.backgroundColor = "#4ab8ef";
    party.appendChild(partyItems);
    party.addEventListener("click", showAddLot);
}