class EditListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='list-item-edit-screen'>
                <h4>Edit Task</h4>
                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    Description:
                            </td>
                                <td>
                                    <input type='text' value={"Dummy text"} className='edit-task-input' />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Due Date:
                                </td>
                                <td>
                                    <input type='date' className='edit-task-input' />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Notes:
                                </td>
                                <td>
                                    <textarea className='edit-task-input' rows="5" />
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </form>
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
        this.state = this.props.itemObj;
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
                    <div className="edit-item" onClick={this.removeItem}>
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
            var newItem = {
                description: this.input.value,
                id: Date.now(),
                completed: false,
                starred: false
            }
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
        this.removeItemFromList = this.removeItemFromList.bind(this);
        this.toggleCompleted = this.toggleCompleted.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.renderCompletedItems = this.renderCompletedItems.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.state = ListLogic.returnListObjectGivenID(parseInt(this.props.listID));
    }

    componentWillReceiveProps(newProps) {
        if (this.state.listID !== newProps.listID) {
            var listObject = ListLogic.allLists.filter(listObj => listObj.listID === newProps.listID)[0];
            this.setState({
                listTitle: listObject.listTitle,
                listID: listObject.listID,
                listItems: listObject.listItems,
                completedItems: listObject.completedItems
            })
        }
    }

    addItemToList(item) {
        var allItemsAsString = JSON.stringify(this.state.listItems);
        var allItems = JSON.parse(allItemsAsString);
        allItems.push(item);
        this.setState({
            listItems: allItems
        }, () => { ListLogic.updateList(this.state) })
    }

    removeItemFromList(item) {
        if (item.completed) {
            var copyOfCompletedItems = JSON.parse(JSON.stringify(this.state.completedItems));
            copyOfCompletedItems = copyOfCompletedItems.filter((task) => task.id !== item.id);
            this.setState({
                completedItems: copyOfCompletedItems
            }, () => { ListLogic.updateList(this.state) });
        } else {
            var copyOfListItems = JSON.parse(JSON.stringify(this.state.listItems));
            copyOfListItems = copyOfListItems.filter((task) => task.id !== item.id);
            this.setState({
                listItems: copyOfListItems
            }, () => { ListLogic.updateList(this.state) });
        }
    }

    toggleCompleted(item) {
        var copyOfListItems = JSON.parse(JSON.stringify(this.state.listItems));
        var copyOfCompletedItems = JSON.parse(JSON.stringify(this.state.completedItems));
        if (item.completed) {
            copyOfCompletedItems.push(item);
            copyOfListItems = copyOfListItems.filter(task => task.id !== item.id);
        } else {
            copyOfListItems.push(item);
            copyOfCompletedItems = copyOfCompletedItems.filter(task => task.id !== item.id);
        }
        this.setState({
            listItems: copyOfListItems,
            completedItems: copyOfCompletedItems
        }, () => { ListLogic.updateList(this.state) });
    }

    updateItem(item) {
        var copyOfCompletedItems = JSON.parse(JSON.stringify(this.state.completedItems));
        var copyOfListItems = JSON.parse(JSON.stringify(this.state.listItems));
        if (item.completed) {
            for (var i = 0; i < copyOfCompletedItems.length; i++) {
                if (copyOfCompletedItems[i].id === item.id) {
                    copyOfCompletedItems[i] = item;
                    break;
                }
            }
        } else {
            for (var i = 0; i < copyOfListItems.length; i++) {
                if (copyOfListItems[i].id === item.id) {
                    copyOfListItems[i] = item;
                    break;
                }
            }
        }
        this.setState({
            listItems: copyOfListItems,
            completedItems: copyOfCompletedItems
        }, () => { ListLogic.updateList(this.state) })
    }

    deleteList() {
        this.props.handleDelete(this.state.listID);
    }

    renderListItems(listItems) {
        return listItems.map(item => <ListItem key={item.id} itemObj={item} handleRemoveItem={this.removeItemFromList} handleComplete={this.toggleCompleted} handleUpdateItem={this.updateItem} />);
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
                    <input type='text' className='list-title' placeholder="New List Title" onKeyUp={this.confirmNewList} ref={(input) => {this.input = input}}/>
                    <span onClick={this.cancelNewList} className="fas fa-times-circle list-title-icon proto-list-option"></span>
                    <span onClick={this.confirmNewList} className='fas fa-check-circle list-title-icon proto-list-option'></span>
                </h3>
                <AddListItem handleAdd={(e) => {false}}/>
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
            <div className='side-menu normal blue'>
                <ul className='all-list-titles'>
                    {this.renderListTitles()}
                    <li onClick={this.createNewList} className={`${this.state.isCreatingNewList ? "current-list-title" : ""}`}>+</li>
                </ul>
            </div>
        )
    }
}

class TopMenu extends React.Component {
    render() {
        return (
            <div className='top-menu dark blue'><span className='header'><span className='logo'><span className="fas fa-clipboard-check"></span> Listocracy</span></span></div>
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
        this.deleteList = this.deleteList.bind(this);
        this.state = {
            selectedListIndex: 0,
            allLists: ListLogic.returnArrayOfListTitles(),
            isCreatingNewList: false
        }
    }

    toggleCreateNewListMode() {
        this.setState({
            isCreatingNewList: !this.state.isCreatingNewList
        })
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
            isCreatingNewList: false
        })
    }

    deleteList(listID) {
        var currentListIndex = ListLogic.returnArrayOfListIDs().indexOf(listID);
        var nextListIndex = currentListIndex > 0 ? currentListIndex - 1 : 0;
        ListLogic.deleteList(listID);
        var arrayOfTitles = ListLogic.returnArrayOfListTitles();
        this.setState({
            selectedListIndex: nextListIndex,
            allLists: arrayOfTitles
        })
    }

    renderLists() {
        var arrayOfIDs = ListLogic.returnArrayOfListIDs();
        return this.state.allLists.map((listTitle, index) => <List key={index} listTitle={listTitle} listID={arrayOfIDs[index]} visible={this.state.selectedListIndex === index ? true : false} handleDelete={this.deleteList} />)
    }

    showProperComponent() {
        return this.state.isCreatingNewList ? <ProtoList createList={this.createNewList} cancelList={this.toggleCreateNewListMode}/> : this.renderLists();
    }

    render() {
        return (
            <div>
                <TopMenu />
                <SideMenu allLists={this.state.allLists} currentList={this.state.selectedListIndex} handleChangeList={this.changeList} inCreateNewListMode={this.toggleCreateNewListMode} isCreatingNewList={this.state.isCreatingNewList}/>
                <div className='current-list light blue'>
                    {this.showProperComponent()}
                    {/* {this.renderLists()} */}
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