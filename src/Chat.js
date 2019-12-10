import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import {AppBar, Typography, IconButton, Toolbar, Fab, TextField} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SendIcon from '@material-ui/icons/Send';

import { withRouter } from 'react-router-dom';

const styles = theme => ({
	container: {
		position: 'fixed',
		width: '100%',
		height: '100%'
	},
	message_area: {
		margin: theme.spacing(2),
		overflow: 'auto',
		minHeight: '100px',
		maxHeight: 'calc(100% - 168px)',
	},
	message_bar: {
		display: 'flex',
		alignItems: 'flex-start',
		flexGrow: 1,
		position: 'absolute',
		margin: 0,
		bottom: 0,
		left: 0,
		right: 0
	},
	message_field: {
		flexGrow: 1,
		margin: theme.spacing(2)
	},
	message_button: {
		margin: theme.spacing(2),
		marginLeft: 0,
		flexGrow: 0
	}
});

class Chat extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			ws: null,
			message: '',
			messages: []
		};
	}

	componentDidMount() {
		this.connect();
	}

	connect = () => {
		const id = this.props.match.params.id;
		//let url = new URL('/chat', "http://127.0.0.1:8080");
		let url = new URL('/r/' + id + '/chat', window.location.href);
		url.protocol = url.protocol.replace('http', 'ws');

		var ws = new WebSocket(url.href);

		ws.onopen = () => {
			this.receive("Connected.");
			this.setState({ws: ws});
		}
		
		ws.onmessage = (event) => {
			console.log('Received:' + event.data);
			this.receive(event.data);
		}

		ws.onerror = (error) => {
			console.error(error.message);
			ws.close();
		}

		ws.onclose = () => {
			console.log("Disconnected from room.");
			this.props.history.push("/");
		}
	}

	receive(message) {
		var messages = this.state.messages.concat(message);
		this.setState({ messages: messages});
	}

	send() {
		if(this.state.message.length === 0) {
			return;
		}
		if(this.state.ws) {
			this.state.ws.send(this.state.message);
		}
		this.setState({message: ''});
	}

	handleChange(event) {
		this.setState({message: event.target.value});
	}

	keyDown = (event) => {
		if(event.key === 'Enter') {
			this.send();
		}
	}

	onBack() {
		if(this.state.ws) {
			this.state.ws.close();
		}
		else {
			this.props.history.push("/");
		}
	}

	renderMessages(messages) {
		let views = [];
		for(let i=0;i<messages.length;i++) {
			views.push(
				<p key={i}>{messages[i]}</p>
			);
		}
		return views;
	}

	render() {
		const id = this.props.match.params.id;
		const {classes} = this.props;
		return (
			<div className={classes.container}>
				<AppBar position="static">
					<Toolbar>
						<IconButton aria-label="back" size="medium" onClick={() => this.onBack()}>
							<ArrowBackIcon />
						</IconButton>
						<Typography variant="h6">
							Chat - {id}
						</Typography>
					</Toolbar>
				</AppBar>

				<div className={classes.message_area}>
					{this.renderMessages(this.state.messages)}
				</div>

				<div className={classes.message_bar}>
					<TextField label="Send message" variant="outlined" value={this.state.message} className={classes.message_field} onKeyDown={this.keyDown} onChange={(event) => this.handleChange(event)} />
					<Fab color="primary" size="large" className={classes.message_button} onClick={() => this.send()} disabled={!this.state.ws} >
						<SendIcon />
					</Fab>
				</div>
			</div>
		);
	}
}

Chat.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Chat));