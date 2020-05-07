import React, {useState}  from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import MaterialTable from "material-table";

// TODO: Delete later (old code for placeholders)
// function createData(id, score, paragraph, paper_id, title, abstract) {
//   return { id, score, paragraph, paper_id, title, abstract };
// }
// const rows = [
//   createData(
//     0,
//     0.8452, 
//     'what is the causative agent of disease', 
//     '92ab5b61b296652be2d16d5b29918ead488e5915', 
//     'An evidence-based framework for priority clinical research questions for COVID-19', 
//     'background on 31 december 2019 the world health organization china country office was informed of cases of ...'
//   ),
//   createData(
//     1,
//     0.8849,
//     'how do you identify a virus',
//     '347cee909f74ffac599a875b75d46c92f0480c61',
//     'Chapter 9 Keeping Track of Viruses',
//     '...'
//   )
// ];

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const AddButon = ({addData}) => {
  return <button onClick={addData}>Add Data</button>
}

const ResetButon = ({resetState}) => {
  return <button onClick={resetState}>Reset</button>
}

export default function Answers() {
  const classes = useStyles();

  // Functional Component using States
  // https://stackoverflow.com/questions/46821699/react-functional-component-using-state/53780465

  // Try Material Table
  const [data, setData] = useState([
    {
      id: 0,
      score: 0.8452, 
      paragraph: 'what is the causative agent of disease', 
      paper_id: '92ab5b61b296652be2d16d5b29918ead488e5915', 
      title: 'An evidence-based framework for priority clinical research questions for COVID-19', 
      abstract: 'background on 31 december 2019 the world health organization china country office was informed of cases of ...'
    }
  ]);
  
  const resetState = () => {
    const newData = [
      {
        id: 0,
        score: 0.8452, 
        paragraph: 'what is the causative agent of disease', 
        paper_id: '92ab5b61b296652be2d16d5b29918ead488e5915', 
        title: 'An evidence-based framework for priority clinical research questions for COVID-19', 
        abstract: 'background on 31 december 2019 the world health organization china country office was informed of cases of ...'
      }
    ];
    setData(newData);
  }

  const addData = () => {
    const newData = [
      {
        id: 0,
        score: 0.8452, 
        paragraph: 'what is the causative agent of disease', 
        paper_id: '92ab5b61b296652be2d16d5b29918ead488e5915', 
        title: 'An evidence-based framework for priority clinical research questions for COVID-19', 
        abstract: 'background on 31 december 2019 the world health organization china country office was informed of cases of ...'
      },
      {
        id: 1,
        score: 0.8849,
        paragraph: 'how do you identify a virus',
        paper_id: '347cee909f74ffac599a875b75d46c92f0480c61',
        title: 'Chapter 9 Keeping Track of Viruses',
        abstract: '...'
      }
    ];
    setData(newData);
  }

  return (
    <React.Fragment>
      <Title>Answers</Title>
      <div>
        <AddButon addData={addData} />
        <ResetButon resetState={resetState} />
      </div>
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
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.paragraph}</TableCell>
              <TableCell>{row.paper_id}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.abstract}</TableCell>
              <TableCell>{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* TODO: Delete later (old code) */}
      {/* <Table size="small">
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
            <TableRow key={row.id}>
              <TableCell>{row.paragraph}</TableCell>
              <TableCell>{row.paper_id}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell >{row.abstract}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}

      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          More...
        </Link>
      </div>
    </React.Fragment>
  );
}