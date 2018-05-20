import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import { countryCodes } from 'tools/countries'
import { withStyles } from '@material-ui/core/styles'
import { getCountryNameFromCode, getCountryCodeFromName } from '../../tools/countries'

const suggestions = countryCodes.map(item => ({
  label: item.value,
}))

function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps

  return (
    <TextField
      fullWidth
      label="Country"
      InputProps={{
        inputRef: ref,
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  )
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query)
  const parts = parse(suggestion.label, matches)

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(
          (part, index) =>
            part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </strong>
            ),
        )}
      </div>
    </MenuItem>
  )
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  )
}

function getSuggestionValue(suggestion) {
  return suggestion.label
}

function getSuggestions(value) {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length
  let count = 0

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep = count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue

        if (keep) {
          count += 1
        }

        return keep
      })
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 250,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
})

class CountrySuggest extends React.Component {
  state = {
    value: '',
    suggestions: [],
  }

  componentWillMount() {
    const value = this.props.field.value

    if (value) {
      this.setState({ value })
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { field } = this.props

    if (field.value !== nextProps.field.value) {
      this.setState({ value: getCountryNameFromCode(nextProps.field.value) })
    }
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    })
  }

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    })

    const value = getCountryCodeFromName(newValue)

    this.props.form.setFieldValue(this.props.field.name, value)
  }

  render() {
    const { classes, field, onChange, onBlur } = this.props

    return (
      <div>
        <input type="hidden" value={field.value} />
        <Autosuggest
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderInputComponent={renderInput}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          renderSuggestionsContainer={renderSuggestionsContainer}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            classes,
            placeholder: 'Search a country',
            value: this.state.value,
            onChange: this.handleChange,
            onBlur: this.props.onBlur,
            name: field.name,
            id: field.id,
          }}
        />
      </div>
    )
  }
}

CountrySuggest.propTypes = {
  classes: PropTypes.object.isRequired,
  field: PropTypes.any.isRequired,
  form: PropTypes.any.isRequired,
  onBlur: PropTypes.func.isRequired,
}

export default withStyles(styles)(CountrySuggest)
