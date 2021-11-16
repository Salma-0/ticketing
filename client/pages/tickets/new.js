import {useState} from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

function NewTicket() {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')

    const {doRequest, errors} = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {title, price},
        onSuccess: (ticket)=> Router.push(`/tickets/${ticket.id}`)
    })

    const onBlur = e => {
        const value = parseFloat(price)

        if(isNaN(value)){
            return ;
        }

        setPrice(value.toFixed())
    }

    const onSubmit = e => {
        e.preventDefault()

        doRequest()

    }
    return (
        <div>
            <h1>Create a ticket</h1>
           <form onSubmit={onSubmit}>
               <div className='form-group'>
                   <label>Title</label>
                   <input value={title} onChange={e => setTitle(e.target.value)} type="text" className='form-control' />
               </div>
               <div className='form-group mb-2'>
                   <label>Price</label>
                   <input value={price} onChange={e => setPrice(e.target.value)} type="text" className='form-control' onBlur={onBlur} />
               </div>
               {errors}
               <button type='submit' className='btn btn-primary mt-2'>Submit</button>
           </form>
        </div>
    )
}

export default NewTicket
