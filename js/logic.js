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
                    <div className='checkbox-container'><input type='checkbox' className='add-item' onChange={this.toggleChecked} checked={this.state.completed} /></div>
                    <label>
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
        this.state = {
            listTitle: this.props.listObj.listTitle,
            listItems: this.props.listObj.listItems,
            completedItems: this.props.listObj.completedItems
        }
    }

    addItemToList(item) {
        var allItemsAsString = JSON.stringify(this.state.listItems);
        var allItems = JSON.parse(allItemsAsString);
        allItems.push(item);
        this.setState({
            listItems: allItems
            // }, () => { this.props.updateList(this.state) })
        })
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
            })
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
        })
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
                    <h3 className='list-title'>{this.state.listTitle}</h3>
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
    }

    changeSelectedList(e) {
        var newListIndex = parseInt(e.target.getAttribute("data-number"));
        this.props.handleChangeList(newListIndex);
    }

    renderListTitles() {
        return this.props.allLists.map((listObj, index) => <li className={`${this.props.currentList === index ? "current-list-title" : ""}`} key={index} data-number={index} onClick={this.changeSelectedList}>{listObj.listTitle}</li>)
    }

    render() {
        return (
            <div className='side-menu normal blue'>
                <ul className='all-list-titles'>
                    {this.renderListTitles()}
                    <li>+</li>
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
        this.updateList = this.updateList.bind(this);
        this.changeList = this.changeList.bind(this);
        this.state = {
            selectedListIndex: 0,
            allLists: [
                {
                    listTitle: "To Do",
                    listItems: [],
                    completedItems: []
                }
            ]
        }
    }

    updateList(listObject) {
        var allListsAsString = JSON.stringify(this.state.allLists);
        var allLists = JSON.parse(allListsAsString);
        for (var i = 0; i < allLists.length; i++) {
            if (allLists[i].listTitle === listObject.listTitle) {
                allLists[i] = listObject
            }
        }
        this.setState({
            allLists: allLists
        })
    }

    changeList(newListIndex) {
        this.setState({
            selectedListIndex: newListIndex
        })
    }

    renderLists() {
        return this.state.allLists.map((list, index) => <List key={index} listObj={list} updateList={this.updateList} visible={this.state.selectedListIndex === index ? true : false} />)
    }

    render() {
        return (
            <div>
                <TopMenu />
                <SideMenu allLists={this.state.allLists} currentList={this.state.selectedListIndex} handleChangeList={this.changeList} />
                <div className='current-list light blue'>
                    {this.renderLists()}
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