class EditListItem extends React.Component {
    constructor(props) {
        super(props);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.closeEditItemScreen = this.closeEditItemScreen.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.changeInputField = this.changeInputField.bind(this);
        this.toggleChecked = this.toggleChecked.bind(this);
        this.toggleStar = this.toggleStar.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.state = this.props.listItem;
    }

    componentWillReceiveProps(newProps) {
        if (newProps.listItem.id !== this.state.id) {
            this.setState(newProps.listItem);
        }
    }

    changeInputField(e) {
        if (e.target === this.description) {
            this.setState({
                description: e.target.value
            })
        } else if (e.target === this.notes) {
            this.setState({
                notes: e.target.value
            })
        } else if (e.target === this.dueDate) {
            this.setState({
                dueDate: e.target.value
            })
        }
    }

    toggleChecked() {
        this.setState({
            completed: !this.state.completed
        })
    }

    toggleStar() {
        this.setState({
            starred: !this.state.starred
        })
    }

    saveChanges(e) {
        e.preventDefault();
        var savedItem = this.state;
        this.props.handleSaveItem(savedItem);
    }

    deleteItem(e) {
        e.preventDefault();
        var itemToDelete = this.state;
        this.props.handleDeleteItem(itemToDelete);
    }

    closeEditItemScreen(e) {
        if (e !== null && e !== undefined) {
            e.preventDefault();
        }
        this.props.handleCloseEditItemScreen();
    }

    render() {
        return (
            <div className='list-item-edit-container half-size'>
                <div className='list-item-edit-screen'>
                    <h4>
                        Edit Task
                        <span onClick={this.closeEditItemScreen} className="fas fa-times-circle edit-task-header-icon"></span>
                    </h4>
                    <form>
                        <table>
                            <tbody>
                                <tr>
                                    <td className='form-desc'>
                                        Description:
                                    </td>
                                    <td colSpan='2'>
                                        <textarea ref={(description) => this.description = description} type='text' value={this.state.description} className='edit-task-input' rows="3" onChange={this.changeInputField} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='form-desc'>
                                        Status:
                                    </td>
                                    <td>
                                        <label htmlFor={`edit-item-${this.state.id}`}>
                                            <div className='checkbox-container'>
                                                <div className={`fas fa-check checkmark ${this.state.completed ? "" : "unchecked"}`}></div>
                                                <input onChange={this.toggleChecked} type='checkbox' className='input-checkbox' checked={this.state.completed} id={`edit-item-${this.state.id}`} />
                                            </div>
                                            <span className={`${this.state.completed ? "completed-item" : "incomplete-item"}`}>{this.state.completed ? "Complete" : "Incomplete"}</span>
                                        </label>
                                    </td>
                                    <td >
                                        <label onClick={this.toggleStar}>
                                            <div className='star-item'>
                                                <span className={`star ${this.state.starred ? 'fas fa-star starred' : 'far fa-star'}`}></span>
                                            </div>
                                            <span className={`${this.state.starred ? "starred-item" : "unstarred-item"}`}>{this.state.starred ? "Starred" : "Unstarred"}</span>
                                        </label>
                                    </td>
                                </tr>
                                {/* <tr>
                                    <td className='form-desc'>
                                        Starred:
                                    </td>
                                    
                                </tr> */}
                                <tr>
                                    <td className='form-desc'>
                                        Due Date:
                                    </td>
                                    <td colSpan='2'>
                                        <input ref={(dueDate) => { this.dueDate = dueDate }} type='date' className='edit-task-input' value={this.state.dueDate} onChange={this.changeInputField} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='form-desc'>
                                        Notes:
                                </td>
                                    <td colSpan='2'>
                                        <textarea ref={(notes) => this.notes = notes} className='edit-task-input' rows="5" value={this.state.notes} onChange={this.changeInputField} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='edit-task-buttons'>
                            <button onClick={this.saveChanges} className='btn edit-task-btn'>Save Changes</button>
                            <button onClick={this.closeEditItemScreen} className='btn edit-task-btn'>Cancel</button>
                            <button onClick={this.deleteItem} className='btn edit-task-btn btn-danger'>Delete Task</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.toggleChecked = this.toggleChecked.bind(this);
        this.toggleStar = this.toggleStar.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.openEditItemScreen = this.openEditItemScreen.bind(this);
        this.state = this.props.itemObj;
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps.itemObj);
    }

