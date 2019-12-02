/*
/////////////////////////////////////////////////////////////////////////////////////////
** Design and assumptions **

- the state machine is designed to be configured via an option object, supplied at construction time,
  this configuration can be changed later by calling its loadDefinitions method
- the state machine allows the user flexibility to define transition logic and other aspects
- the stateMachine runs a basic validation on the options object,
  this validation can be further enhanced depending on requirements
- the input is a string  ( with no spaces ),  there is an option to specify a delimiter
- emptyInputIsValid:  ( false / true) ,  if true an empty input will be processed
  using the transition logic, if false an empty input will produce 'invalid data'
- for each new call to processInput the state machine starts at the startState
- the stateMachine dose some basic validation on the options object,
  this validation can be further enhanced depending on requirements
- as per assignment requirements the stateMachine prints its output,
  I addressed this by having it call a output function that is part of the option object,
  the user can supply a function that will receive the output and preform the printing that
  is adequate for their platform

/////////////////////////////////////////////////////////////////////////////////////////
* */



module.exports = function stateMachineModule(options) {

  let _options = _loadAndVerifyDefinitions(options)

  function _isEmpty(str) {
    return (!str || 0 === str.length)
  }

  function _isStateFinal(state) {
    return _options.finalStateValues[state] !== undefined
  }

  function _loadAndVerifyDefinitions(options) {
    let finalOptions = Object.assign({},options)

    //verify options
    if(finalOptions.states.indexOf(finalOptions.startState) === -1){
      throw new Error('options.startState not in states')
    }

    Object.keys(finalOptions.finalStateValues).forEach((key)=>{
      if(finalOptions.states.indexOf(key) === -1){
        throw new Error('options.endState not in states')
      }
    })

    if (typeof finalOptions.output !== 'function'){
      throw new Error('options.output is not a function')
    }
    if (typeof finalOptions.transition !== 'function'){
      throw new Error('options.transition is not a function')
    }

    return finalOptions
  }


  return {
    //Loads an option object, will internally also verify this options object
    loadDefinitions: function (options) {
      _options = _loadAndVerifyDefinitions(options)
    },
    // process a given string composed of alphabet symbols, for each preform a transition by
    // calling the transition function ( options.transition )
    // when entire input is processed , this method calls the output function with either
    // the value of a final state or the string defined in options.invalidDataErrorStr
    processInput: function (input) {

      if (!_options.emptyInputIsValid && _isEmpty(input)) {
        _options.output( _options.invalidDataErrorStr)
        return
      }

      const inputArray = input.split(_options.delimiter)

      const reduceResults = inputArray.reduce((accumulator, currentInputAlphabet) => {

        let stepResult = _options.transition(accumulator.currentState, currentInputAlphabet, _options.transitionTable)

        if (stepResult.error !== null) {
          throw new Error(`${stepResult.error}, currentState : ${accumulator.currentState}, input alphabet : ${currentInputAlphabet}, at index: ${accumulator.nextIndex} of input : ${input}`)
        }

        return {
          currentState: stepResult.nextState,
          nextIndex: accumulator.nextIndex + 1
        }

      }, {
        currentState: _options.startState,  //accumulator initialized to startState
        nextIndex: 0
      })


      if (!_isStateFinal(reduceResults.currentState)) {
        _options.output(_options.invalidDataErrorStr)
      } else {
        _options.output(_options.finalStateValues[reduceResults.currentState])
      }
    }
  }
}
