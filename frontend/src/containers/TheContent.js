import React, {useEffect, Suspense } from 'react'
import {useHistory} from 'react-router-dom'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

// routes config
import routes from '../routes'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)
const TheContent = () => {
  const history = useHistory()
  const user_info = localStorage.getItem('user_info')
  useEffect(()=> {
    if (!user_info) history.push('/login')
  },[])

    return (
      <main className="c-main">
        <CContainer fluid>
          <Suspense fallback={loading}>
            {
               <Switch>
                {
                  routes.map((route, idx) => {
                    return route.component && user_info  && (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <CFade>
                            <route.component {...props} />
                          </CFade>
                        )} />
                    )
                  })}
                <Redirect from="/" to="/dashboard" />
              </Switch>
            }

          </Suspense>
        </CContainer>
      </main>
    )
}
export default React.memo(TheContent)