    toggleChecked() {
        this.setState({
            completed: !this.state.completed
        }, () => { this.props.handleComplete(this.state) })
    }

    toggleStar() {
        this.setState({
            starred: !this.state.starred
        }, () => { this.props.handleUpdateItem(this.state) })
    }

    openEditItemScreen() {
        this.props.handleEditItem(this.state)
    }

    removeItem() {
        this.props.handleRemoveItem(this.state);
    }

    render() {
        return (
            <div className={`card ${this.state.completed ? "completed" : ""}`}>
                <div className='card-body'>
                    <label htmlFor={`item-${this.state.id}`}>
                        <div className='checkbox-container'>
                            <div className={`fas fa-check checkmark ${this.state.completed ? "" : "unchecked"}`}></div>
                            <input type='checkbox' className='input-checkbox' onChange={this.toggleChecked} checked={this.state.completed} id={`item-${this.state.id}`} />
                        </div>
                    </label>
                    <label htmlFor={`item-${this.state.id}`}>
                        <div className='task-container'>{this.state.description}</div>
                    </label>
                    <div className='star-item' onClick={this.toggleStar}>
                        <span className={`star ${this.state.starred ? 'fas fa-star starred' : 'far fa-star'}`}></span>
                    </div>
                    <div className="edit-item" onClick={this.openEditItemScreen}>
                        <div className="edit-item-dot"></div>
                        <div className="edit-item-dot"></div>
                        <div className="edit-item-dot"></div>
                    </div>
                </div>
            </div>
        )
    }
}

class AddListItem extends React.Component {
    constructor(props) {
        super(props);
        this.createListItem = this.createListItem.bind(this);
    }

    createListItem(e) {
        if (this.input.value.trim() === "") {
            return false;
        }
        if ((e.target.tagName === "INPUT" && e.keyCode === 13) || (e.target.tagName === "BUTTON")) {
            var newItem = ListLogic.createNewListItem(this.input.value);
            this.props.handleAdd(newItem);
            this.input.value = "";
        }

    }

    render() {
        return (
            <div className='card'>
                <div className='card-body'>
                    <input type='text' placeholder='Add a new task...' className='add-item' ref={(input) => this.input = input} onKeyUp={this.createListItem} />
                    <button className='btn add-button' onClick={this.createListItem}>Add</button>
                </div>
            </div>
        )
    }
}

class List extends React.Component {
    constructor(props) {
        super(props);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.addItemToList = this.addItemToList.bind(this);
        this.toggleCompleted = this.toggleCompleted.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.renderCompletedItems = this.renderCompletedItems.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.state = ListLogic.returnListObjectGivenID(parseInt(this.props.listID));
    }

    componentWillReceiveProps(newProps) {
        var listObject = ListLogic.allLists.filter(listObj => listObj.listID === newProps.listID)[0];
        this.setState(listObject);
    }

    addItemToList(item) {
        ListLogic.addItemToList(item, this.state.listID);
        this.setState(ListLogic.returnListObjectGivenID(parseInt(this.state.listID)));
    }

    toggleCompleted(item) {
        ListLogic.toggleCompletedItemInList(item, this.state.listID);
        this.setState(ListLogic.returnListObjectGivenID(parseInt(this.state.listID)));
    }

    updateItem(item) {
        ListLogic.updateListItem(item, this.state.listID);
        this.setState(ListLogic.returnListObjectGivenID(parseInt(this.state.listID)));
    }

    editItem(item) {
        this.props.handleEditItem(item);
    }

    deleteList() {
        this.props.handleDelete(this.state.listID);
    }

    renderListItems(listItems) {
        return listItems.map(item => <ListItem key={item.id} itemObj={item} handleRemoveItem={this.removeItemFromList} handleComplete={this.toggleCompleted} handleUpdateItem={this.updateItem} handleEditItem={this.editItem} />);
    }

    renderNoCompletedItemsMessage() {
        return <div className='no-items-completed-message'>No items completed yet!</div>;
    }

    renderCompletedItems() {
        return this.state.completedItems.length === 0 ? this.renderNoCompletedItemsMessage() : this.renderListItems(ListLogic.orderListItemsByStarred(this.state.completedItems));
    }

