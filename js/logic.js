var ListLogic = {};

ListLogic.allLists = [];

ListLogic.updateList = function(updatedList) {
    for (var i = 0; i < ListLogic.allLists.length; i++) {
        var currentList = ListLogic.allLists[i];
        if (currentList.listID === updatedList.listID) {
            ListLogic.allLists[i] = updatedList;
            ListLogic.saveAllLists();
            return true;
        }
    }
    return false;
}

ListLogic.listIDGenerator = 1;

ListLogic.emptyList = {
    listTitle: "To Do",
    listID: 0,
    listItems: [],
    completedItems: []
}

ListLogic.createNewList = function(newListName) {
    ListLogic.allLists.push({
        listTitle: newListName,
        listID: ListLogic.listIDGenerator,
        listItems: [],
        completedItems: []
    });
    ListLogic.listIDGenerator++;
    ListLogic.saveAllLists();
}

ListLogic.deleteList = function() {
    
}

ListLogic.returnListObjectGivenID = function(givenListID) {
    for (var i = 0; i < ListLogic.allLists.length; i++) {
        var currentList = ListLogic.allLists[i];
        if (currentList.listID === givenListID) {
            return currentList;
        }
    }
    return false;
}

ListLogic.returnArrayOfListTitles = function() {
    return ListLogic.allLists.map(listObject => listObject.listTitle);
}

ListLogic.saveAllLists = function() {
    var ToDoLists = {
        listIDGenerator: ListLogic.listIDGenerator,
        allLists: ListLogic.allLists
    }
    window.localStorage.ToDoLists = JSON.stringify(ToDoLists);
}

ListLogic.loadAllLists = function() {
    var ToDoLists = JSON.parse(window.localStorage.ToDoLists);
    ListLogic.listIDGenerator = ToDoLists.listIDGenerator;
    ListLogic.allLists = ToDoLists.allLists;
}

ListLogic.initLists = function() {
    if (window.localStorage.ToDoLists !== undefined) {
        ListLogic.loadAllLists();
    } else {
        ListLogic.allLists = [ListLogic.emptyList];
    }
}

ListLogic.start = function() {
    ListLogic.initLists();
}

ListLogic.start();