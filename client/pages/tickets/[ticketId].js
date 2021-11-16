import React from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'


function TicketShow({ticket}) {
    const {doRequest, errors} = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {ticketId: ticket.id},
        onSuccess: (order) => Router.push(`/orders/${order.id}`)
    })
    return (
        <div>
           <h1>{ticket.title}</h1>
           <h4>price: {ticket?.price}</h4>
           {errors}
           <button onClick={() => doRequest()} className='btn btn-primary'>Purchase</button>
        </div>
    )
}


TicketShow.getInitialProps = async (context, client) => {
    console.log('getInitialProps in Ticket Show Page')
    const {ticketId} = context.query;

    console.log('ticket id', ticketId)
    const {data} = await client.get(`/api/tickets/${ticketId}`)

    return {ticket: data}
}

export default TicketShow