    render() {
        return (
            this.props.visible ? (
                <div className='list'>
                    <h3 className='list-title'>{this.state.listTitle}<span onClick={this.deleteList} className="fas fa-trash-alt list-title-icon trash-can"></span></h3>
                    <AddListItem handleAdd={this.addItemToList} />
                    <div className='list-items'>
                        {this.renderListItems(ListLogic.orderListItemsByStarred(this.state.listItems))}
                    </div>
                    <br />
                    <h3 className='list-title'>Done</h3>
                    <div className='completed-list-items list-items'>
                        {this.renderCompletedItems()}
                    </div>
                </div>
            ) : false
        )
    }
}

class ProtoList extends React.Component {
    constructor(props) {
        super(props);
        this.confirmNewList = this.confirmNewList.bind(this);
        this.cancelNewList = this.cancelNewList.bind(this);
    }

    confirmNewList(e) {
        if (this.input.value.trim() === "") {
            return false;
        }
        if ((e.target.tagName === "INPUT" && e.keyCode === 13) || (e.target.tagName === "SPAN")) {
            var newListName = this.input.value;
            this.props.createList(newListName);
        }
    }

    cancelNewList(e) {
        this.props.cancelList()
    }

    render() {
        return (
            <div className='list'>
                <h3 className='list-title'>
                    <input type='text' className='list-title' placeholder="New List Title" onKeyUp={this.confirmNewList} ref={(input) => { this.input = input }} />
                    <span onClick={this.cancelNewList} className="fas fa-times-circle list-title-icon proto-list-option"></span>
                    <span onClick={this.confirmNewList} className='fas fa-check-circle list-title-icon proto-list-option'></span>
                </h3>
                <div className='alert alert-danger' role='alert'>Please title your list before adding new items.</div>
            </div>
        )
    }
}

class SideMenu extends React.Component {
    constructor(props) {
        super(props);
        this.renderListTitles = this.renderListTitles.bind(this);
        this.changeSelectedList = this.changeSelectedList.bind(this);
        this.createNewList = this.createNewList.bind(this);
        this.state = {
            isCreatingNewList: this.props.isCreatingNewList
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isCreatingNewList !== this.state.isCreatingNewList) {
            this.setState({
                isCreatingNewList: newProps.isCreatingNewList
            })
        }
    }

    createNewList() {
        this.props.inCreateNewListMode()
    }

    changeSelectedList(e) {
        var newListIndex = parseInt(e.target.getAttribute("data-number"));
        this.props.handleChangeList(newListIndex);
    }

    renderListTitles() {
        return this.props.allLists.map((listTitle, index) => <li className={`${this.state.isCreatingNewList ? "" : (this.props.currentList === index ? "current-list-title" : "")}`} key={index} data-number={index} onClick={this.changeSelectedList}>{listTitle}</li>)
    }

    render() {
        return (
            <div className='side-menu'>
                <ul className='all-list-titles'>
                    {this.renderListTitles()}
                    <li onClick={this.createNewList} className={`${this.state.isCreatingNewList ? "current-list-title" : ""}`}>+</li>
                </ul>
            </div>
        )
    }
}

class TopMenu extends React.Component {
    constructor(props) {
        super(props);
        this.changeTheme = this.changeTheme.bind(this);
        this.renderThemeBoxes = this.renderThemeBoxes.bind(this);
        this.themes = ["blue", "green", "purple"]
    }

    changeTheme(e) {
        var newTheme = e.target.classList[1];
        ListLogic.updateChosenTheme(newTheme);
        ListLogic.showTheme();
    }

    renderThemeBoxes() {
        return this.themes.map((theme) => <div key={theme} onClick={this.changeTheme} className={`theme-box ${theme}`}></div>);
    }

    render() {
        return (
            <div className='top-menu'>
                <span className='header'><span className='logo'>
                    <span className="fas fa-leaf"></span> NaturaList</span>
                </span>
                <div className='themes'>
                    <span className='themes-label'>Themes</span>
                    <div className='theme-boxes'>
                        {this.renderThemeBoxes()}
                    </div>
                </div>
            </div>
        )
    }
}

