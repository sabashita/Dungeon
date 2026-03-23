let membersNumer = 1; // members of party
let lootList = []; // loot list
const LOOT_KEY = "Dungeon_loot_splitter";
let total = 0; // total price
const STUDENT_ID = "haiyangL"; 


document.getElementById("partySize").addEventListener("input", changeMembers);
document.getElementById("addBtn").addEventListener("click", addLot);
document.getElementById("resetBtn").addEventListener("click", resetAll);

// ---------- remove item ----------
function removeItem(index) {
    lootList.splice(index, 1);
    saveState();
    renderLootList();
}

// ---------- change party size ----------
function changeMembers() {
    let members = Number(document.getElementById("partySize").value);

    if (!Number.isInteger(members) || members < 1) {
        document.getElementById("splitMsg").textContent = "Party size must be 1 or greater.";
        return;
    }

    document.getElementById("splitMsg").textContent = "";
    membersNumer = members;
    render(membersNumer);
    saveState();
    renderLootList();
}

// ---------- render and calculation ----------
function renderLootList() {
    let listDiv = document.getElementById("lootList");
    let runningTotalBox = document.getElementById("runningTotal");
    let finalTotalBox = document.getElementById("finalTotal");
    let perMemberBox = document.getElementById("perMember");
    let splitMsg = document.getElementById("splitMsg");

    total = 0;
    listDiv.innerHTML = "";

    for (let i = 0; i < lootList.length; i++) {
        let list = document.createElement("li");
        list.className = "lootItems";
        list.textContent = lootList[i].lootName + " : " + Number(lootList[i].lootValue).toFixed(2);

        let rmBtn = document.createElement("button");
        rmBtn.className = "removeBtn";
        rmBtn.textContent = "remove";
        rmBtn.addEventListener("click", function () {
            removeItem(i);
        });

        list.append(rmBtn);
        listDiv.appendChild(list);

        total += Number(lootList[i].lootValue);
    }

    runningTotalBox.value = total.toFixed(2);
    finalTotalBox.value = total.toFixed(2);

    if (membersNumer >= 1 && lootList.length > 0) {
        perMemberBox.value = (total / membersNumer).toFixed(2);
        splitMsg.textContent = "";
    } else if (lootList.length === 0) {
        perMemberBox.value = "";
        splitMsg.textContent = "No loot added.";
    } else {
        perMemberBox.value = "";
        splitMsg.textContent = "Party size must be 1 or greater.";
    }
}

// ---------- add loot ----------
function addLot() {
    let lootName = document.getElementById("lootName").value.trim();
    let lootValue = Number(document.getElementById("lootValue").value);
    let addMsg = document.getElementById("addMsg");

    if (lootName === "") {
        addMsg.textContent = "Loot name is required.";
        return;
    }

    if (Number.isNaN(lootValue) || lootValue < 0) {
        addMsg.textContent = "Loot value must be 0 or greater.";
        return;
    }

    addMsg.textContent = "";

    lootList.push({ lootName, lootValue });
    saveState();
    renderLootList();

    document.getElementById("lootName").value = "";
    document.getElementById("lootValue").value = "";
}

// ---------- save all state as one object ----------
function saveState() {
    const appState = {
        loot: lootList,
        partySize: membersNumer
    };

    localStorage.setItem(LOOT_KEY, JSON.stringify(appState));
}

// ---------- restore state ----------
function restoreState() {
    let savedText = localStorage.getItem(LOOT_KEY);

    if (!savedText) {
        membersNumer = 1;
        lootList = [];
        document.getElementById("partySize").value = membersNumer;
        return;
    }

    try {
        let parsed = JSON.parse(savedText);

        // default first
        lootList = [];
        membersNumer = 1;

        // restore party size
        if (
            parsed &&
            typeof parsed === "object" &&
            Number.isInteger(parsed.partySize) &&
            parsed.partySize >= 1
        ) {
            membersNumer = parsed.partySize;
        }

        // restore loot array item by item
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.loot)) {
            for (let i = 0; i < parsed.loot.length; i++) {
                let item = parsed.loot[i];

                if (
                    item &&
                    typeof item.lootName === "string" &&
                    item.lootName.trim() !== "" &&
                    !Number.isNaN(Number(item.lootValue)) &&
                    Number(item.lootValue) >= 0
                ) {
                    lootList.push({
                        lootName: item.lootName.trim(),
                        lootValue: Number(item.lootValue)
                    });
                }
            }
        }

        document.getElementById("partySize").value = membersNumer;
    } catch (error) {
        lootList = [];
        membersNumer = 1;
        document.getElementById("partySize").value = membersNumer;
    }
}

