import React, {useState}  from 'react';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import Answers from './Answers';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';

function preventDefault(event) {
    event.preventDefault();
}
  
const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
});

const AddButon = ({addData}) => {
  return <button onClick={addData}>Add Data</button>
}

const ResetButon = ({resetState}) => {
  return <button onClick={resetState}>Reset</button>
}

export default function QuestionAnswer() {
    const classes = useStyles();
    const input = React.createRef();

    function handleSubmit(event) {
      preventDefault(event);
      const question = input.current.value;

      let context = "";
      fetch('/query/'+question)
        .then(response => {
          return response.json()
        })
        .then(json => {
          // console.log(json.abstract[0])
          console.log(json)
          let newData = [];
          let i;
          for (i = 0; i < 5; i++) {
            let row = {
              id: i,
              score: json.score[i],
              paragraph: json.paragraph[i],
              paper_id: json.url[i],
              title: json.title[i],
              abstract: json.abstract[i]
            }
            newData.push(row);
            context = context + ". " + json.abstract[i];
            // context.push(json.abstract[i]);
          }
          setData(newData);
          // Based on Context, generate questions
          console.log(context);

          fetch('/rolling_questions/' + context)
            .then(response => {
              return response.json()
            })
            .then(json => {
              console.log(json)
              // let j;
              // let newSuggestions = [];
              // for (j = 0; j < 3; j++) {
              //   newSuggestions.push(json.questions[j]);
              // }
              // setSuggestions(newSuggestions);
            });
        })
    }

    function handleClick(event) {
      let question = event.target.value;
      //  Post to Flask
      fetch('/query/'+question)
        .then(response => {
          return response.json()
        })
        .then(json => {
          console.log(json)
          let newData = [];
          let i;
          for (i = 0; i < 5; i++) {
            let row = {
              id: i,
              score: json.score[i],
              paragraph: json.paragraph[i],
              paper_id: json.url[i],
              title: json.title[i],
              abstract: json.abstract[i]
            }
            newData.push(row);
          }
          setData(newData);
        });
    }

    const [suggestions, setSuggestions] = useState([
      'What is Covid',
      'Where is China'
    ]);

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
      <Title>Question</Title>
      <form onSubmit={handleSubmit}>
        <TextField type="text" label="" ref={input}/>
      </form>
      <Link color="primary" onClick={handleSubmit}>
        Ask
      </Link>
      <br/>
      <Title>Suggestions</Title>
      {suggestions.map((question) => (
        <input
        type="button"
        value={question}
        onClick={e => handleClick(e, "value")}
        />
      ))}
      <br/>
      <Title>Answers</Title>
      <div>
        <AddButon addData={addData} />
        <ResetButon resetState={resetState} />
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{width: '10%'}}>Score:</TableCell>
            {/* <TableCell style={{width: '10%'}}>Paper ID:</TableCell> */}
            <TableCell style={{width: '20%'}}>Paragraph:</TableCell>
            <TableCell style={{width: '20%'}}>Title:</TableCell>
            <TableCell style={{width: '50%'}}>Abstract/Paper ID:</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.score}</TableCell>
              {/* <TableCell>{row.paper_id}</TableCell> */}
              <TableCell>{row.paragraph}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.abstract} || {row.paper_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
    );
}