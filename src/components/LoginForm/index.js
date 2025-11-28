import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import {supabase} from '../../lib/supabaseClient' // Import Supabase
import './index.css'

class LoginForm extends Component {
  state = {
    email: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeEmail = event => this.setState({email: event.target.value})

  onChangePassword = event => this.setState({password: event.target.value})

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {email, password} = this.state

    try {
      // ONLINE VALIDATION USING SUPABASE
      const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Supabase returns a session object with an access_token
      this.onSubmitSuccess(data.session.access_token)
    } catch (error) {
      this.onSubmitFailure(error.message)
    }
  }

  // ... renderEmailField (same as previous) ...
  // ... renderPasswordField (same as previous) ...

  render() {
    const {email, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        {/* Images code same as before */}

        <form className="form-container" onSubmit={this.submitForm}>
          {/* Logo code same as before */}
          <h1
            style={{
              color: '#0b69ff',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
              fontSize: '40px',
              margin: 0,
            }}
          >
            NexCart
          </h1>
          <div className="input-container">
            <label className="input-label" htmlFor="email">
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              className="username-input-field"
              value={email}
              onChange={this.onChangeEmail}
              placeholder="Email"
            />
          </div>

          <div className="input-container">
            <label className="input-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="password-input-field"
              value={password}
              onChange={this.onChangePassword}
              placeholder="Password"
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}

          <p className="signup-link" style={{marginTop: '20px'}}>
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    )
  }
}

export default LoginForm
