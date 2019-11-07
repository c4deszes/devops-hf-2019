import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles, withStyles} from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import {AppBar, Typography, IconButton, Toolbar, Fab, Box, Card, CardContent} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';

import {RoomCard, RoomCardSkeleton} from './RoomCard';

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	title: {
		flexGrow: 1
	},
	fab: {
		position: 'absolute',
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	}
});

class Room {
	ID; 
	users;
	maxUsers;
}

const STATIC_ROOMS = [
	{ID: "dadascy", users: 2, maxUsers: 3},
	{ID: "dsadads", users: 0, maxUsers: 3},
	{ID: "cycyfjl", users: 1, maxUsers: 3},
	{ID: "hdlslfa", users: 3, maxUsers: 3}
];

const axios = require('axios');

class Home extends React.Component {

	constructor(props) {
		super(props);

		//try restoring state
	}

	updateRooms = () => {
		this.setState({rooms: null});
		setTimeout(() => {
		axios.get('http://127.0.0.1:3000/api/rooms')
			 .then((response) => {
				 //store state
				 this.setState({rooms: response.data});
			 });
			}, 1000);
	}

	componentWillMount() {
		this.updateRooms();
	}

	renderRooms(rooms) {
		let views = [];
		for(let i=0;i<rooms.length;i++) {
			views.push(
				<RoomCard id={rooms[i].ID} users={'X'} maxUsers={'Y'} />
			);
		}
		return views;
	}

	renderLoading() {
		let views = [];
		for(let i=0;i<10;i++) {
			views.push(
				<RoomCardSkeleton />
			);
		}
		return views;
	}

	render() {
		const {classes} = this.props;
		return (
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Rooms
						</Typography>
						<IconButton aria-label="refresh" size="medium" onClick={this.updateRooms}>
							<RefreshIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
	
				<Box 
					display="flex" 
					flexWrap="wrap" 
					alignItems="flex-start"
					p={1} 
					m={1} 
					css={{maxWidth:'100%', height: 200}}>
	
					{this.state.rooms ? this.renderRooms(this.state.rooms) : this.renderLoading()}
				</Box>
	
				<Fab color="primary" size="large" className={classes.fab}>
					<AddIcon />
				</Fab>
			</div>
		);
	}
}

Home.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);