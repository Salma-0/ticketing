import {useState} from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

function Signin() {
    const [formState, setFormState] = useState({
        email: '',
        password: ''
    })

   const { doRequest, errors } = useRequest({
       url: '/api/users/signin',
       method: 'post',
       body: {...formState},
       onSuccess: (data)=> Router.push('/')
   })

    const onChange = e => setFormState({...formState, [e.target.name]: e.target.value})

    const onSubmit = async e => {
        e.preventDefault()
        doRequest()
    }

    return (
        <div className='container py-5'>
            <div className="col-md-6 m-auto">
             <h2>Sign in</h2>
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input type="email" name="email" value={formState.email} className="form-control" onChange={onChange} id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                  <small id="emailHelp" className="form-text text-muted">
                    Email that you have used while registration.
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" name="password" value={formState.password} onChange={onChange} className="form-control" id="password" placeholder="Password" />
                </div>
                <div className="form-check">
                  <input type="checkbox" name="checkbox" className="form-check-input" id="remember" />
                  <label className="form-check-label" htmlFor="remember">
                    Remember me
                  </label>
                </div>
                <button type="submit" className="btn btn-primary float-right">
                  Login
                </button>
                <br/><br/>
                {errors}
              </form>
            </div>
        </div>
    )
}

export default Signin
