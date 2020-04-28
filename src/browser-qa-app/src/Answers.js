import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id, score, paragraph, paper_id, title, abstract) {
  return { id, score, paragraph, paper_id, title, abstract };
}

const rows = [
  createData(
    0,
    0.8452, 
    'what is the causative agent of disease', 
    '92ab5b61b296652be2d16d5b29918ead488e5915', 
    'An evidence-based framework for priority clinical research questions for COVID-19', 
    'background on 31 december 2019 the world health organization china country office was informed of cases of ...'
  ),
  createData(
    1,
    0.8849,
    'how do you identify a virus',
    '347cee909f74ffac599a875b75d46c92f0480c61',
    'Chapter 9 Keeping Track of Viruses',
    '...'
  )
];

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Answers() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Answers</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            
            <TableCell>Paragraph:</TableCell>
            <TableCell>Paper ID:</TableCell>
            <TableCell>Title:</TableCell>
            <TableCell>Abstract:</TableCell>
            <TableCell align="right">Score:</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            // TODO: Create ID to identify Question Answer rows
            <TableRow key={row.id}>
              <TableCell>{row.paragraph}</TableCell>
              <TableCell>{row.paper_id}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell >{row.abstract}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more answers
        </Link>
      </div>
    </React.Fragment>
  );
}