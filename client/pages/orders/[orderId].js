import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

function OrderShow({order, currentUser}) {
    const [timeLeft, setTimeLeft] = useState(0)

    const {doRequest, errors} = useRequest({
        method: 'post',
        url: '/api/payments',
        body: {orderId: order.id},
        onSuccess: (charge)=> Router.push('/orders')
    })


    useEffect(()=> {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date()

            setTimeLeft(Math.round(msLeft/1000))
        }

        findTimeLeft()

        const timerId = setInterval(findTimeLeft, 1000)

        return ()=> {
            clearInterval(timerId)
        }

    }, [order])

    if(timeLeft < 0){
        return (
            <div>
                Order Expired
            </div>
        )
    }




    return (
        <div>
            Time left to pay: {timeLeft} seconds
            <br/><br/>
            <StripeCheckout 
               token={token => doRequest({token: token.id})}
               stripeKey="pk_test_zgPYLYyTh5m9s5ijjxJgwSqf"
               amount={order.ticket.price * 100}
               email={currentUser.email}
            />

           <br/><br/>
            {errors}
        </div>
    )
    
}


OrderShow.getInitialProps = async (context, client) => {
    const {orderId} = context.query
    const {data} = await client.get(`/api/orders/${orderId}`)

    return {order: data}
}

export default OrderShow
