import Link from 'next/link'


function Header({currentUser}) {

    const links = [
     !currentUser && {label: 'Sign Up', href: '/auth/signup'},
     !currentUser && {label: 'Sign In', href:'/auth/signin'},
     currentUser && {label: 'Sell Tickets', href: '/tickets/new'},
     currentUser && {label: 'My Orders', href: '/orders'},
     currentUser && {label: 'Sign Out', href:'/auth/signout'}
    ]
    .filter(linkConfig => linkConfig)
    .map(lnk => 
        <li className='nav-item' key={lnk.href}>
            <Link href={lnk.href}>
                <a className='nav-link'>{lnk.label}</a>
            </Link>
        </li>
    )
   
    return (
        <nav className='navbar navbar-light bg-light p-2'>
           <Link href='/'><a className='navbar-brand'>GitTix</a></Link>   

           <div className='d-flex justify-content-end'>
               <ul className='nav d-flex align-items-center'>
                  {links}
               </ul>
           </div>
        </nav>
    )
}

export default Header
