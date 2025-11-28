import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {supabase} from '../../lib/supabaseClient'
import './index.css'

class SignUpForm extends Component {
  state = {
    email: '',
    password: '',
    username: '',
    isPrime: false,
    errorMsg: '',
    isSigningUp: false,
  }

  onChangeUsername = event => this.setState({username: event.target.value})

  onChangeEmail = event => this.setState({email: event.target.value})

  onChangePassword = event => this.setState({password: event.target.value})

  onChangePrime = event => this.setState({isPrime: event.target.checked})

  onSubmitForm = async event => {
    event.preventDefault()
    this.setState({isSigningUp: true, errorMsg: ''})
    const {email, password, username, isPrime} = this.state

    try {
      // 1. Create User in Supabase Auth
      const {data: authData, error: authError} = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      // 2. Create User Entry in Database 'users' table
      if (authData.user) {
        const {error: dbError} = await supabase.from('users').insert([
          {
            id: authData.user.id, // Connects to Auth
            username,
            email,
            is_prime: isPrime, // Saves Prime choice
            cart: [], // Initialize empty cart
          },
        ])

        if (dbError) throw dbError
      }

      // eslint-disable-next-line no-alert
      alert('Registration Successful! Please login.')
      const {history} = this.props
      history.replace('/login')
    } catch (error) {
      this.setState({errorMsg: error.message, isSigningUp: false})
    }
  }

  render() {
    const {
      username,
      email,
      password,
      isPrime,
      errorMsg,
      isSigningUp,
    } = this.state

    return (
      <div className="login-form-container">
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
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          className="login-image"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.onSubmitForm}>
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
          <h1 className="heading">Sign Up</h1>

          <div className="input-container">
            <label className="input-label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="username-input-field"
              value={username}
              onChange={this.onChangeUsername}
              placeholder="Username"
            />
          </div>

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

          <div
            className="input-container"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '15px',
            }}
          >
            <input
              type="checkbox"
              id="prime-checkbox"
              checked={isPrime}
              onChange={this.onChangePrime}
              style={{width: '18px', height: '18px', cursor: 'pointer'}}
            />
            <label
              htmlFor="prime-checkbox"
              className="input-label"
              style={{
                marginBottom: 0,
                marginLeft: '10px',
                cursor: 'pointer',
                color: '#0b69ff',
              }}
            >
              Join as Prime Member?
            </label>
          </div>

          <button type="submit" className="login-button" disabled={isSigningUp}>
            {isSigningUp ? 'Registering...' : 'Register'}
          </button>

          {errorMsg && <p className="error-message">*{errorMsg}</p>}

          <p className="signup-link">
            Already have an account? <Link to="/login">Login Now</Link>
          </p>
        </form>
      </div>
    )
  }
}

export default withRouter(SignUpForm)
