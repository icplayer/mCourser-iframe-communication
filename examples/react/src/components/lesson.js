import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import communication from '../communication/communication';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import config from '../config.json';

const useStyles = makeStyles((theme) =>
    createStyles({
        wrapper: {
            margin: theme.spacing(1),
            position: 'relative',
            cursor: 'pointer'
        },
        buttonProgress: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -50,
            marginLeft: -50,
        },
    }),
);

function Lesson(props) {
    const classes = useStyles();
    const onClick = React.useCallback(() => {
        communication.requestOpenLesson(props.lesson.id);
    }, [props.lesson]);

    return <React.Fragment>
        <div className={classes.wrapper} onClick={onClick}>
            <Avatar src={`${config['APPLICATION_BASE_URL']}${props.lesson.icon}`} style={{ width: 80, height: 80 }} />
            <CircularProgress variant="static" value={props.lesson.score} className={classes.buttonProgress} size={100} />
        </div>
        <Typography variant="subtitle2" gutterBottom>
            {props.lesson.name}
        </Typography>
    </React.Fragment>
}


export default Lesson;