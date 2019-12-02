const mocha = require('mocha')
const describe = mocha.describe
const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const sinon = require("sinon")


const transitionTable = {
  'S0': {'0': 'S0', '1': 'S1'},
  'S1': {'0': 'S2', '1': 'S0'},
  'S2': {'0': 'S1', '1': 'S2'}
}

const stateMachineOptions = {

  states: ['S0', 'S1', 'S2'],
  alphabet: ['0', '1'],
  startState: 'S0',
  delimiter: '',
  finalStateValues: {'S0': '0', 'S1': '1', 'S2': '2'},
  invalidDataErrorStr: 'invalid data',
  transitionTable: transitionTable,
  emptyInputIsValid: false,
  output: function (...data) {
    console.log(...data)
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


describe('stateMachine tests - configuration : dividing a number by 3', function () {
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

  it('should print 0 given the input of 110', function (done) {

    const inputString = '110'
    const expectedResult = '0'
    stateMachine.processInput(inputString)

    expect(stateMachineOptions.output.calledOnce).to.be.true
    expect(stateMachineOptions.output.firstCall.args[0]).to.equal(expectedResult)

    done()

  })

  it('should print 1 given the input of 1010', function (done) {

    const inputString = '1010'
    const expectedResult = '1'
    stateMachine.processInput(inputString)

    expect(stateMachineOptions.output.calledOnce).to.be.true
    expect(stateMachineOptions.output.firstCall.args[0]).to.equal(expectedResult)

    done()

  })

  it('should print 1 given the input of 1', function (done) {

    const inputString = '1'
    const expectedResult = '1'
    stateMachine.processInput(inputString)

    expect(stateMachineOptions.output.calledOnce).to.be.true
    expect(stateMachineOptions.output.firstCall.args[0]).to.equal(expectedResult)

    done()

  })

  it('should print 0 given the input of 000', function (done) {

    const inputString = '000'
    const expectedResult = '0'
    stateMachine.processInput(inputString)

    expect(stateMachineOptions.output.calledOnce).to.be.true
    expect(stateMachineOptions.output.firstCall.args[0]).to.equal(expectedResult)

    done()

  })

  it('should print invalid data given en empty input and option.emptyInputIsValid is set to false', function (done) {

    //note : for a state machine that gives the  remainder when dividing a number by 3
    // the empty input should be considered invalid data

    const inputString = ''
    const expectedResult = stateMachineOptions.invalidDataErrorStr
    stateMachine.processInput(inputString)

    expect(stateMachineOptions.output.calledOnce).to.be.true
    expect(stateMachineOptions.output.firstCall.args[0]).to.equal(expectedResult)

    done()

  })


})