class App extends React.Component {
    constructor() {
        super();
        this.renderLists = this.renderLists.bind(this);
        this.showProperComponent = this.showProperComponent.bind(this);
        this.changeList = this.changeList.bind(this);
        this.createNewList = this.createNewList.bind(this);
        this.toggleCreateNewListMode = this.toggleCreateNewListMode.bind(this);
        this.changeToEditingListItemMode = this.changeToEditingListItemMode.bind(this);
        this.closeEditItemScreen = this.closeEditItemScreen.bind(this);
        this.saveListItem = this.saveListItem.bind(this);
        this.removeItemFromList = this.removeItemFromList.bind(this);
        this.showEditItemScreenIfNeeded = this.showEditItemScreenIfNeeded.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            selectedListIndex: 0,
            allLists: ListLogic.returnArrayOfListTitles(),
            isCreatingNewList: false,
            isEditingListItem: false,
            selectedListItem: null
        }
    }

    toggleCreateNewListMode() {
        this.setState({
            isCreatingNewList: !this.state.isCreatingNewList,
            isEditingListItem: false
        })
    }

    changeToEditingListItemMode(item) {
        this.setState({
            isEditingListItem: true,
            selectedListItem: item
        })
    }

    closeEditItemScreen() {
        this.setState({
            isEditingListItem: false,
            selectedListItem: null
        })
    }

    saveListItem(item) {
        ListLogic.updateListItem(item, ListLogic.returnArrayOfListIDs()[this.state.selectedListIndex])
        this.closeEditItemScreen();
    }

    removeItemFromList(item) {
        ListLogic.removeItemFromList(item, ListLogic.returnArrayOfListIDs()[this.state.selectedListIndex]);
        this.closeEditItemScreen();
    }

    createNewList(newListName) {
        ListLogic.createNewList(newListName);
        var arrayOfTitles = ListLogic.returnArrayOfListTitles();
        this.setState({
            selectedListIndex: arrayOfTitles.length - 1,
            allLists: arrayOfTitles,
            isCreatingNewList: false
        })
    }

    changeList(newListIndex) {
        this.setState({
            selectedListIndex: newListIndex,
            isCreatingNewList: false,
            isEditingListItem: false
        })
    }

    deleteList(listID) {
        var currentListIndex = ListLogic.returnArrayOfListIDs().indexOf(listID);
        var nextListIndex = currentListIndex > 0 ? currentListIndex - 1 : 0;
        ListLogic.deleteList(listID);
        var arrayOfTitles = ListLogic.returnArrayOfListTitles();
        this.setState({
            selectedListIndex: nextListIndex,
            allLists: arrayOfTitles,
            isEditingListItem: false
        })
    }

    renderLists() {
        var arrayOfIDs = ListLogic.returnArrayOfListIDs();
        return this.state.allLists.map((listTitle, index) => <List key={index} listTitle={listTitle} listID={arrayOfIDs[index]} visible={this.state.selectedListIndex === index ? true : false} handleDelete={this.deleteList} handleEditItem={this.changeToEditingListItemMode} />)
    }

    showProperComponent() {
        return this.state.isCreatingNewList ? <ProtoList createList={this.createNewList} cancelList={this.toggleCreateNewListMode} /> : this.renderLists();
    }

    showEditItemScreenIfNeeded() {
        return (this.state.isEditingListItem ? <EditListItem listItem={this.state.selectedListItem} handleCloseEditItemScreen={this.closeEditItemScreen} handleSaveItem={this.saveListItem} handleDeleteItem={this.removeItemFromList} selectedListIndex={this.state.selectedListIndex} /> : null);
    }

    render() {
        var classes = this.state.isEditingListItem ? "current-list half-size" : "current-list full-size";
        return (
            <div>
                <TopMenu />
                <div className='main-app'>
                    <SideMenu allLists={this.state.allLists} currentList={this.state.selectedListIndex} handleChangeList={this.changeList} inCreateNewListMode={this.toggleCreateNewListMode} isCreatingNewList={this.state.isCreatingNewList} />
                    <div className={`${classes}`}>
                        {this.showProperComponent()}
                    </div>
                    {this.showEditItemScreenIfNeeded()}
                </div>
            </div>
        )
    }
}

function render() {
    ReactDOM.render(
        <App />,
        document.getElementById("root")
    );
}

render();