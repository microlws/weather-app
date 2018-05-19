import { Button, Card, CardContent, CardMedia, TextField, CardActions, Select, MenuItem } from '@material-ui/core'
import axios from 'axios'
import 'babel-polyfill'
import { Form, Formik } from 'formik'
import React from 'react'
import Map from '../../component/Map'
import Report from '../../component/Report'
import './index.scss'

const API_KEY = 'e79aecff0a08da73f6f6de08be893f7d'

const initialState = {
  notFound: false,
  loading: false,
  data: false,
}

const ctry = {
  AF: 'Afghanistan',
  ALA: 'Aland Islands',
  AL: 'Albania',
  DZ: 'Algeria',
  AS: 'American Samoa',
  AD: 'Andorra',
  AO: 'Angola',
  AI: 'Anguilla',
  AQ: 'Antarctica',
  AG: 'Antigua and Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AW: 'Aruba',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BM: 'Bermuda',
  BT: 'Bhutan',
  BO: 'Bolivia',
  BA: 'Bosnia and Herzegovina',
  BW: 'Botswana',
  BV: 'Bouvet Island',
  BR: 'Brazil',
  VG: 'British Virgin Islands',
  IO: 'British Indian Ocean Territory',
  BN: 'Brunei Darussalam',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  CV: 'Cape Verde',
  KY: 'Cayman Islands',
  CF: 'Central African Republic',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  HK: 'Hong Kong, SAR China',
  MO: 'Macao, SAR China',
  CX: 'Christmas Island',
  CC: 'Cocos (Keeling) Islands',
  CO: 'Colombia',
  KM: 'Comoros',
  CG: 'Congo (Brazzaville)',
  CD: 'Congo, (Kinshasa)',
  CK: 'Cook Islands',
  CR: 'Costa Rica',
  CI: "Côte d'Ivoire",
  HR: 'Croatia',
  CU: 'Cuba',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  ET: 'Ethiopia',
  FK: 'Falkland Islands (Malvinas)',
  FO: 'Faroe Islands',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GF: 'French Guiana',
  PF: 'French Polynesia',
  TF: 'French Southern Territories',
  GA: 'Gabon',
  GM: 'Gambia',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  GD: 'Grenada',
  GP: 'Guadeloupe',
  GU: 'Guam',
  GT: 'Guatemala',
  GG: 'Guernsey',
  GN: 'Guinea',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HM: 'Heard and Mcdonald Islands',
  VA: 'Holy See (Vatican City State)',
  HN: 'Honduras',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran, Islamic Republic of',
  IQ: 'Iraq',
  IE: 'Ireland',
  IM: 'Isle of Man',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JE: 'Jersey',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KP: 'Korea (North)',
  KR: 'Korea (South)',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: 'Lao PDR',
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MK: 'Macedonia, Republic of',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MU: 'Mauritius',
  YT: 'Mayotte',
  MX: 'Mexico',
  FM: 'Micronesia, Federated States of',
  MD: 'Moldova',
  MC: 'Monaco',
  MN: 'Mongolia',
  ME: 'Montenegro',
  MS: 'Montserrat',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands',
  AN: 'Netherlands Antilles',
  NC: 'New Caledonia',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger',
  NG: 'Nigeria',
  NU: 'Niue',
  NF: 'Norfolk Island',
  MP: 'Northern Mariana Islands',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestinian Territory',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PN: 'Pitcairn',
  PL: 'Poland',
  PT: 'Portugal',
  PR: 'Puerto Rico',
  QA: 'Qatar',
  RE: 'Réunion',
  RO: 'Romania',
  RU: 'Russian Federation',
  RW: 'Rwanda',
  BL: 'Saint-Barthélemy',
  SH: 'Saint Helena',
  KN: 'Saint Kitts and Nevis',
  LC: 'Saint Lucia',
  MF: 'Saint-Martin (French part)',
  PM: 'Saint Pierre and Miquelon',
  VC: 'Saint Vincent and Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome and Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  RS: 'Serbia',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  GS: 'South Georgia and the South Sandwich Islands',
  SS: 'South Sudan',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan',
  SR: 'Suriname',
  SJ: 'Svalbard and Jan Mayen Islands',
  SZ: 'Swaziland',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syrian Arab Republic (Syria)',
  TW: 'Taiwan, Republic of China',
  TJ: 'Tajikistan',
  TZ: 'Tanzania, United Republic of',
  TH: 'Thailand',
  TL: 'Timor-Leste',
  TG: 'Togo',
  TK: 'Tokelau',
  TO: 'Tonga',
  TT: 'Trinidad and Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TC: 'Turks and Caicos Islands',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  GB: 'United Kingdom',
  US: 'United States of America',
  UM: 'US Minor Outlying Islands',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VE: 'Venezuela (Bolivarian Republic)',
  VN: 'Viet Nam',
  VI: 'Virgin Islands, US',
  WF: 'Wallis and Futuna Islands',
  EH: 'Western Sahara',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
}

