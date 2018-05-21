import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'

// https://openweathermap.org/weather-conditions
const getRightId = id => {
  let rightId = id

  // Group 2xx: Thunderstorm
  if (id >= 200 && id <= 299) {
    const heavy = [202, 212, 232]
    rightId = 200

    if (heavy.includes(id)) {
      rightId = 201
    }
  }

  // Group 3xx: Drizzle
  if (id >= 300 && id <= 399) {
    const heavy = [302, 312, 314]
    rightId = 300

    if (heavy.includes(id)) {
      rightId = 301
    }
  }

  // Group 5xx: Rain
  if (id >= 500 && id <= 599) {
    const light = [500, 501, 520, 521, 531]
    rightId = 501

    if (light.includes(id)) {
      rightId = 500
    }
  }

  // Group 6xx: Snow
  if (id >= 600 && id <= 699) {
    // 600 light sleet
    // 601 moderate sleet
    // 602 heavy sleet
    // 603 light snow
    // 604 moderate snow
    // 605 heavy snow
    const lightSleet = [611, 612]
    const moderateSleet = [615]
    const heavySleet = [616]
    const lightSnow = [600, 620, 621]
    const moderateSnow = [601]
    const heavySnow = [602, 622]
    rightId = 600

    if (lightSleet.includes(id)) {
      rightId = 600
    } else if (moderateSleet.includes(id)) {
      rightId = 601
    } else if (heavySleet.includes(id)) {
      rightId = 602
    } else if (lightSnow.includes(id)) {
      rightId = 603
    } else if (moderateSnow.includes(id)) {
      rightId = 604
    } else if (heavySnow.includes(id)) {
      rightId = 605
    }
  }

  // Group 7xx: Atmosphere
  if (id >= 700 && id <= 799) {
    rightId = 700
  }

  // Group 8xx: Clouds
  if (id >= 800 && id <= 899) {
    const heavy = []
    rightId = 800

    if (heavy.includes(id)) {
      rightId = 801
    }
  }

  return rightId
}

class Report extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      icon: '',
    }

    this.initValues = this.initValues.bind(this)
  }

  componentWillMount() {
    this.initValues(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.initValues(nextProps)
  }

  initValues(props) {
    const iconSuffix = props.icon.slice(-1)
    const id = getRightId(props.id)
    const icon = `${id}${iconSuffix}`

    this.setState({ icon })
  }

  render() {
    return (
      <div className="Report">
        <div className="Report__info">
          <div className="Report__location">{this.props.location}</div>
          <div className="Report__temperature">{`${Math.floor(this.props.temp)}°`}</div>
          <img className="Report__icon" src={`assets/image/weather/${this.state.icon}.png`} alt="" />
        </div>
      </div>
    )
  }
}

Report.propTypes = {
  temp: PropTypes.number.isRequired,
  location: PropTypes.string.isRequired,
}

export default Report
