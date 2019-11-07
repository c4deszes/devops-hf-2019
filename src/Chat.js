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

class Chat extends React.Component {

	componentWillMount() {
		//try connecting to websocket
	}

	componentWillUnmount() {
		//disconnect
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
					<TextField label="Send message" variant="outlined" className={classes.message_field} />
					<Fab color="primary" size="large" className={classes.message_button}>
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