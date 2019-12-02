const mocha = require('mocha')
const describe = mocha.describe
const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const sinon = require("sinon")


const transitionTable = {
  'X0': {'0': 'X0', '1': 'X1'},
  'X1': {'0': 'X2', '1': 'X0'},
  'X2': {'0': 'X1', '1': 'X2'}
}

const stateMachineOptions = {

  states: ['X0', 'X1', 'X2'],
  alphabet: ['0', '1'],
  startState: 'X0',
  delimiter: '',
  finalStateValues: {'X0': '0', 'X1': '1', 'X2': '2'},
  invalidDataErrorStr: 'invalid data',
  transitionTable: transitionTable,
  emptyInputIsValid: false,
  output: function (...data) {
    console.log(data)
  },
  transition: function (currentState, inputAlphabet, transitionTable) {
    const stateDef = transitionTable[currentState]
    let nextState = undefined
    let error = null
    if (stateDef !== undefined) {
      nextState = stateDef[inputAlphabet]
      if (nextState === undefined) {
        error = 'new state was not found'
      }
    } else {
      error = 'currentState state not found'
    }

    return {
      current: currentState,
      inputAlphabet,
      error,
      nextState
    }
  }
}


describe('test various configurations of the stateMachine', function () {
  let stateMachine

  before(function () {

    // we need to init the stateMachine once before all tests
    //Note : No need to reset state machine between tests ,for each call to
    // processInput the state machine starts at the startState

    stateMachine = require('../src/stateMachine')(stateMachineOptions)

  })


  beforeEach(function () {

    stateMachineOptions.output = sinon.spy()
    stateMachine.loadDefinitions(stateMachineOptions)

  })

  it('should print 0 given an empty input and option emptyInputIsValid set to true', function (done) {

    const alteredStateMachineOptions = Object.assign({}, stateMachineOptions, {emptyInputIsValid: true})
    stateMachine.loadDefinitions(alteredStateMachineOptions)

    const inputString = ''
    const expectedResult = '0'
    stateMachine.processInput(inputString)

    expect(stateMachineOptions.output.calledOnce).to.be.true
    expect(stateMachineOptions.output.firstCall.args[0]).to.equal(expectedResult)

    done()

  })

  it('should print invalid data given input leading to a none final state', function (done) {

    const alteredStateMachineOptions = Object.assign({}, stateMachineOptions, {finalStateValues: {'X2': '2'}})
    stateMachine.loadDefinitions(alteredStateMachineOptions)

    const inputString = '1'
    const expectedResult = alteredStateMachineOptions.invalidDataErrorStr
    stateMachine.processInput(inputString)

    expect(stateMachineOptions.output.calledOnce).to.be.true
    expect(stateMachineOptions.output.firstCall.args[0]).to.equal(expectedResult)

    done()

  })

  it('should throw exception if start state is not in states', function (done) {

    const alteredStateMachineOptions = Object.assign({}, stateMachineOptions, {startState: {'X3': '3'}})

    chai.expect(() => stateMachine.loadDefinitions(alteredStateMachineOptions)).to.throw('options.startState not in states')

    done()

  })

  it('should throw exception if at least one of the end states are not in states', function (done) {

    const alteredStateMachineOptions = Object.assign({}, stateMachineOptions, {finalStateValues: {'X3': '3'}})

    chai.expect(() => stateMachine.loadDefinitions(alteredStateMachineOptions)).to.throw('options.endState not in states')

    done()

  })

  it('should throw exception if options.transition is not a function', function (done) {

    const alteredStateMachineOptions = Object.assign({}, stateMachineOptions, {transition: null})

    chai.expect(() => stateMachine.loadDefinitions(alteredStateMachineOptions)).to.throw('options.transition is not a function')

    done()

  })

  it('should throw exception if options.output is not a function', function (done) {

    const alteredStateMachineOptions = Object.assign({}, stateMachineOptions, {output: null})

    chai.expect(() => stateMachine.loadDefinitions(alteredStateMachineOptions)).to.throw('options.output is not a function')

    done()

  })


  it('should print 0 given the input of "1,1,0" with options.delimiter: "," ', function (done) {

    const alteredStateMachineOptions = Object.assign({}, stateMachineOptions, {delimiter: ','})
    stateMachine.loadDefinitions(alteredStateMachineOptions)

    const inputString = '1,1,0'
    const expectedResult = '0'
    stateMachine.processInput(inputString)

    expect(stateMachineOptions.output.calledOnce).to.be.true
    expect(stateMachineOptions.output.firstCall.args[0]).to.equal(expectedResult)

    done()

  })

})


