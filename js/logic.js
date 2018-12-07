var ListLogic = {};

ListLogic.allLists = [];

ListLogic.updateList = function (updatedList) {
    for (var i = 0; i < ListLogic.allLists.length; i++) {
        var currentList = ListLogic.allLists[i];
        if (currentList.listID === updatedList.listID) {
            ListLogic.allLists[i] = updatedList;
            ListLogic.saveAll();
            return true;
        }
    }
    return false;
}

ListLogic.listIDGenerator = 1;
ListLogic.chosenTheme = "blue";

ListLogic.createNewListItem = function (description) {
    var newListItem = {
        description: description,
        id: Date.now(),
        completed: false,
        starred: false,
        dueDate: null,
        notes: ""
    }
    return newListItem;
}
ListLogic.emptyListItem = {
    description: "",
    id: Date.now(),
    completed: false,
    starred: false,
    dueDate: null,
    notes: ""
}

ListLogic.emptyList = {
    listTitle: "To Do",
    listID: 0,
    listItems: [],
    completedItems: []
}

ListLogic.createNewList = function (newListName) {
    ListLogic.allLists.push({
        listTitle: newListName,
        listID: ListLogic.listIDGenerator,
        listItems: [],
        completedItems: []
    });
    ListLogic.listIDGenerator++;
    ListLogic.saveAll();
}

ListLogic.deleteList = function (listID) {
    var allListsMinusOne = ListLogic.allLists.filter(listObject => listObject.listID !== listID);
    ListLogic.allLists = allListsMinusOne;
    ListLogic.saveAll()
}

ListLogic.returnListObjectGivenID = function (givenListID) {
    for (var i = 0; i < ListLogic.allLists.length; i++) {
        var currentList = ListLogic.allLists[i];
        if (currentList.listID === givenListID) {
            return currentList;
        }
    }
    return false;
}

ListLogic.returnArrayOfListTitles = function () {
    return ListLogic.allLists.map(listObject => listObject.listTitle);
}

ListLogic.returnArrayOfListIDs = function () {
    return ListLogic.allLists.map(listObject => listObject.listID);
}

ListLogic.orderListItemsByStarred = function (listItems) {
    var starred = listItems.filter(item => item.starred === true);
    var unstarred = listItems.filter(item => item.starred === false);
    return starred.concat(unstarred);
}

ListLogic.updateChosenTheme = function (newTheme) {
    ListLogic.chosenTheme = newTheme;
    ListLogic.saveAll();
}

ListLogic.showTheme = function () {
    document.getElementById('theme').setAttribute('href', `./css/themes/${ListLogic.chosenTheme}.css`);
}

ListLogic.saveAll = function () {
    var ToDoLists = {
        chosenTheme: ListLogic.chosenTheme,
        listIDGenerator: ListLogic.listIDGenerator,
        allLists: ListLogic.allLists
    }
    window.localStorage.ToDoLists = JSON.stringify(ToDoLists);
}

ListLogic.loadAll = function () {
    var ToDoLists = JSON.parse(window.localStorage.ToDoLists);
    ListLogic.listIDGenerator = ToDoLists.listIDGenerator;
    ListLogic.allLists = ToDoLists.allLists;
    ListLogic.chosenTheme = ToDoLists.chosenTheme;
    ListLogic.showTheme();
}

ListLogic.initLists = function () {
    if (window.localStorage.ToDoLists !== undefined) {
        ListLogic.loadAll();
    } else {
        ListLogic.allLists = [ListLogic.emptyList];
    }
}

ListLogic.start = function () {
    ListLogic.initLists();
}

ListLogic.start();