const countries = Object.keys(ctry).map(key => ({ key: key.toLowerCase(), value: ctry[key] }))

const media =
  'data:image/jpeg;base64,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'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = { ...initialState }

    this.fetchWeather = this.fetchWeather.bind(this)
  }

  async fetchWeather({ city, country }) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}${
      country ? `,${country}` : ''
    }&APPID=${API_KEY}&units=metric`

    let resp = false

    try {
      resp = await axios.post(url)
    } catch (e) {
      if (e.message === 'Request failed with status code 404') {
        resp = 404
      }
    }

    if (!resp) {
      this.setState({ ...initialState })
    } else if (resp === 404) {
      this.setState({
        ...initialState,
        notFound: true,
      })
    } else {
      this.setState({
        ...initialState,
        data: resp.data,
      })
    }
  }

  render() {
    const { fetchWeather } = this
    const { loading, notFound, data } = this.state
    const weather = data && data.weather && data.weather[0]

    return (
      <Card className="App">
        <CardMedia className="App__media" image={media} title="Weather App">
          {notFound && <div>NOT FOUND IDIOT</div>}
          {weather && (
            <div className="App__media-inner">
              <Map
                containerElement={<div style={{ height: '100%', opacity: 1 }} />}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDkrrRqeUXM8C--BEfoXeLoEYBwV3YOjYQ&libraries=visualization"
                loadingElement={<div style={{ height: '100%' }} />}
                mapElement={<div style={{ height: '100%' }} />}
                position={{ lat: data.coord.lat, lng: data.coord.lon }}
              />
              <div className="App__media-overlay">
                <Report
                  location={data.name}
                  id={weather.id}
                  icon={weather.icon}
                  timestamp={data.dt}
                  temp={data.main.temp}
                />
              </div>
            </div>
          )}
        </CardMedia>
        <Formik
          initialValues={{
            city: '',
            country: '',
          }}
          onSubmit={values => fetchWeather(values)}
          render={({ values, dirty, handleChange, handleBlur, handleSubmit }) => (
            <Form className="WeatherForm" onSubmit={handleSubmit}>
              <CardContent className="App_content">
                <TextField
                  className="App__field App__field-city"
                  label="City"
                  value={values.city}
                  name="city"
                  id="city"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  fullWidth={true}
                />
                <Select
                  className="App__field App__field-country"
                  disabled={values.city === ''}
                  name="country"
                  id="country"
                  value={values.country}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth={true}
                >
                  <MenuItem value="">No Country</MenuItem>
                  {countries.map(c => (
                    <MenuItem id={c.key} name={c.key} key={c.key} value={c.key}>
                      {c.value}
                    </MenuItem>
                  ))}
                </Select>
              </CardContent>
              <CardActions>
                <Button color="primary" type="submit" disabled={loading || !dirty} size="small">
                  Get Weather
                </Button>
              </CardActions>
            </Form>
          )}
        />
      </Card>
    )
  }
}

export default App
