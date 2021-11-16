import React from 'react'
import Link from 'next/link'


function LandingPage({currentUser, tickets}) {
    console.log(tickets)
    return (
       <div>
           <h1>Tickets</h1>
           <table className='table'>
               <thead>
                   <tr>
                       <th>Title</th>
                       <th>Price</th>
                       <th>Link</th>
                   </tr>
               </thead>
               <tbody>
                   {
                       tickets.map(ticket => (
                           <tr key={ticket.id}>
                               <td>{ticket.title}</td>
                               <td>{ticket.price}</td>
                               <td>
                                   <Link href={`/tickets/${ticket.id}`}>
                                       view
                                   </Link>
                               </td>
                           </tr>
                       ))
                   }
               </tbody>
           </table>
       </div>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {  
    try {
        const {data} = await client.get('/api/tickets')
        

        return {tickets: data}

    } catch (error) {
        
    }
}

export default LandingPage
