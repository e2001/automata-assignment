
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

const stateMachine = require('../src/stateMachine')(stateMachineOptions)

stateMachine.processInput('1010')
