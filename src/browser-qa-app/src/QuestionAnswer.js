import React, { useState } from 'react';
import Link from '@material-ui/core/Link';
import Title from './Title';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import './QuestionAnswer.css';
// import Plot from 'react-plotly.js';

function preventDefault(event) {
    event.preventDefault();
}

export default function QuestionAnswer() {
    // Functional Component using States
    // https://stackoverflow.com/questions/46821699/react-functional-component-using-state/53780465

    // Reference for text input
    const input = React.createRef();
    const loading = React.createRef();

    // Default placeholder values
    const [keywords, setKeywords] = useState([
        '[CLS]',
        '[SEP]',
        'Tokens',
        'Comma',
    ]);
    const [scores, setScores] = useState([2, 5, 3, 10]);
    const [suggestions, setSuggestions] = useState(['Coronavirus']);
    const [answers, setAnswers] = useState([
        {
            id: 0,
            score: 0.687,
            url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5028948/',
            title:
                'Cats are not small dogs: is there an immunological explanation for why cats are less affected by arthropod-borne disease than dogs?',
            abstract:
                'It is widely recognized that cats appear to be less frequently affected by arthropod-borne infectious diseases than dogs...',
        },
    ]);

    function handleSubmit(event) {
        if (input.current.value.length == 0) {
            console.log('no input');
            input.current.style.borderColor = 'darkred';
            return;
        }
        input.current.style.borderColor = 'lightgray';
        preventDefault(event); // avoids refreshing page after submit
        updateAnswers(input.current.value);
    }

    function handleClick(event) {
        // Only update answers when u click a button
        if (event.target.value) {
            updateAnswers(event.target.value);
        }
    }

    function updateAnswers(input) {
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };
        loading.current.style.opacity = 1;
        fetch('/query/' + input, headers)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                let newAnswers = [];
                let context = '';
                let i;
                for (i = 0; i < 5; i++) {
                    let row = {
                        id: i,
                        score: json.score[i],
                        url: json.url[i],
                        title: json.title[i],
                        abstract: json.abstract[i],
                    };
                    newAnswers.push(row);
                    context = context + '. ' + json.abstract[i];
                }
                // Update Answers in the tables
                setAnswers(newAnswers);
                // Update suggestions based on context
                updateSuggestions(context);
                // Update keywords based on question and context
                updateKeywords(input, context);

                loading.current.style.opacity = 0;
            });
    }

    function updateSuggestions(context) {
        // TODO: Fix me later
        // Suggestions User interface problem
        // Sometimes when we get empty suggestions => unique key error because the
        // current keys are just the text values.
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };
        fetch('/rolling_questions/' + context, headers)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                console.log(json);
                let j;
                let newSuggestions = [];
                for (j = 0; j < 5; j++) {
                    if (json.questions[j] != '') {
                        newSuggestions.push(json.questions[j]);
                    }
                }
                setSuggestions(newSuggestions);
            });
    }

    function updateKeywords(question, context) {
        console.log(question);
        console.log(context);
        fetch('/visualize/' + question + '/' + context, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                console.log(json);
                setKeywords(json.keywords);
                setScores(json.scores);
            });
    }

    return (
        <React.Fragment>
            <Title>Search</Title>
            <form id="question-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="What effect does COVID-19 have on pets?"
                    ref={input}
                />
                <div className="btn-wrapper">
                    <Link color="primary" onClick={handleSubmit}>
                        Search
                    </Link>
                    <div id="loading" ref={loading}>
                        <CircularProgress
                            id="asdf"
                            size="2rem"
                            color="secondary"
                        />
                    </div>
                </div>
            </form>

            <br />
            <br />

            <Title>Keywords</Title>
            {/* <Plot
                data={[{ type: 'bar', x: keywords, y: scores }]}
                layout={{ width: 1080, height: 256, title: 'Scores' }}
            /> */}

            <br />
            <br />

            <Title>Answers</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: '10%' }}>Score:</TableCell>
                        <TableCell style={{ width: '20%' }}>URL:</TableCell>
                        <TableCell style={{ width: '20%' }}>Title:</TableCell>
                        <TableCell style={{ width: '50%' }}>
                            Abstract:
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {answers.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.score}</TableCell>
                            <TableCell>{row.url}</TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.abstract}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <br />
            <br />

            <Title>Suggestions</Title>
            {suggestions.map((suggestion) => (
                <div className="btn-suggestion">
                    <input
                        key={suggestion}
                        type="button"
                        value={suggestion}
                        onClick={(e) => handleClick(e, 'value')}
                    />
                </div>
            ))}

            <br />
            <br />
        </React.Fragment>
    );
}
