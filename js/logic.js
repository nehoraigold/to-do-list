class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            completed: false,
            starred: false
        }
    }



    render() {
        return (
            <div className='card'>
                <div className='card-body'>
                    <label>
                        <span><input type='checkbox' /></span>
                        <span>Sample list item</span>
                    </label>
                </div>
            </div>

        )
    }
}

class List extends React.Component {
    render() {
        return (
            <div className='list'>
                <h3 className='list-title'>To Do</h3>
                <div className='list-items'>
                    <ListItem />
                    <ListItem />
                    <ListItem />
                    <ListItem />
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