var ListLogic = {};

ListLogic.allLists = [];
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

ListLogic.returnListObjectGivenID = function (listID) {
    return ListLogic.allLists.filter(listObj => listObj.listID === listID)[0];
}

ListLogic.returnArrayOfListTitles = function () {
    return ListLogic.allLists.map(listObject => listObject.listTitle);
}

ListLogic.returnArrayOfListIDs = function () {
    return ListLogic.allLists.map(listObject => listObject.listID);
}

ListLogic.addItemToList = function(item, listID) {
    var list = ListLogic.returnListObjectGivenID(listID);
    list.listItems.push(item);
    ListLogic.saveAll()
}

ListLogic.removeItemFromList = function(item, listID) {
    var list = ListLogic.returnListObjectGivenID(listID);
    var listToRemoveFrom = item.completed ? "completedItems" : "listItems";
    list[listToRemoveFrom] = list[listToRemoveFrom].filter((task) => task.id !== item.id);
    ListLogic.saveAll();
}

ListLogic.toggleCompletedItemInList = function(item, listID) {
    console.log('toggling completion for item')
    var list = ListLogic.returnListObjectGivenID(listID);
    if (item.completed) {
        console.log('item is completed, so adding to completed items')
        list.completedItems.push(item);
        list.listItems = list.listItems.filter(task => task.id !== item.id);
    } else {
        list.listItems.push(item);
        list.completedItems = list.completedItems.filter(task => task.id !== item.id);
    }
    ListLogic.saveAll();
}

ListLogic.updateListItem = function(item, listID) {
    var list = ListLogic.returnListObjectGivenID(listID);
    var oldItem;
    var allListItemsTogether = list.listItems.slice().concat(list.completedItems.slice());
    for (var i = 0; i < allListItemsTogether.length; i++) {
        var currentItem = allListItemsTogether[i];
        if (currentItem.id === item.id) {
            oldItem = currentItem;
            break;
        }
    }
    if (oldItem.completed !== item.completed) {
        ListLogic.toggleCompletedItemInList(item, listID);
    } else {
        var listToUpdateItemIn = item.completed ? "completedItems" : "listItems";
        for (var i = 0; i < list[listToUpdateItemIn].length; i++) {
            if (list[listToUpdateItemIn][i].id === item.id) {
                list[listToUpdateItemIn][i] = item;
                ListLogic.saveAll();
                break;
            }
        }
    }
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