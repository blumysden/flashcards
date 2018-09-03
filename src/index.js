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
    const methods = ['clickNext', 'reveal', 'markRight', 'markWrong', 'clickStart', 'clickDoWrongs']
    this.state = this.defaultState;
    methods.forEach((n) => {
      this[n] = this[n].bind(this);
    })
  }

  get isComplete() {
    const lastAttempt = this.lastAttempt;
    return !this.state.currentAttempt.length && (!lastAttempt || lastAttempt.correct.length + lastAttempt.incorrect.length === this.props.upTo);
  }

  get lastAttempt() {
    const { attempts } = this.state
    return attempts[attempts.length - 1];
  }

  get defaultState() {
    return Object.assign({}, {
      attempts: [],
      currentAttempt: [],
      attempting: 0,
      waiting: false
    })
  }

  componentDidMount() {
    this.start();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.base != this.props.base) {
      this.reset();
    }
  }

  reset() {
    this.setState(this.defaultState);
    this.start();
  }

  newAttempt(retry) {
    const { upTo } = this.props;
    const { correct=[], incorrect } = retry || {}
    const currentAttempt = incorrect || new Array(upTo).fill(null).map((v, i) => i + 1)
    const attempts = this.state.attempts.concat([{
      correct,
      incorrect: []
    }])
    this.setState({
      currentAttempt,
      attempts 
    })
  }

  start(attempt) {
    this.newAttempt(attempt);
    window.setTimeout(() => {
      this.next();
    },0)
  }

  clickStart(e) {
    e.preventDefault();
    this.start();
  }

  clickNext(e) {
    e.preventDefault();
    this.next();
  }

  clickDoWrongs(e) {
    e.preventDefault();
    this.start(Object.assign({}, this.lastAttempt))
  }

  reveal(e) {
    e.preventDefault()
    this.setState({waiting: false})
  }

  next() {
    let currentAttempt = this.state.currentAttempt.concat([]);
    let i = this.props.random ? Math.floor(Math.random() * currentAttempt.length - 1) + 1 : 0;
    let attempting = currentAttempt.splice(i, 1)[0]
    this.setState({
      attempting,
      currentAttempt,
      waiting: true
    })
  }

  markRight(e) {
    e.preventDefault()
    this.mark(true);
    this.next();
  }

  markWrong(e) {
    e.preventDefault()
    this.mark(false);
    this.next();
  }

  mark(correct=true) {
    const attempts = this.state.attempts.concat([]);
    const update = (correct) ? 'correct' : 'incorrect';
    attempts[attempts.length - 1][update].push(this.state.attempting);
    this.setState({ attempts })
  }

  renderReveal() {
    if (this.state.waiting) {
      return <button onClick={ this.reveal }>REVEAL ANSWER</button>
    } else {
      return null;
    }
  }

  renderResult() {
    if (!this.isComplete && !this.state.waiting) {
      return <React.Fragment>
        <button className="correct" onClick={ this.markRight }>I was right!</button>
        <button className="incorrect" onClick={ this.markWrong }>I was wrong.</button>
      </React.Fragment>
    } else {
      return null;
    }
  }

  renderStart(text='START') {
    return <button onClick={ this.clickStart }>{ text }</button>
  }

  renderScore() {
    const lastAttempt = this.lastAttempt
    if (this.isComplete && lastAttempt) {
      return <div>
          <p>You got { lastAttempt.correct.length } right, and { lastAttempt.incorrect.length } wrong.</p>
          { (lastAttempt.incorrect.length) ?
            <button onClick={ this.clickDoWrongs }>Redo Incorrect Answers</button> : null
          }
          { this.renderStart('Start over') }
        </div>
    } else {
      return null;
    }
  }

  renderProblem() {
    if (!this.isComplete) {
      const { base } = this.props;
      const { attempting, waiting } = this.state;
      return <React.Fragment>
        <div className="problem">{base} x {attempting}</div>
        <div className="answer">{ (waiting) ? '???' : attempting * base }</div>
      </React.Fragment>
    } else {
      return null;
    }
  }

  render() {
    return <div className="card">
      { this.renderProblem() }
      { this.renderReveal() }
      { this.renderResult() }
      { this.renderScore() }
    </div>
  }
}

class App extends React.Component {
  static propTypes = {
    upTo: PropTypes.number.isRequired
  }

  static defaultProps = {
    upTo: 20
  }

  constructor(props) {
    super(props);
    this.toc = new Array(props.upTo).fill(null).map((v, i) => i + 1)
    this.state = {
      table: 1
    }
    this.selectTable = this.selectTable.bind(this)
  }

  selectTable(e) {
    let table = e.target.getAttribute('data-table')
    this.setState({table: parseInt(table)})
  }

  render() {
    let upTo = (this.state.table > 12) ? this.state.table : 12;
    return <div>
      <nav>
        { this.toc.map(i => <span onClick={ this.selectTable } key={ `choose-${i}`} data-table={i}>{i}</span>) }
      </nav>
      <Table base={this.state.table} upTo={upTo}/>
    </div>
  }
}

ReactDOM.render(<App/>, document.getElementById('content'));