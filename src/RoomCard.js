import React from 'react';
import { Card, CardContent, CardActions, Button, Typography, Box } from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {Link} from 'react-router-dom';

export class RoomCard extends React.Component {

	render() {
		return (
			<Box p={1}>
			<Card>
				<CardContent>
					<Typography variant="h5" component="h2">
						Room - {this.props.id}
					</Typography>
					<Typography color="textSecondary" gutterBottom>
						{this.props.users} / {this.props.maxUsers}
					</Typography>
				</CardContent>
				<CardActions>
					<Button color="primary" endIcon={<ExitToAppIcon />} component={Link} to={"/chat/" + this.props.id} disabled={this.props.users === this.props.maxUsers}>
						Join
					</Button>
				</CardActions>
			</Card>
			</Box>
		);
	}
};

export class RoomCardSkeleton extends React.Component {
	render() {
		return (
			<Box p={1}>
				<Card>
				<CardContent>
					<React.Fragment>
						<Skeleton height={24} width={150}/>
						<Skeleton height={14} width={80} />
					</React.Fragment>
				</CardContent>
				</Card>
			</Box>
		);
	}
}