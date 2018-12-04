class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.removeItem = this.removeItem.bind(this);
        this.state = {
            completed: false,
            starred: false,
            itemObj: this.props.itemObj
        }
    }

    removeItem() {
        this.props.handleRemoveItem(this.state.itemObj);
    }

    render() {
        return (
            <div className='card'>
                <div className='card-body'>
                    <label>
                        <span><input type='checkbox' className='add-item'/></span>
                        <span>{this.state.itemObj.task}</span>
                        <span className="edit-item" onClick={this.removeItem}>
                            <div className="edit-item-dot"></div>
                            <div className="edit-item-dot"></div>
                            <div className="edit-item-dot"></div>
                        </span>
                    </label>
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
                task: this.input.value,
                id: Date.now()
            }
            this.props.handleAdd(newItem);
            this.input.value = "";
        }
        
    }

    render() {
        return (
            <div className='card'>
                <div className='card-body'>
                    <input type='text' placeholder='Add a new task...' className='add-item' ref={(input) => this.input = input} onKeyUp={this.createListItem}/>
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
        this.state = {
            listItems: []
        }
    }

    addItemToList(item) {
        var allItemsAsString = JSON.stringify(this.state.listItems);
        var allItems = JSON.parse(allItemsAsString);
        allItems.push(item);
        this.setState({
            listItems: allItems
        })
    }

    removeItemFromList(item) {
        var allItemsAsString = JSON.stringify(this.state.listItems);
        var allItems = JSON.parse(allItemsAsString);
        var allItemsExceptRemovedOne = allItems.filter((task) => task.id !== item.id);
        this.setState({
            listItems: allItemsExceptRemovedOne
        })
    }

    render() {
        return (
            <div className='list'>
                <h3 className='list-title'>To Do</h3>
                <AddListItem handleAdd={this.addItemToList} />
                <div className='list-items'>
                    {this.state.listItems.map(item => <ListItem key={item.id} itemObj={item} handleRemoveItem={this.removeItemFromList}/>)}
                </div>
            </div>
        )
    }
}

class SideMenu extends React.Component {
    render() {
        return (
            <div className='side-menu normal blue'>
                <ul className='all-list-titles'>
                    <li className='dark blue'>To Do</li>
                    <li>Completed</li>
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
    render() {
        return (
            <div>
                <TopMenu />
                <SideMenu />
                <div className='current-list light blue'>
                    <List />
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