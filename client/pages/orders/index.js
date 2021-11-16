import React from 'react'

function OrdersIndex({orders}) {
    return (
        <div>
           <ul className='list-group mt-3'>
               {orders.map(order => (
                   <li className='list-group-item' key={order.id}>
                       {order.ticket.title} - <span className={`${order.status === 'complete' ? 'text-success' : ''}`}>{order.status}</span>
                   </li>
               ))}
            </ul>  
        </div>
    )
}

OrdersIndex.getInitialProps = async (context, client) => {
    const {data} = await client.get('/api/orders')

    return {orders: data}
} 

export default OrdersIndex
