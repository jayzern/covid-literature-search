import React, {useState}  from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Title from './Title';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Plot from 'react-plotly.js';

function preventDefault(event) {
    event.preventDefault();
}
  
const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
});

export default function QuestionAnswer() {

    // Functional Component using States
    // https://stackoverflow.com/questions/46821699/react-functional-component-using-state/53780465

    const classes = useStyles();
    const input = React.createRef();

    function handleSubmit(event) {
      preventDefault(event);
      const question = input.current.value;
      updateAnswers(question);
    }

    function handleClick(event) {
      let question = event.target.value;
      updateAnswers(question);
    }

    function updateAnswers(question) {
      fetch('/query/'+question, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      })
      .then(response => {
        return response.json()
      })
      .then(json => {
        let newData = [];
        let context = "";
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
        }
        setData(newData);
        updateSuggestions(context)
      })
    }

    function updateSuggestions(context) {
      fetch('/rolling_questions/' + context, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      })
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log(json)
        let j;
        let newSuggestions = [];
        for (j = 0; j < 5; j++) {
          if (json.questions[j] != "") {
            newSuggestions.push(json.questions[j]);
          }
        }
        setSuggestions(newSuggestions);
      });
    }

    function updateVisuals(question, context) {
      fetch('/visualize', {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      })
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log(json)
      });
    }


    const [suggestions, setSuggestions] = useState([
      'Bayesian Inference for Covid-19'
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

    return (
    <React.Fragment>
      <Title>Question</Title>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={input}
          onClick={handleSubmit}
        />
      </form>
      <Link color="primary" onClick={handleSubmit}>
        Ask
      </Link>
      <Link color="primary" onClick={updateVisuals}>
        Test Button
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
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{width: '10%'}}>Score:</TableCell>
            <TableCell style={{width: '20%'}}>Paragraph:</TableCell>
            <TableCell style={{width: '20%'}}>Title:</TableCell>
            <TableCell style={{width: '50%'}}>Abstract/Paper ID:</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.score}</TableCell>
              <TableCell>{row.paragraph}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.abstract} || {row.paper_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Plot
        data={[
          {type: 'bar', x: ["[CLS]", "[SEP]", "Tokens"], y: [2, 5, 3]},
        ]}
        layout={ {width: 720, height: 300, title: 'A Fancy Plot'} }
      />
    </React.Fragment>
    );
}