// ---------- reset all ----------
function resetAll() {
    lootList = [];
    membersNumer = 1;

    localStorage.removeItem(LOOT_KEY);

    document.getElementById("partySize").value = membersNumer;
    document.getElementById("lootName").value = "";
    document.getElementById("lootValue").value = "";
    document.getElementById("addMsg").textContent = "";
    document.getElementById("splitMsg").textContent = "";

    render(membersNumer);
    renderLootList();
}

// ---------- render party ----------
function render(members) {
    let party = document.getElementById("partyList");
    party.innerHTML = "";

    let partyItems = document.createElement("div");
    partyItems.className = "partyItems";
    partyItems.textContent = members;

    membersNumer = Number(members);
    partyItems.style.backgroundColor = "#4ab8ef";
    party.appendChild(partyItems);
}



// Phase 4 buttons
const syncBtn = document.getElementById("syncBtn");
if (syncBtn) {
    syncBtn.addEventListener("click", syncToServer);
}

const loadBtn = document.getElementById("loadBtn");
if (loadBtn) {
    loadBtn.addEventListener("click", loadFromServer);
}

// server message 
function showServerMessage(message, isError) {
    let msg = document.getElementById("serverMsg");
    if (!msg) return;

    msg.textContent = message;
    msg.style.color = isError ? "red" : "green";
}

//  Sync to Server 
function syncToServer() {

    const payload = {
        studentId: STUDENT_ID,
        state: {
            loot: lootList,
            partySize: membersNumer
        }
    };

    fetch("http://goldtop.hopto.org/save/" + STUDENT_ID, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Server sync failed");
        }
        return response.json();
    })
    .then(data => {
        // success only if status === "saved"
        if (data.status === "saved" && data.studentId === STUDENT_ID) {
            showServerMessage("Sync successful.", false);
        } else {
            showServerMessage("Invalid server response.", true);
        }
    })
    .catch(error => {
        showServerMessage("Sync failed: " + error.message, true);
    });
}

//  validate servers
function validateLoadedState(data) {

    if (!data || typeof data !== "object") {
        return null;
    }
    if (data.status !== "loaded"){
        return null;
    }
    if (data.studentId !== STUDENT_ID){
        return null;
    }
    if (!data.state || typeof data.state !== "object"){
        return null;
    } 

    if (!Array.isArray(data.state.loot)){
        return null;
    } 
    if (!Number.isInteger(data.state.partySize) || data.state.partySize < 1){
        return null;
    }

    let validatedLoot = [];

    for (let i = 0; i < data.state.loot.length; i++) {
        let item = data.state.loot[i];

        if (item && typeof item.lootName === "string" && item.lootName.trim() !== "" 
        && !Number.isNaN(Number(item.lootValue)) && Number(item.lootValue) >= 0) {
            
            validatedLoot.push({
                lootName: item.lootName.trim(),
                lootValue: Number(item.lootValue)
            });
        } else {
            return null; // fail if any invalid item
        }
    }

    return {
        loot: validatedLoot,
        partySize: data.state.partySize
    };
}

// ---------- Phase 4: Load from Server ----------
function loadFromServer() {

    fetch("http://goldtop.hopto.org/load/" + STUDENT_ID).then(response => {
        if (!response.ok) {
            throw new Error("Server load failed");
        }
        return response.json();
    }).then(data => {

        // server has no data
        if (data.status === "empty") {
            showServerMessage("No server data found.", true);
            return;
        }

        let validated = validateLoadedState(data);

        if (!validated) {
            showServerMessage("Invalid server data. State not changed.", true);
            return;
        }

        // Assign ONLY after full validation
        lootList = validated.loot;
        membersNumer = validated.partySize;

        document.getElementById("partySize").value = membersNumer;

        // lifecycle: Fetch → Validate → Assign → Save → Render
        saveState();
        render(membersNumer);
        renderLootList();

        showServerMessage("Load successful.", false);
    }).catch(error => {
        showServerMessage("Load failed: " + error.message, true);
    });
}

// ---------- init ----------
restoreState();
render(membersNumer);
renderLootList();