import React from 'react'
import { useRouteMatch } from 'react-router'
import { Route } from 'react-router'
import { SignIn } from '../Auth/SignIn'
import { SignUp } from '../Auth/SignUp'

export const AuthRouter = () => {
  const { path } = useRouteMatch()
  return (
    <>
      <Route exact path={path} component={SignIn} />
      <Route path={`${path}/signup`} component={SignUp} />
    </>
  )
}
