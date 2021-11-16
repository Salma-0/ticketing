import 'bootstrap/dist/css/bootstrap.min.css'
import buildClient from '../api/build-client'
import Header from '../components/Header'

const AppComponent = ({Component, pageProps, currentUser}) => {

    return (
        <>
            <Header currentUser={currentUser}/>
            <div className='container'>
                <Component {...pageProps} currentUser={currentUser}/>
            </div>
        </>
    )
}


AppComponent.getInitialProps = async (appContext) => {
  const {ctx} = appContext
  const client = buildClient(ctx)
  const {data} = await client.get('/api/users/currentuser')
  
  let pageProps = {}
  if(appContext.Component.getInitialProps){
     pageProps = await appContext.Component.getInitialProps(ctx, client, data.currentUser)
    console.log(pageProps)
  }

  return {
      pageProps,
      ...data
  }
}


export default AppComponent;