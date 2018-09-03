'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Table extends React.Component {

  static propTypes = {
    base: PropTypes.number.isRequired,
    upTo: PropTypes.number.isRequired,
    random: PropTypes.bool.isRequired
  }

  static defaultProps = {
    upTo: 12,
    random: true
  }

  constructor(props) {
    super(props);
    this.state = {
      attempts: [],
      currentAttempt: [],
      attempting: 0
    }
    this.clickNext = this.clickNext.bind(this);
  }

  get isComplete() {
    return !this.state.currentAttempt.length;
  }

  componentDidMount() {
    this.start();
  }

  newAttempt() {
    const { upTo } = this.props;
    const currentAttempt = new Array(upTo).fill(null).map((v, i) => i + 1)
    const attempts = this.state.attempts.concat([{
      correct: [],
      incorrect: []
    }])
    this.setState({
      currentAttempt,
      attempts 
    })
  }

  start() {
    this.newAttempt();
    // console.log('start with state', this.state);
    // this.next();
  }

  clickNext(e) {
    e.preventDefault();
    this.next();
  }

  next() {
    let currentAttempt = this.state.currentAttempt.concat([]);
    let i = this.props.random ? Math.floor(Math.random() * currentAttempt.length - 1) + 1 : 0;
    // debugger;
    let attempting = currentAttempt.splice(i, 1)[0]
    this.setState({
      attempting,
      currentAttempt
    })
    console.log('this.state.curretAttempt', this.state.currentAttempt);
  }

  mark(correct=true) {
    const update = (correct) ? 'correct' : 'incorrect';
    this.attempts[this.attempts.lastIndexOf][update].push(this.attempting);
  }

  render() {
    const { base } = this.props;
    const { attempting } = this.state;
    return <div className="card">
      <div className="problem">{attempting} x {base}</div>
      <div className="answer">{ attempting * base }</div>
      <button onClick={ this.clickNext } disabled={ this.isComplete }>NEXT</button>
    </div>
  }
}

class App extends React.Component {
  render() {
    return <Table base={5}/>
  }
}

ReactDOM.render(<App/>, document.getElementById('content'));