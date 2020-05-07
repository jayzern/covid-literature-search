// import React from 'react';
import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

function preventDefault(event) {
    event.preventDefault();
}
  
const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
});

export default function Example() {
    const classes = useStyles();
    const [currentTime, setCurrentTime] = useState(0);
    useEffect(() => {
        fetch('/time').then(res => res.json()).then(data => {
        setCurrentTime(data.time);
        });
    }, []);
    return (
    <React.Fragment>
        <Title>Example: Flask API usage</Title>
        <Typography component={"p"} variant={"h6"}>
        Time: {currentTime}.
        </Typography>
        <Typography color="textSecondary" className={classes.depositContext}>
        Just a subtitle passing by... don't mind me! :o
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Do something!
        </Link>
      </div>
    </React.Fragment>
    );
}