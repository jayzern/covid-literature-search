import React from 'react';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
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

export default function Question() {
    const classes = useStyles();
    return (
    <React.Fragment>
        <Title>Question</Title>
        Link:
        <form className={classes.root} noValidate autoComplete="off">
          <TextField id="standard-basic" label="www.wikipedia.com" />
        </form>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField id="standard-basic" label="What is COVID-19?" />
        </form>
      <div>
        <br/>
        <Link color="primary" href="#" onClick={preventDefault}>
          Ask me!
        </Link>
      </div>
    </React.Fragment>
    );
}