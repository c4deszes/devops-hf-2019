import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import {AppBar, Typography, IconButton, Toolbar, Fab, TextField} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SendIcon from '@material-ui/icons/Send';
import {Link} from 'react-router-dom';

const styles = theme => ({
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

import { useHistory } from 'react-router-dom';

class Chat extends React.Component {

	componentDidMount() {
		const id = this.props.match.params.id;
		let url = new URL('/r/' + id + '/chat', window.location.href);
		url.protocol = url.protocol.replace('http', 'ws');

		let ws = new WebSocket(url.href);

		ws.onopen = () => {
			this.setState({ws: ws});
		}
		
		ws.onmessage = (event) => {
			const message = event.data;
			console.log('Received:' + message);
		}

		ws.onerror = (error) => {
			useHistory().push("/");
		}

		ws.onclose = () => {
			useHistory().push("/");
		}
	}

	componentWillUnmount() {
		this.state.ws.close();
	}

	send() {
		this.state.ws.send(this.state.message);
	}

	handleChange(event) {
		this.setState({message: event.target.value});
	}

	render() {
		const id = this.props.match.params.id;
		const {classes} = this.props;
		return (
			<div>
				<AppBar position="static">
					<Toolbar>
						<IconButton aria-label="back" size="medium" component={Link} to="/">
							<ArrowBackIcon />
						</IconButton>
						<Typography variant="h6">
							Chat - {id}
						</Typography>
					</Toolbar>
				</AppBar>

				<div className={classes.message_bar}>
					<TextField label="Send message" variant="outlined" className={classes.message_field} onchange={(event) => this.handleChange(event)} />
					<Fab color="primary" size="large" className={classes.message_button} onclick={() => this.send()}>
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

export default withStyles(styles)(Chat);