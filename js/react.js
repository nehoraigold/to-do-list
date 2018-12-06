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
                                    <input type='date' className='edit-task-input'/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Notes:
                                </td>
                                <td>
                                    <textarea className='edit-task-input' rows="5"/>
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
        this.removeItem = this.removeItem.bind(this);
        this.state = this.props.itemObj;
    }

    toggleChecked() {
        this.setState({
            completed: !this.state.completed
        }, () => { this.props.handleComplete(this.state) })
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
        this.addItemToList = this.addItemToList.bind(this);
        this.removeItemFromList = this.removeItemFromList.bind(this);
        this.toggleCompleted = this.toggleCompleted.bind(this);
        this.renderCompletedItems = this.renderCompletedItems.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.state = ListLogic.returnListObjectGivenID(parseInt(this.props.listID));
    }

    addItemToList(item) {
        var allItemsAsString = JSON.stringify(this.state.listItems);
        var allItems = JSON.parse(allItemsAsString);
        allItems.push(item);
        this.setState({
            listItems: allItems
        }, () => {ListLogic.updateList(this.state)})
    }

    removeItemFromList(item) {
        if (item.completed) {
            var copyOfCompletedItems = JSON.parse(JSON.stringify(this.state.completedItems));
            copyOfCompletedItems = copyOfCompletedItems.filter((task) => task.id !== item.id);
            this.setState({
                completedItems: copyOfCompletedItems
            })
        } else {
            var copyOfListItems = JSON.parse(JSON.stringify(this.state.listItems));
            copyOfListItems = copyOfListItems.filter((task) => task.id !== item.id);
            this.setState({
                listItems: copyOfListItems
            }, () => {ListLogic.updateList(this.state)});
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
        }, () => {ListLogic.updateList(this.state)});
    }

    deleteList() {
        this.props.handleDelete(this.state.listID);
    }

    renderListItems() {
        return this.state.listItems.map(item => <ListItem key={item.id} itemObj={item} handleRemoveItem={this.removeItemFromList} handleComplete={this.toggleCompleted} />);
    }

    renderCompletedItems() {
        return this.state.completedItems.length === 0 ? <div className='no-items-completed-message'>No items completed yet!</div> : this.state.completedItems.map(item => <ListItem key={item.id} itemObj={item} handleRemoveItem={this.removeItemFromList} handleComplete={this.toggleCompleted} />);
    }

    render() {
        return (
            this.props.visible ? (
                <div className='list'>
                    <h3 className='list-title'>{this.state.listTitle}<span onClick={this.deleteList} className="fas fa-trash-alt trash-can"></span></h3>
                    <AddListItem handleAdd={this.addItemToList} />
                    <div className='list-items'>
                        {this.renderListItems()}
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

class SideMenu extends React.Component {
    constructor(props) {
        super(props);
        this.renderListTitles = this.renderListTitles.bind(this);
        this.changeSelectedList = this.changeSelectedList.bind(this);
        this.createNewList = this.createNewList.bind(this);
    }

    createNewList() {
        var newListName = prompt("Please enter a list name");
        if (newListName === "" || newListName === null) {
            return false;
        }
        this.props.handleCreateNewList(newListName);
    }

    changeSelectedList(e) {
        var newListIndex = parseInt(e.target.getAttribute("data-number"));
        this.props.handleChangeList(newListIndex);
    }

    renderListTitles() {
        return this.props.allLists.map((listTitle, index) => <li className={`${this.props.currentList === index ? "current-list-title" : ""}`} key={index} data-number={index} onClick={this.changeSelectedList}>{listTitle}</li>)
    }

    render() {
        return (
            <div className='side-menu normal blue'>
                <ul className='all-list-titles'>
                    {this.renderListTitles()}
                    <li onClick={this.createNewList}>+</li>
                </ul>
            </div>
        )
    }
}

class TopMenu extends React.Component {
    render() {
        return (
            <div className='top-menu dark blue'></div>
        )
    }
}

class App extends React.Component {
    constructor() {
        super();
        this.renderLists = this.renderLists.bind(this);
        this.changeList = this.changeList.bind(this);
        this.createNewList = this.createNewList.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.state = {
            selectedListIndex: 0,
            allLists: ListLogic.returnArrayOfListTitles(),
        }
    }

    createNewList(newListName) {
        ListLogic.createNewList(newListName);
        var arrayOfTitles = ListLogic.returnArrayOfListTitles();
        this.setState({
            selectedListIndex: arrayOfTitles.length - 1,
            allLists: arrayOfTitles,
        })
    }

    changeList(newListIndex) {
        this.setState({
            selectedListIndex: newListIndex
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
        return this.state.allLists.map((listTitle, index) => <List key={index} listTitle={listTitle} listID={arrayOfIDs[index]} visible={this.state.selectedListIndex === index ? true : false} handleDelete={this.deleteList}/>)
    }

    render() {
        return (
            <div>
                <TopMenu />
                <SideMenu allLists={this.state.allLists} currentList={this.state.selectedListIndex} handleChangeList={this.changeList} handleCreateNewList={this.createNewList} />
                <div className='current-list light blue'>
                    {this.renderLists()}
                    <EditListItem />
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